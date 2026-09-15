#!/usr/bin/env python3
"""One-shot exact Context file preparation. No product execution or branch writes."""
import argparse
import hashlib
import json
import os
from pathlib import Path
import subprocess
import tempfile

TASK = 'Cocolon_前提資料/system_context/task_profiles.json'
TEST = 'tests/cocolon_context/test_task_context.py'
BEFORE = {
    TASK: '7a63a4fe63b6aeb20aa2528614a2078f3b5acf9f3fe677cfca2e656a5c148ef9',
    TEST: 'd3b3db88a9e23317385a19630bd11e5ae5da7d4747e2672b646b940dc402175c',
}
AFTER = {
    TASK: ('aafdba64884923c6174d2a9098d111c5b0ab56d934519cf6f4b5b742c7b34cca', '9a077b7b10050089bd7ed20d0cc1290072024a85'),
    TEST: ('04c4eaaca9a501a50b016d6647ed6a2e3dcd21031240e0d77c5512b4488c7f3d', '4f5560c05a441dbb0c78d633082cf8e9018e0034'),
}
HANDOFF = 'ai/docs/CMEE_V1A_I1SX_CurrentStateAndNextWorkHandoff_20260816.md'
ROUTE = 'EMLIS_Q1_Q4_IMPLEMENTED_SHARED_QUESTION_ANSWER_QUALITY_CONTINUATION'
API = 'ai/services/ai_inference/'
ENGINE = API + 'cocolon_meaning_experience_engine/'
APP_HEAD = '6a073151facb674efa412e80451403dd50f8bfa6'
API_HEAD = 'ce8466253b99fcf0992a8b5c3ca38284d1fb5ef0'

def sha(raw):
    return hashlib.sha256(raw).hexdigest()

def prepare(root):
    raw = {name: (root / name).read_bytes() for name in BEFORE}
    assert {name: sha(value) for name, value in raw.items()} == BEFORE
    document = json.loads(raw[TASK])
    original_account = json.dumps(document['tasks']['account_profile_read_only'], sort_keys=True)
    cmee = document['tasks']['cmee']
    cmee['current_owner_rules'].append({'repository_keys':['mashos-api'], 'path_globs':[HANDOFF]})
    cmee['task_orientation'] = 'Read the latest valid Emlis Q1-Q4 continuation in the API handoff and current product originals. Preserve initial input, question, independent answer, correction/withdrawal, saved state and current body. Resume shared observation/reception quality work, not historical Round 0, UI/payment work or environment construction; NOT_CLEAR and default OFF remain.'
    categories = cmee['required_categories']
    review = categories[1]['actual_review']
    before = 'Round 0 follow-primary correction is the approved next route'
    after = 'Q1-Q4 implementation is present and the latest valid API handoff owns the current question/answer quality continuation'
    assert review['conclusion'].count(before) == 1
    review['conclusion'] = review['conclusion'].replace(before, after)
    review['required_action'] = 'Keep the inherited CMEE route default OFF. Read the latest valid continuation in ai/docs/CMEE_V1A_I1SX_CurrentStateAndNextWorkHandoff_20260816.md and follow current Mash instructions for initial/answered/corrected/withdrawn response quality. Do not restart Q1-Q4 or historical Round 0, substitute UI/payment/environment work, weaken tests, or infer product PASS, merge, deployment or new permission from Context generation. External Cycle001 assets remain history only.'
    application = [API + name + '.py' for name in ('emlis_thread_config','emlis_thread_service','emlis_thread_store','api_emlis_thread')]
    screens = ['lib/api/emlisThreadApi.js','screens/input/useEmlisThread.js','screens/input/EmlisThreadModal.js','screens/AnalysisHistoryScreen.js','tests/emlis-thread.test.js']
    tests = ['ai/tests/' + name + '.py' for name in ('test_cmee_emlis_q1_thread','test_cmee_emlis_q3_thread','test_emlis_q2_application','test_emlis_q3_application','test_emlis_q4_application')]
    bridge = 'ai/tests/helpers/emlis_q2_postgres.cjs'
    additions = {'cmee_draft_implementation': application, 'rn_display_surface': screens,
                 'api_boundary':[API+'api_emlis_thread.py',API+'emlis_thread_store.py'],
                 'protected_tests': tests + [bridge]}
    for category in categories:
        category['path_globs'] += additions.get(category['id'], [])
    shared = [ENGINE + name + '.py' for name in ('emlis_thread_contracts','emlis_thread_source','emlis_question','emlis_answer_update','emlis_thread_projection','emlis_thread_surface','emlis_thread_engine')]
    cmee['seed_rules'][:0] = [
        {'classification':'CURRENT_OWNER','id':'latest_emlis_quality_continuation','path_globs':[HANDOFF],'repository_keys':['mashos-api']},
        {'classification':'MUST_READ_FULL','id':'emlis_question_answer_shared_current',
         'path_globs':shared+application+tests+screens+[bridge,'supabase/migrations/20260911020509_emlis_input_threads_q2.sql'],
         'repository_keys':['mashos-api','Cocolon']},
    ]
    claim = next(row for row in cmee['operator_contract']['claim_nodes'] if row['claim_id']=='CLAIM.CMEE.PRODUCT_ROUTE')
    claim['asserted_value_code'] = ROUTE
    claim['source_locator']['section_locator'] = 'Latest Q4 and subsequent valid continuation sections; see API current handoff'
    restart = cmee['operator_contract']['collaboration']['restart_packet']
    restart['purpose_code'] = 'READ_LATEST_EMLIS_QUESTION_ANSWER_CONTINUATION_AND_CURRENT_MASH_INSTRUCTIONS'
    restart['next_work_source_claim_ids'] = ['CLAIM.CMEE.PRODUCT_ROUTE']
    assert json.dumps(document['tasks']['account_profile_read_only'],sort_keys=True) == original_account
    updated = {TASK:(json.dumps(document,ensure_ascii=False,indent=2)+'\n').encode()}
    text = raw[TEST].decode()
    for old, new in [
        ('4594e3358bed0d475dde87aa40bb9f7705079649',APP_HEAD),
        ('92cf86b9644771091d59c4a2b76ec9006ed37b47',API_HEAD),
        ('ROUND0_FOLLOW_PRIMARY_VISIBLE_RESPONSE_CORRECTION_APPROVED',ROUTE),
        ('assert product_route_source["section_locator"] == "§86"',
         'assert product_route_source["section_locator"] == "Latest Q4 and subsequent valid continuation sections; see API current handoff"'),
    ]:
        assert text.count(old) == 1
        text = text.replace(old,new)
    updated[TEST] = text.encode()
    compile(text, TEST, 'exec')
    for name, value in updated.items():
        assert sha(value) == AFTER[name][0], name
        assert hashlib.sha1(b'blob '+str(len(value)).encode()+b'\0'+value).hexdigest() == AFTER[name][1], name
    return updated

def main():
    parser=argparse.ArgumentParser()
    parser.add_argument('--stage-exact-blobs',action='store_true')
    parser.add_argument('--root',type=Path,default=Path.cwd())
    args=parser.parse_args()
    updated=prepare(args.root)
    if not args.stage_exact_blobs:
        print(json.dumps({path:{'sha256':sha(value),'git_blob':AFTER[path][1]} for path,value in updated.items()},indent=2))
        return
    expected=os.environ['EXPECTED_HEAD_SHA']
    def check_head():
        current=json.loads(subprocess.check_output(['gh','api','repos/MassyuRed/Cocolon/pulls/37']))
        assert current['state']=='open' and current['draft'] and not current['merged']
        assert current['head']['sha']==expected and current['head']['repo']['full_name']=='MassyuRed/Cocolon'
    check_head()
    # Exactly two content-addressed blobs, no tree/commit/ref, no output adoption.
    results=[]
    for name,raw in updated.items():
        with tempfile.NamedTemporaryFile(mode='w',encoding='utf-8',suffix='.json') as payload:
            json.dump({'content':raw.decode(),'encoding':'utf-8'},payload,ensure_ascii=False)
            payload.flush()
            response=json.loads(subprocess.check_output(['gh','api','--method','POST',
                'repos/MassyuRed/Cocolon/git/blobs','--input',payload.name]))
        assert response['sha']==AFTER[name][1]
        results.append({'path':name,'sha':response['sha'],'sha256':sha(raw),'bytes':len(raw)})
    check_head()
    print('EXACT_PUBLIC_BLOBS_STAGED_NO_REF_WRITE='+json.dumps(results,ensure_ascii=False))
if __name__=='__main__':
    main()
