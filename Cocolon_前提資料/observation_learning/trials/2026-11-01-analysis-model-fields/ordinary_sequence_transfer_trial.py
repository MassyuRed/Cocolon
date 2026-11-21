"""Six fresh synthetic probes of the existing complete-action consumer.

Four finite action sequences and two scope controls; no training/target/raw
repair. Reuse ordinary_prose_trial.py for acquisition, binding and saved reads.
"""
from copy import deepcopy
import importlib.util
from pathlib import Path

spec = importlib.util.spec_from_file_location('ordinary_prose_trial',
    Path(__file__).with_name('ordinary_prose_trial.py'))
trial = importlib.util.module_from_spec(spec)
spec.loader.exec_module(trial)
original_inputs = trial.inputs


def inputs():
    texts = [
        ('ST01', '私は連絡先をメモした。私は会場を調べた。', '仕事'),
        ('ST02', '私は資料を作らなかった。それから、私は順番を決めておいた。', '生活'),
        ('ST03', '僕は考えをノートに書いた。その後、僕は記録を見なかった。', '仕事'),
        ('ST04', '僕は記録を見た。僕は方法を試した。僕は振り返りメモを残した。', '生活'),
        ('ST05', '私は資料を見た。不明な出来事があった。その後、私は分担を決めた。', '仕事'),
        ('ST06', '僕は資料を作った。それから、友人は費用を記録した。', '生活'),
    ]
    rows = deepcopy(original_inputs()[:len(texts)])
    for row, (key, text, category) in zip(rows, texts):
        row['id'] = key
        member, = row['snapshot']['members']
        member['original'].update(memo=text, memo_action='', category=[category])
        row['snapshot']['guard'] = 'analysis-db-cumulative-v1:' + trial.admission.digest([trial.OWNER, member])
        row['provenance'] = 'Karen independently synthetic finite-sequence probes and scope controls; no training target; not a general-quality benchmark'
    return rows


trial.inputs = inputs
if __name__ == '__main__':
    trial.main()
