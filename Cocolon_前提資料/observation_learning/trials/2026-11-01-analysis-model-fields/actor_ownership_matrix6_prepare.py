"""Prepare one independent actor x polarity matrix on CPU; never train or generate.

Usage: python actor_ownership_matrix6_prepare.py API NEW_ROOT SOURCES_JSON
The API must be the existing frozen 4d744e36 worktree. Previous 22 teachers,
their messages/ref, the original N8 and AT21/RU01 anchors remain exact.
No update order or next initial adapter is selected by this preparation.
"""
from __future__ import annotations

import argparse
import copy
from dataclasses import replace
import hashlib
import importlib.util
from importlib.metadata import version
import json
import os
from pathlib import Path
import shutil
import sys
import time

RUNNER = Path('/workspace/actor_ownership_balanced48_trial.py')
RUNNER_SHA = '50d4f048a037d252856315d6ea112abde667f65493358e9a642707b0a6cf8d9e'
PREVIOUS = Path('/workspace/analysis-actor-ownership-balanced48-20261105')
PACK_SHA = 'ea55b497c13fc23c41d993590904b070a893b8b4aca5d20e99b289d376d686af'
SOURCE20_SHA = 'bab10642bb2e2ddd5817d0abdf5d6a80ad378f7cd541dceec1948b1c6cf48a8f'


def sha(path):
    return hashlib.sha256(Path(path).read_bytes()).hexdigest()


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('api', type=Path)
    parser.add_argument('root', type=Path)
    parser.add_argument('sources', type=Path)
    args = parser.parse_args()
    sys.dont_write_bytecode = True
    os.environ.update(HF_HUB_OFFLINE='1', TRANSFORMERS_OFFLINE='1')
    assert sha(RUNNER) == RUNNER_SHA
    old_argv = sys.argv[:]
    try:
        sys.argv = [str(RUNNER), 'prepare', str(args.api), str(args.root)]
        spec = importlib.util.spec_from_file_location('matrix6_balanced_owner', RUNNER)
        base = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(base)
    finally:
        sys.argv = old_argv
    base.check_api()
    assert not args.root.exists(), 'do_not_restart_or_replace_partial_root'
    assert sha(PREVIOUS/'pack.json') == PACK_SHA
    assert sha(PREVIOUS/'source20.json') == SOURCE20_SHA
    assert sha(base.OLD) == base.OLD_SHA
    previous = json.loads((PREVIOUS/'pack.json').read_text())
    source20 = json.loads((PREVIOUS/'source20.json').read_text())
    original = json.loads(base.OLD.read_text())
    added = json.loads(args.sources.read_text())['examples']
    assert len(previous['teachers']) == 22 and len(added) == 6
    assert previous['profile'] == base.PROFILE == 'selected_material.v7'
    assert previous['teachers'][:20] == source20['teachers']
    old22 = copy.deepcopy(previous['teachers'])
    teachers = copy.deepcopy(old22)
    source_keys = ('id', 'owner', 'snapshot', 'assistant_target')
    original_by_id = {r['id']: r for r in original['teachers']}
    for row in old22:
        if row['id'] in {*(f'N{i:02}' for i in range(1, 9)), 'AT21', 'RU01'}:
            assert {k: row[k] for k in source_keys} == {k: original_by_id[row['id']][k] for k in source_keys}
    forbidden_texts = {
        m['original']['memo'] for row in previous['evaluation'] + old22
        for m in row['snapshot']['members']
    }
    prior = json.loads(base.PRIOR.read_text())
    forbidden_texts.update(m['original']['memo'] for c in prior['cases'] for m in c['row']['snapshot']['members'])
    assert len({r['id'] for r in added}) == len(added)
    assert not {r['id'] for r in added} & {r['id'] for r in old22}
    assert not {r['text'] for r in added} & forbidden_texts
    assert all(r['target'] == '僕の資料' and '印刷し' in r['text'] for r in added)
    assert [r['actor_condition'] for r in added] == ['OMITTED']*2 + ['EXPLICIT_SELF']*2 + ['EXPLICIT_OTHER']*2
    assert [r['negative'] is not None for r in added] == [False, True]*3
    for index, row in enumerate(added, 1):
        literal = row['text'].rstrip('。')
        assert literal.count(row['target']) == 1
        if row['actor'] is not None:
            assert literal.count(row['actor']) == 1, 'actor_quote_must_be_unique'
        if row['negative'] is not None:
            assert literal.count(row['negative']) == 1
        snap = base.make_snapshot(old22[0]['snapshot'], old22[0]['owner'], row['text'], 28100+index)
        teachers.append(dict(id=row['id'], owner=old22[0]['owner'], snapshot=snap,
            assistant_target=base.target(literal, row['actor'], row['target'], row['negative'])))
    from transformers import AutoTokenizer
    from serve_emlis_natural_reply import MODEL, REVISION, PINS
    assert {n: version(n) for n in PINS} == PINS
    tokenizer = AutoTokenizer.from_pretrained(MODEL, revision=REVISION,
        local_files_only=True, trust_remote_code=False)
    started = time.monotonic()
    args.root.mkdir()
    base.write(args.root/'report.json', dict(status='STARTED_CPU_ONLY', new_training=0,
        new_generation=0, model_loads=0, normal_adoption=False))
    shutil.copyfile(__file__, args.root/'runner.py')
    shutil.copyfile(RUNNER, args.root/'balanced_owner.py')
    shutil.copyfile(args.sources, args.root/'independent_sources.json')
    shutil.copyfile(PREVIOUS/'pack.json', args.root/'prior_pack.json')
    shutil.copyfile(PREVIOUS/'source20.json', args.root/'source20.json')
    encoded, audits = {}, []
    for row in teachers:
        prepared = base.service.prepare_cumulative_category_units(row['owner'], row['snapshot'], prompt_version=base.PROFILE)
        messages = prepared.messages()
        if 'messages' in row:
            assert row['messages'] == messages and row['request_ref'] == prepared.request_ref
        prompt = tokenizer.apply_chat_template(messages, enable_thinking=False,
            add_generation_prompt=True, tokenize=True, return_dict=False, truncation=False)
        full = tokenizer.apply_chat_template(messages + [dict(role='assistant', content=row['assistant_target'])],
            enable_thinking=False, add_generation_prompt=False, tokenize=True, return_dict=False, truncation=False)
        assert full[:len(prompt)] == prompt and len(prompt) + 2048 <= 8192
        assert len(prompt) < len(full) <= 8192
        assert tokenizer.decode(full[len(prompt):], skip_special_tokens=False,
            clean_up_tokenization_spaces=False) == row['assistant_target'] + '<|im_end|>\n'
        response = base.admission.AnalysisModelQuotedParentUnitsResponse(prepared.request_ref,
            base.admission.digest(messages), hashlib.sha256(row['assistant_target'].encode()).hexdigest(),
            'stop', row['assistant_target'])
        value = replace(prepared, response=response)
        artifact, coverage = base.service.build_cumulative_quoted_parent_candidates(row['owner'], row['snapshot'], model_input=value)
        saved = base.service.serialize_cumulative_quoted_parent_candidates(row['owner'], row['snapshot'],
            model_input=value, artifact=artifact, coverage=coverage)
        with base.guard_saved():
            assert base.service.reload_cumulative_quoted_parent_candidates(row['owner'], row['snapshot'], saved) == (artifact, coverage)
        wire = json.loads(saved)
        assert wire['coverage']['mapped_count'] == 0 and wire['coverage']['unparsed_count'] == 1
        (args.root/(row['id']+'.teacher.candidate.json')).write_text(saved)
        row.update(messages=messages, request_ref=prepared.request_ref)
        encoded[row['id']] = dict(input_ids=full, labels=[-100]*len(prompt)+full[len(prompt):],
            loss_start=len(prompt)-1, logits_positions=len(full)-len(prompt)+1)
        assert encoded[row['id']]['labels'][:len(prompt)] == [-100]*len(prompt)
        assert encoded[row['id']]['labels'][len(prompt):] == full[len(prompt):]
        audits.append(dict(id=row['id'], prompt_tokens=len(prompt), target_tokens=len(full)-len(prompt),
            literal_target_sha256=hashlib.sha256(row['assistant_target'].encode()).hexdigest(),
            messages_sha256=base.admission.digest(messages), request_ref=prepared.request_ref,
            strict_candidate_accepted=True, saved_replay=True, semantic_mapped_count=0))
        base.write(args.root/'audit.json', audits)
    assert teachers[:22] == old22
    base.write(args.root/'teachers.json', dict(teachers=teachers, update_order=None, initial_adapter=None,
        status='CPU_ONLY_NOT_TRAINED', provenance='KAREN_INDEPENDENT_SYNTHETIC_NOT_MASH_DEMONSTRATION',
        normal_adoption=False, next_training_initial_adoption=False))
    base.write(args.root/'encoded.json', encoded)
    base.check_api()
    assert sha(PREVIOUS/'pack.json') == PACK_SHA and sha(PREVIOUS/'source20.json') == SOURCE20_SHA
    assert sha(base.OLD) == base.OLD_SHA
    assert sha(args.root/'prior_pack.json') == PACK_SHA and sha(args.root/'source20.json') == SOURCE20_SHA
    report = dict(status='COMPLETE_CPU_ONLY_NOT_TRAINED', api_commit=base.COMMIT,
        prompt_version=base.PROFILE, old22_exact=True, n8_original_source_target_exact=True,
        anchors2_original_source_target_exact=True, new6=6, teachers=28,
        new_training=0, new_generation=0, model_loads=0, normal_adoption=False,
        update_order=None, initial_adapter=None, next_training_initial_adoption=False,
        model=MODEL, revision=REVISION, pins=PINS, seconds=time.monotonic()-started,
        prior_pack_sha256=PACK_SHA, source20_sha256=SOURCE20_SHA,
        balanced_owner_sha256=RUNNER_SHA, sources_sha256=sha(args.sources),
        teachers_sha256=sha(args.root/'teachers.json'), tokenizer_only=True,
        interpretation='All candidates remain unvalidated/unmapped; no model quality or adoption claim.')
    base.write(args.root/'report.json', report)
    base.write(args.root/'manifest.json', {str(p.relative_to(args.root)):sha(p) for p in args.root.rglob('*') if p.is_file()})
    print(base.canonical(report))


if __name__ == '__main__':
    main()
