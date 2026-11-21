"""Four new synthetic role sources: CPU-only reference admission, replay and tokenizer.

References are authored from each source, never from model raw. No generation,
training, adapter selection or normal/production admission is performed.
"""
from pathlib import Path
from dataclasses import replace
from contextlib import ExitStack
from hashlib import sha256, sha1
from unittest.mock import patch
import copy, json, subprocess, sys

w = Path('/workspace')
api = w/'analysis-semantic-boundaries-api-20261103'
oldfile = w/'analysis-written-role74-20261103/semantic_units_written_role74_plan.json'
out = w/'analysis-role-transfer4-prepared-20261103'
COMMIT = 'dc05dc358d1c44ce47fd844f6041d74f1f74fe6a'
OLD_SHA = 'a557550ee2881814ece6e0c60eee0ece8abc57b9db6b276cf56750ecedc09ec8'
PROFILE = 'semantic_boundaries.v2'
MODEL = 'Qwen/Qwen3.5-4B'
REVISION = '851bf6e806efd8d0a36b00ddf55e13ccb7b8cd0a'
SOURCE_FILE = w/'role-transfer4-sources.json'
SOURCE_FILE_SHA256 = 'c46d7d196037176847cf596c25b7953a1f639569085edbd8f5ec14a41ca67b52'
assert sha256(SOURCE_FILE.read_bytes()).hexdigest() == SOURCE_FILE_SHA256
CASES = json.loads(SOURCE_FILE.read_text())
sys.dont_write_bytecode = True
sys.path[:0] = [str(api/'ai/tools'),str(api/'ai/services/ai_inference'),str(api/'ai/tests')]
sha = lambda p: sha256(Path(p).read_bytes()).hexdigest()


def main():
    assert not out.exists() and sha(oldfile) == OLD_SHA
    assert subprocess.check_output(['git','-C',str(api),'rev-parse','HEAD'],text=True).strip() == COMMIT
    assert not subprocess.check_output(['git','-C',str(api),'status','--porcelain','--untracked-files=no'],text=True).strip()
    old = json.loads(oldfile.read_text())
    assert len(old['teachers']) == 74 and len(old['evaluation']) == 46
    oldrows = old['teachers']+old['evaluation']
    oldtexts = [m['original'].get(f,'') for row in oldrows for m in row['snapshot']['members']
        for f in ('memo','memo_action') if m['original'].get(f,'')]
    oldpairs = [(m['original'].get('memo',''),m['original'].get('memo_action',''))
        for row in oldrows for m in row['snapshot']['members']]
    oldids = {m['original']['id'] for row in oldrows for m in row['snapshot']['members']}
    oldkeys = {row.get('id',row.get('probe_id')) for row in oldrows}
    assert len(CASES) == len({c['id'] for c in CASES}) == len({c['text'] for c in CASES}) == 4
    assert not oldkeys.intersection(c['id'] for c in CASES)
    from test_analysis_model_quoted_parent_units import role_sample
    from test_analysis_cumulative import OWNER
    import analysis_cumulative_service as service
    from cocolon_meaning_experience_engine import MeaningExperienceEngine
    from cocolon_meaning_experience_engine.cores.analysis import intent_compiler as compiler
    from cocolon_meaning_experience_engine.cores.analysis import observed_route_realizer as author
    from cocolon_meaning_experience_engine.cores.analysis.semantic_admission import (
        AnalysisModelQuotedParentUnitsResponse,AnalysisSemanticError,canonical)
    from cocolon_meaning_experience_engine.cores.analysis.source_adapter import AnalysisSourceError
    from transformers import AutoTokenizer
    assert (MODEL,REVISION) == (old['plan']['model'],old['plan']['revision'])
    tok = AutoTokenizer.from_pretrained(MODEL,revision=REVISION,local_files_only=True,trust_remote_code=False)
    out.mkdir()
    source_sha = sha256(canonical(CASES).encode()).hexdigest()
    (out/'sources.json').write_text(json.dumps(CASES,ensure_ascii=False,indent=2)+'\n')
    rows = []
    nonempty_matches = pair_matches = 0
    returned = rejected = 0

    def restore(reload,snap,path):
        with ExitStack() as stack:
            for obj,name in [(MeaningExperienceEngine,'generate'),(compiler,'compile_analysis_unit_candidates'),
                (compiler,'compile_model_written_role_graph'),(author,'realize_analysis_unit_candidates'),
                (author,'realize_model_written_role_graph')]:
                stack.enter_context(patch.object(obj,name,side_effect=AssertionError('saved regeneration')))
            return reload(OWNER,snap,path.read_text())

    for index,case in enumerate(CASES):
        text = case['text']
        nonempty_matches += sum(text == t for t in oldtexts)
        pair_matches += sum((text,'') == pair for pair in oldpairs)
        assert text not in oldtexts and (text,'') not in oldpairs
        snap = role_sample(text)
        identifier = '00000000-0000-0000-0000-%012d' % (92001+index)
        assert identifier not in oldids
        snap['members'][0]['original']['id'] = identifier
        assert snap['members'][0]['original']['memo_action'] == ''
        original_snapshot = copy.deepcopy(snap)
        p = service.prepare_cumulative_quoted_parent_units(OWNER,snap,prompt_version=PROFILE)
        user = json.loads(p.messages()[1]['content'])
        assert len(user['fields']) == 1 and user['fields'][0]['text'] == text
        assert user['fields'][0]['field_path'] == 'memo'
        qualifiers = [dict(kind='EXPLICIT_ACTOR',quote=case['actor'])]
        assert text.startswith(case['actor']+'の役割は')
        if case['negation']:
            assert text.count(case['negation']) == 1
            qualifiers.append(dict(kind='NEGATION',quote=case['negation']))
        if case['epistemic']:
            assert text.count(case['epistemic']) == 1
            qualifiers.append(dict(kind='EPISTEMIC_EXPRESSION',quote=case['epistemic']))
        target = dict(fields=[dict(field=1,units=[dict(node_kind='ROLE',quote=text.rstrip('。．.'),
            parent_quote=None,scope_role=None,qualifiers=qualifiers)])])
        raw = canonical(target)
        for q in qualifiers: assert text.rstrip('。．.').count(q['quote']) == 1
        response = AnalysisModelQuotedParentUnitsResponse(p.request_ref,
            sha256(canonical(p.messages()).encode()).hexdigest(),sha256(raw.encode()).hexdigest(),'stop',raw)
        value = replace(p,response=response)
        units,counts = service.build_cumulative_quoted_parent_candidates(OWNER,snap,model_input=value)
        assert counts['mapped_count'] == 0 and counts['unparsed_count'] == 1
        up = out/(case['id']+'.units.json')
        up.write_text(service.serialize_cumulative_quoted_parent_candidates(OWNER,snap,
            model_input=value,artifact=units,coverage=counts))
        assert restore(service.reload_cumulative_quoted_parent_candidates,snap,up) == (units,counts)
        unit, = units.graph.fields[0].units
        assert unit.node_kind == 'ROLE' and unit.quote == text.rstrip('。．.')
        assert unit.actor == 'UNRESOLVED_NOT_OWNER_DERIVED'
        proposition = compiler._written_role_proposition(text)
        rp = out/(case['id']+'.role.json')
        role_id = coverage = visual = body = None
        reason = None
        try:
            artifact,coverage = service.build_cumulative_written_role_map(OWNER,snap,model_input=value)
        except (AnalysisSemanticError,AnalysisSourceError) as exc:
            assert case['role_admission'] == 'REJECTED' and proposition is None
            reason = str(exc)
            assert reason == 'analysis_written_role_scope_unsupported' and not rp.exists()
            rejected += 1
        else:
            assert case['role_admission'] == 'RETURNED' and proposition is not None
            node, = artifact.graph.nodes
            assert (node.node_kind,node.proposition.actor,node.proposition.arguments,node.polarity,
                node.modality,node.temporal_scope,node.proposition.role_state) == (
                    'ROLE','SELF',(('は',case['role']),),case['polarity'],'fact','past','WRITTEN_PAST_ROLE')
            assert not artifact.graph.edges and len(artifact.graph.unknown_gaps) == 4
            assert coverage['mapped_count'] == 1 and coverage['unparsed_count'] == 0
            rp.write_text(service.serialize_cumulative_written_role_map(OWNER,snap,
                model_input=value,artifact=artifact,coverage=coverage))
            assert restore(service.reload_cumulative_written_role_map,snap,rp) == (artifact,coverage)
            role_id = artifact.artifact_id
            visual = artifact.safe_projection(authenticated_owner_scope=OWNER)
            body = artifact.safe_text_projection(authenticated_owner_scope=OWNER)
            expected_label = text.rstrip('。．.')+'（記録された役割）'
            assert visual['nodes'][0]['visible_label'] == expected_label and expected_label in canonical(body)
            returned += 1
        prompt = tok.apply_chat_template(p.messages(),enable_thinking=False,add_generation_prompt=True,
            tokenize=True,return_dict=False,truncation=False)
        full = tok.apply_chat_template(p.messages()+[dict(role='assistant',content=raw)],enable_thinking=False,
            add_generation_prompt=False,tokenize=True,return_dict=False,truncation=False)
        assert full[:len(prompt)] == prompt and len(prompt)+2048 <= 8192 and len(prompt) < len(full) <= 8192
        assert tok.decode(full[len(prompt):],skip_special_tokens=False,clean_up_tokenization_spaces=False) == raw+'<|im_end|>\n'
        assert snap == original_snapshot
        rows.append(dict(id=case['id'],probe_id=case['id'],owner=OWNER,snapshot=snap,
            prompt_version=PROFILE,request_ref=p.request_ref,messages=p.messages(),
            assistant_target=raw,reference_target_sha256=sha256(raw.encode()).hexdigest(),
            source_bound_candidate_id=units.candidate_id,candidate_coverage=counts,
            expected_role_admission=case['role_admission'],expected_role_reason=reason,
            role_artifact_id=role_id,role_coverage=coverage,role_visual=visual,role_body=body,
            expected_polarity=case['polarity'],prompt_tokens=len(prompt),target_tokens=len(full)-len(prompt),
            full_tokens=len(full),training_use=False,role_vertical=True,
            reference_use='SOURCE_AUTHORED_CPU_REFERENCE_ONLY_NOT_ADMITTED_TO_TRAINING',
            provenance='ROOT_SYNTHETIC_NEW_UNGENERATED_NEAR_TRANSFER_NOT_BLIND_GENERAL_OR_MASH_TEACHING',
            file_reload='MATCHED_NO_ENGINE_BOTH_COMPILERS_BOTH_AUTHORS'))
    assert (returned,rejected,nonempty_matches,pair_matches) == (2,2,0,0)
    assert sha(oldfile) == OLD_SHA
    paths = ['ai/services/ai_inference/analysis_cumulative_service.py',
        'ai/services/ai_inference/cocolon_meaning_experience_engine/cores/analysis/semantic_admission.py',
        'ai/services/ai_inference/cocolon_meaning_experience_engine/cores/analysis/intent_compiler.py',
        'ai/services/ai_inference/cocolon_meaning_experience_engine/cores/analysis/observed_route_realizer.py',
        'ai/tests/test_analysis_model_quoted_parent_units.py','ai/tests/test_analysis_cumulative.py']
    blobs = {p:sha1(b'blob '+str(len((api/p).read_bytes())).encode()+b'\0'+(api/p).read_bytes()).hexdigest() for p in paths}
    result = dict(status='ROLE_TRANSFER4_CPU_PREPARED_NO_MODEL_NO_GPU_PLAN',api_commit=COMMIT,
        model=MODEL,revision=REVISION,prompt_version=PROFILE,old74_plan_sha256=OLD_SHA,source_sha256=source_sha,
        comparison_population=dict(teachers=74,evaluation=46,nonempty_fields=len(oldtexts),
            nonempty_field_exact_matches=0,memo_action_pair_exact_matches=0,
            empty_fields_excluded='Existing typed scope requires one nonempty field; blank action is plumbing, not novelty'),
        expected_typed_role_returned=returned,expected_typed_role_rejected=rejected,rows=rows,
        api_source_blobs=blobs,model_loads=0,generations=0,training_updates=0,
        next_generation_plan_selected=False,next_generation_path=None,adapter_selection=None,
        normal_adoption=False,product_credit=0)
    (out/'result.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
    (out/'manifest.json').write_text(json.dumps({str(p.relative_to(out)):sha(p)
        for p in out.rglob('*') if p.is_file()},indent=2)+'\n')
    print(json.dumps(dict(status=result['status'],rows=4,typed_returned=returned,typed_rejected=rejected,
        nonempty_exact_matches=0,pair_exact_matches=0,model_loads=0,generations=0,training_updates=0)))


if __name__ == '__main__': main()
