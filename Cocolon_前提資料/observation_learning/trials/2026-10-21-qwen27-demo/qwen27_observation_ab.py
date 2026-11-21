#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Runpod A40: compare four initial observations; later continue their actual questions.
Standard library only. Uses the existing llama.cpp and GGUF under /workspace.
No installs, model downloads, fine-tuning, external inference, or Pod lifecycle calls.
Initial: python3 -u /workspace/qwen27_observation_ab.py
Later:   python3 -u /workspace/qwen27_observation_ab.py --answers /workspace/qwen27_ab_answers.json
Both modes stop their own model server. Runpod billing stops only when you press Stop.
"""
import argparse
import csv
import datetime
import hashlib
import json
import os
import pathlib
import signal
import socket
import subprocess
import time
import traceback
import urllib.error
import urllib.request

EXPERIMENT = "qwen27_mash_demo_20261021_v1"
SYSTEM = 'あなたはCocolonのEmlisAIの試作です。相手自身の価値基準を学び、その人の思考経路を理解します。\n行動だけから動機を決めず、本人がなぜそうしたか、何を大事にしているかを必要に応じて問いで確かめます。経験則は探る場所を見つけるために使い、人物タイプを決める根拠にしません。観測者自身の価値観を本人の基準にしません。\n明示された事実と暫定の読みを分け、未確認の原因・人格・相手の意図を断定しません。重要な不足があれば問いを一つ出し、なければ問いはnullです。問いは本人の理由や判断基準を引き出すものにします。助言を急ぎません。\n本人の補足・訂正が来たら根拠に合わせて理解を更新します。初回に述べていない仮説を、以前述べたかのように扱いません。\n日本語の丁寧な自然文を使い、JSONだけを出力してください。キーはresponse（本人への応答150〜250字程度）、question（問い一つまたはnull）、evidence（入力の短い原文引用を二つまで）、unknown（重要な未確認点を二つまで）、update（補足後に理解がどう変わったかを一文。初回はnull）です。'
DEMONSTRATION = '【観測のお手本】\n観測者はMash。相談者の入力・回答は華恋作成の架空例。原文の一部を抜粋・要約した。この人の動機を別の人へ当てはめず、問い方と暫定性を参照する。回答形式は別途の指示に従う。\n\n相談の要約（華恋）：写真サークルの展示会で、頼まれてまとめ役を承諾した。自分で決めてほしいが、相談なく進むと引っかかる。作品時間が取れず、「みんなで作っている」感覚も薄い。\n\nMashの問い：なぜ、まとめ役を引き受けましたか？\n回答の抜粋：去年やったので、私がやるのが一番早いかなと思いました。それに、去年は大変だったけれど、終わったときは嬉しかったんです。\n\nMashの問い：なぜ、相談もなく仕事が進むと不満に思いましたか？\n回答の抜粋：案内画像は、私も少し考えていたんです。\n完成したものが送られてきて「あ、もうこれになったんだ」と感じました。\n私が考えていることも、先に伝えてはいなかったんですよね。\n\nMashの問い：あなたの理想の展示会とはなんですか？\n回答の抜粋：自分の写真を、納得できる形で見てもらいたいです。それと、ほかのメンバーが何を撮って、何を見せたいのかも知りたいです。\n同じ組の別回答の抜粋：案を持ち寄って話した結果なら、自分の案がそのまま通らなくても受け入れられる気はします。\n\nMashの問いの末尾：他の人にやってほしいなら引き受けたつもりだったあなたの役割とはなんでしょうか？\n回答の抜粋：「まとめ役」は、会場との窓口になったり、必要な作業や締切を確認したりする役割だと思っていました。実際の作業は、みんなにも担当してもらうつもりでした。\n同じ組の別回答の抜粋：一番は、自分の作品に使う時間が取れないことです。\n\nMashの暫定観測の要約（華恋）：展示会を「感性の交流の場」として求め、自分の予測範囲で進んでほしい願望が負担につながっているように見える。\nMash自身の説明：この読みは情報がまだ足りてないのをわかってて憶測で言ってる。\n華恋の未確認点：知らずに進むこと自体への抵抗か、予算・締切・後の対応への心配かは分けきれていない。この仮説を正解として扱わない。\n\n問いの狙いとしてMashが説明したこと：その人の判断基準や感情の理由を勝手に決めないために、相手から引き出してその内容を使う。\n各問いの細かな設計理由すべてが説明されたわけではない。\n\n反対の回答の条件例（Mash）：他の人が決めてくれたことでホッとした／自分の担当以外はみんなが進めてほしい、などがあれば「もっと探ったかもね」。\nこれは仮定であり、この相談者の実際の追加回答でも、Mashが完了した仮説修正でもない。\n\nMashの教示の要約（華恋）：相手の価値基準を学び、思考経路を辿る。経験は探る場所を見つけ、自分の価値観の持ち込みにも気づくために使う。行動から人物を二種類へ分類する技術ではない。\n【お手本ここまで】'
CASES = [{'id': 'achievement_run', 'input': '半年前から休日に走るようになり、先日、初めて市民大会の10キロを完走しました。最後まで走れた瞬間は嬉しくて、帰ってからも参加賞を何度か見ていました。職場で話すと「運動が得意なんだね」「次はハーフだね」と盛り上がってくれました。悪い気はしなかったのですが、話が進むほど返事に困り、帰りには大会のことを少し話さなければよかったと思いました。一緒に走った友人から「練習のときより最後までペースが落ちなかったね」と言われたときは、素直に嬉しかったです。記録は参加者の真ん中より後ろでしたが、順位はあまり気になりません。次の大会を検索しては画面を閉じています。走るのをやめたいわけではありません。せっかく達成したのに、なぜこんなふうに引っかかるのかわかりません。'}, {'id': 'moving_mug', 'input': '引っ越しの荷造りをしていて、大学時代から使っているマグカップを残すか迷っています。欠けてはいませんが、内側に茶渋が残り、底も少しがたつきます。最近買ったカップの方が洗いやすく、朝はそちらを使うことが増えました。家族に「使っていないなら処分してもいいんじゃない」と言われ、そのときは納得して処分する箱に入れました。でも翌日、もう一度取り出して洗っていました。高価なものではありませんし、似た形のものも買えます。ほかの古い食器は何枚か手放せました。新居の棚は今より小さいので、何でも残すのは難しいです。かといって、古いものを全部残したいわけでもありません。この一個を残したい理由を聞かれると、うまく説明できなくて、自分でも大げさな気がしています。'}]
TEACHER_SOURCE = {
    "repository": "MassyuRed/Cocolon",
    "commit": "e2f42c86fad3b559ae17846398da7c27030963f3",
    "path": "Cocolon_前提資料/observation_learning/sessions/2026/OBS-20261020-001/03_prompt_demonstration.md",
    "blob": "d2cbfb25108ede473d64c9410b387482c6063c3d",
}
WORKSPACE = pathlib.Path("/workspace")
SERVER = WORKSPACE / "llama-cuda/llama-server"
MODEL = WORKSPACE / "models/Qwen3.8-27B-Q4_K_M.gguf"
ALIAS = "qwen27-observation-ab"
ENDPOINT = "http://127.0.0.1:18765"
CONTEXT = 4096
TOTAL_SECONDS = 900
SETTINGS = dict(max_tokens=700, temperature=0.1, top_p=0.9, top_k=50,
                repeat_penalty=1.05, seed=42, cache_prompt=False, stream=False,
                chat_template_kwargs={"enable_thinking": False})


def utc_now():
    return datetime.datetime.now(datetime.timezone.utc).isoformat()


def sha256(data):
    return hashlib.sha256(data).hexdigest()


def make_initial_jobs():
    jobs = []
    for index, case in enumerate(CASES):
        order = ("without_example", "with_example") if index == 0 else ("with_example", "without_example")
        for condition in order:
            instruction = SYSTEM + ("\n\n" + DEMONSTRATION if condition == "with_example" else "")
            jobs.append(dict(case_id=case["id"], condition=condition,
                             messages=[dict(role="system", content=instruction),
                                       dict(role="user", content=case["input"])]))
    return jobs


def make_followup_jobs(answer_path):
    bundle = json.loads(answer_path.read_text(encoding="utf-8"))
    if bundle.get("schema") != "qwen27_observation_ab_answers_v1":
        raise ValueError("回答ファイルの形式が違います。")
    name = bundle.get("initial_result_name")
    if not isinstance(name, str) or pathlib.Path(name).name != name:
        raise ValueError("初回結果のファイル名が不正です。")
    source_path = WORKSPACE / name
    source_bytes = source_path.read_bytes()
    if sha256(source_bytes) != bundle.get("initial_result_sha256"):
        raise ValueError("回答の対象と、保存された初回結果が一致しません。")
    initial = json.loads(source_bytes)
    if (initial.get("experiment") != EXPERIMENT or initial.get("stage") != "initial"
            or initial.get("status") != "completed"
            or initial.get("settings") != SETTINGS
            or initial.get("cases") != CASES
            or initial.get("demonstration_sha256") != sha256(DEMONSTRATION.encode("utf-8"))):
        raise ValueError("この試験の完了済み初回結果ではありません。")
    records = initial.get("records", [])
    answers = bundle.get("answers", [])
    expected = {(j["case_id"], j["condition"]) for j in make_initial_jobs()}
    record_map = {(r["case_id"], r["condition"]): r for r in records}
    answer_map = {(r["case_id"], r["condition"]): r for r in answers}
    if len(records) != 4 or len(answers) != 4 or set(record_map) != expected or set(answer_map) != expected:
        raise ValueError("初回結果と回答の4条件が揃っていません。")
    jobs = []
    for original in make_initial_jobs():
        key = (original["case_id"], original["condition"])
        record, answer = record_map[key], answer_map[key]
        text = answer.get("answer")
        if not isinstance(text, str) or not text.strip():
            raise ValueError("空の追加回答があります。")
        if record.get("request", {}).get("messages") != original["messages"]:
            raise ValueError("初回の会話内容が、このファイルと一致しません。")
        reply = record.get("reply")
        if not isinstance(reply, str) or not reply.strip():
            raise ValueError("初回のモデル応答がありません。")
        jobs.append(dict(case_id=key[0], condition=key[1],
                         messages=original["messages"] + [
                             dict(role="assistant", content=reply), dict(role="user", content=text)],
                         answer_provenance=answer.get("provenance"),
                         initial_question=record.get("question"),
                         answer_kind=answer.get("answer_kind", "answer_to_generated_question")))
    return jobs, dict(initial_result_name=name, initial_result_sha256=sha256(source_bytes),
                      answers_sha256=sha256(answer_path.read_bytes()))


def post_or_get(route, payload=None, timeout=20):
    # Loopback requests must not be forwarded through an inherited HTTP proxy.
    opener = urllib.request.build_opener(urllib.request.ProxyHandler({}))
    data = None if payload is None else json.dumps(payload, ensure_ascii=False).encode("utf-8")
    request = urllib.request.Request(ENDPOINT + route, data=data,
                                    headers={"Content-Type": "application/json"})
    try:
        with opener.open(request, timeout=timeout) as response:
            raw = response.read().decode("utf-8")
        return json.loads(raw)
    except urllib.error.HTTPError as error:
        body = error.read().decode("utf-8", "replace")
        raise RuntimeError("HTTP %s: %s" % (error.code, body)) from error


def count_and_check(payload, timeout=20):
    result = post_or_get("/v1/chat/completions/input_tokens", payload, timeout)
    count = result.get("input_tokens")
    if type(count) is not int or count < 1:
        raise ValueError("モデルの実トークン数を確認できませんでした。")
    if count + payload["max_tokens"] + 32 > CONTEXT:
        raise ValueError("会話と生成枠が4096トークンに収まりません。文章は切らずに停止します。")
    return count


def tail(path, lines=80):
    if not path.exists():
        return ""
    with path.open("rb") as handle:
        handle.seek(max(0, path.stat().st_size - 24000))
        return "\n".join(handle.read().decode("utf-8", "replace").splitlines()[-lines:])


def stop_owned_server(process):
    result = dict(pid=process.pid)
    for sig, wait in ((signal.SIGTERM, 5), (signal.SIGKILL, 2)):
        try:
            os.killpg(process.pid, sig)
            result[signal.Signals(sig).name] = True
        except ProcessLookupError:
            pass
        try:
            process.wait(timeout=wait)
        except subprocess.TimeoutExpired:
            pass
    result["returncode"] = process.poll()
    return result


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--answers", type=pathlib.Path)
    args = parser.parse_args(argv)
    if not WORKSPACE.is_dir():
        print("RunpodのJupyterで実行してください。/workspaceがありません。", flush=True)
        return 1
    stage = "followup" if args.answers else "initial"
    stamp = datetime.datetime.now(datetime.timezone.utc).strftime("%Y%m%d_%H%M%S_%f")
    output = WORKSPACE / ("qwen27_ab_" + stage + "_" + stamp + ".json")
    server_log = WORKSPACE / ("qwen27_ab_server_" + stamp + ".log")
    started = time.monotonic()
    deadline = started + TOTAL_SECONDS
    state = dict(experiment=EXPERIMENT, stage=stage, status="running", started_utc=utc_now(),
                 model=MODEL.name, runtime="llama.cpp b11784 CUDA12.8",
                 teacher_source=TEACHER_SOURCE, system=SYSTEM, demonstration=DEMONSTRATION,
                 demonstration_sha256=sha256(DEMONSTRATION.encode("utf-8")),
                 cases=CASES, settings=SETTINGS, context=CONTEXT, records=[],
                 fine_tuning_performed=False, cmee_integration_performed=False,
                 pod_stopped_by_script=False, application_level_retries=0,
                 server_log=str(server_log), total_script_limit_seconds=TOTAL_SECONDS,
                 method=("Two new fictional cases. Initial input/model/settings are paired; "
                         "only demonstration inclusion differs. Conditions have separate histories. "
                         "Follow-up answers are written by Karen from the same frozen fictional facts "
                         "after reading each actual question, so follow-up input texts may differ. "
                         "This is an exploratory dialogue comparison, not training or product acceptance."))
    process = None
    log_handle = None

    def save():
        temp = output.with_suffix(".json.tmp")
        temp.write_text(json.dumps(state, ensure_ascii=False, indent=2), encoding="utf-8")
        os.replace(temp, output)

    def remaining(limit):
        value = min(limit, deadline - time.monotonic())
        if value <= 0:
            raise TimeoutError("試験の15分上限に達しました。")
        return value

    def interrupted(signum, frame):
        raise RuntimeError("試験を中断しました（signal %s）。" % signum)

    print("保存先: " + str(output), flush=True)
    print("最大15分で処理を終了します。Podの課金停止は最後に画面のStopで行ってください。", flush=True)
    handlers = {sig: signal.signal(sig, interrupted) for sig in (signal.SIGINT, signal.SIGTERM, signal.SIGALRM)}
    signal.setitimer(signal.ITIMER_REAL, TOTAL_SECONDS)
    code = 1
    save()
    try:
        jobs, source = make_followup_jobs(args.answers) if args.answers else (make_initial_jobs(), None)
        state["followup_source"] = source
        if not SERVER.is_file() or not MODEL.is_file():
            raise RuntimeError("保存済みの27Bモデルか実行ファイルがありません。27Bを使ったA40のPodで実行してください。")
        with MODEL.open("rb") as model_handle:
            if model_handle.read(4) != b"GGUF":
                raise RuntimeError("モデルファイルがGGUFではありません。")
        state["model_file_size"] = MODEL.stat().st_size
        env = {k: v for k, v in os.environ.items() if not k.startswith("LLAMA_ARG_")}
        env["LD_LIBRARY_PATH"] = str(SERVER.parent) + (":" + env["LD_LIBRARY_PATH"] if env.get("LD_LIBRARY_PATH") else "")
        version = subprocess.run([str(SERVER), "--version"], capture_output=True, text=True,
                                 env=env, timeout=remaining(20), check=True)
        state["binary_version"] = version.stdout + version.stderr
        if "11784" not in state["binary_version"] or "493253f" not in state["binary_version"]:
            raise RuntimeError("前回と同じllama.cpp b11784を確認できませんでした。")
        query = subprocess.run(["nvidia-smi", "--query-gpu=name,memory.total,memory.free,driver_version",
                                "--format=csv,noheader,nounits"], capture_output=True, text=True,
                               timeout=remaining(15), check=True)
        rows = list(csv.reader(query.stdout.strip().splitlines()))
        state["gpu_before"] = rows
        if len(rows) != 1 or "A40" not in rows[0][0] or float(rows[0][1]) < 44000 or float(rows[0][2]) < 40000:
            raise RuntimeError("空きメモリのあるA40を確認できませんでした。GPUとPodを確認してください。")
        with socket.socket() as probe:
            probe.bind(("127.0.0.1", 18765))
        command = [str(SERVER), "-m", str(MODEL), "--alias", ALIAS,
                   "--host", "127.0.0.1", "--port", "18765",
                   "-c", str(CONTEXT), "-np", "1", "-ngl", "99", "-t", "8", "-tb", "8",
                   "--jinja", "--chat-template-kwargs", '{"enable_thinking":false}',
                   "--reasoning", "off", "--reasoning-budget", "0",
                   "--no-context-shift", "--no-cache-prompt", "--no-ui", "--no-warmup"]
        state["server_command"] = command
        save()
        print("27Bを起動しています。モデルの再ダウンロードは行いません。", flush=True)
        log_handle = server_log.open("ab", buffering=0)
        process = subprocess.Popen(command, env=env, cwd=WORKSPACE, stdin=subprocess.DEVNULL,
                                   stdout=log_handle, stderr=subprocess.STDOUT, start_new_session=True)
        state["server_pid"] = process.pid
        save()
        startup_end = time.monotonic() + remaining(180)
        progress = time.monotonic() + 20
        while True:
            if process.poll() is not None:
                raise RuntimeError("27Bサーバーが起動中に終了しました。")
            if time.monotonic() >= startup_end:
                raise TimeoutError("27Bの起動が3分以内に完了しませんでした。")
            try:
                if post_or_get("/health", timeout=2).get("status") == "ok":
                    break
            except (urllib.error.URLError, TimeoutError, RuntimeError):
                pass
            if time.monotonic() >= progress:
                print("27Bの起動を待っています。", flush=True)
                progress = time.monotonic() + 20
            time.sleep(0.5)
        state["server_props"] = post_or_get("/props", timeout=remaining(10))
        props = state["server_props"]
        if (props.get("default_generation_settings", {}).get("n_ctx") != CONTEXT
                or props.get("total_slots") != 1
                or pathlib.Path(props.get("model_path", "")).resolve() != MODEL.resolve()):
            raise RuntimeError("起動したモデル・コンテキスト・スロットが指定と一致しません。")
        state["model_ready_utc"] = utc_now()
        save()
        for index, job in enumerate(jobs, 1):
            record = dict(job, turn=2 if args.answers else 1, started_utc=utc_now())
            payload = dict(model=ALIAS, messages=job["messages"], **SETTINGS)
            record["request"] = payload
            state["records"].append(record)
            save()
            record["input_tokens_checked"] = count_and_check(payload, remaining(30))
            save()
            print("%s/4 生成開始: %s / %s" % (index, job["case_id"], job["condition"]), flush=True)
            begin = time.monotonic()
            try:
                response = post_or_get("/v1/chat/completions", payload, remaining(180))
                record["response"] = response
                choice = response["choices"][0]
                record["finish_reason"] = choice.get("finish_reason")
                reply = choice.get("message", {}).get("content")
                if choice.get("finish_reason") != "stop" or not isinstance(reply, str) or not reply.strip():
                    raise RuntimeError("モデル応答が空、または生成が途中で終了しました。自動再試行はしません。")
                record["reply"] = reply
                try:
                    parsed = json.loads(reply)
                    record["parsed_model_json"] = parsed
                    if isinstance(parsed, dict):
                        record["question"] = parsed.get("question")
                except json.JSONDecodeError as error:
                    record["model_json_error"] = str(error)
            finally:
                record["wall_seconds"] = time.monotonic() - begin
                record["ended_utc"] = utc_now()
                save()
            print("%s/4 生成完了（%.2f秒）" % (index, record["wall_seconds"]), flush=True)
        state["status"] = "completed"
        state["completed_utc"] = utc_now()
        code = 0
    except BaseException as error:
        state["status"] = "stopped_with_error"
        state["error"] = dict(type=type(error).__name__, message=str(error), traceback=traceback.format_exc())
        print("途中で停止しました: " + str(error), flush=True)
    finally:
        signal.setitimer(signal.ITIMER_REAL, 0)
        if process is not None:
            try:
                state["server_cleanup"] = stop_owned_server(process)
            except Exception as error:
                state["cleanup_error"] = str(error)
        if log_handle is not None:
            log_handle.close()
        state["server_log_tail"] = tail(server_log)
        state["ended_utc"] = utc_now()
        state["total_script_wall_seconds"] = time.monotonic() - started
        save()
        for sig, handler in handlers.items():
            signal.signal(sig, handler)
        print("\n" + ("4回の生成が完了しました。" if code == 0 else "途中までの結果を保存しました。"), flush=True)
        print("保存先: " + str(output), flush=True)
        print("【次の操作】結果JSONをDownloadし、華恋へ送ってください。", flush=True)
        print("【重要】Podは停止していません。Runpod画面でStopを押してください。", flush=True)
    return code


if __name__ == "__main__":
    raise SystemExit(main())
