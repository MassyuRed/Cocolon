---
doc_id: cocolon_db_rename_boundary
title: "Cocolon DB情報 / DB rename境界資料"
revision_date: "2026-04-30"
source_repositories:
  - Cocolon
  - mashos-api
source_mode: "local_snapshot + SQL結果.zip"
purpose: "DB physical name / bridge view / write path / rename境界を、華恋が作業時に取り違えないためのDB情報として固定する"
---

# 0. この資料の位置づけ

この資料は、DB作業の残タスク表ではありません。  
CocolonのDB physical name、current bridge view、write path、rename境界を華恋が読み間違えないためのDB情報資料です。

DBに旧名称が残っていても、それだけでrename対象とは扱いません。  
rename / drop / write switch を判断する時は、実DB状態、API write path、RLS、trigger、RPC、JSON payload、public contractを同時に見ます。

# 1. 結論

現時点では **DB physical rename / drop は実行しません**。

2026-04-26 時点で、low / medium / high `pieces` の current-name bridge view は作成済みです。ただしこれは physical rename ではなく、API read-only 移行のための backend-readonly bridge view です。

理由:

- current名 table の多くはまだ存在せず、旧物理名 table が実体です。
- `follow_requests` は current名 table が既に存在し、`friend_requests` / `myprofile_requests` と単純統合できません。
- RLS policy / trigger / RPC / view / JSON payload に旧語彙が残っています。
- API側は current owner 本体化済みですが、DB physical name は旧名を参照する段階です。

# 2. 参照したSQL結果

- `SQL 1`: 旧名称・current名称を含む DB object 一覧
- `SQL 2`: DB rename候補の old/current table 存在確認
- `SQL 3`: column 一覧
- `SQL 4`: constraint / FK / unique / check
- `SQL 5`: index
- `SQL 6`: RLS policy
- `SQL 7`: trigger
- `SQL 8`: view / materialized view
- `SQL 9`: RPC / function
- `SQL 10`: row規模
- `SQL 11`: code系column件数
- `SQL 12`: enum/scope/report_type/source旧語彙
- `SQL 13`: JSON / JSONB旧語彙件数

# 3. DB object一覧

| schema | object_type | object_name | size | matching_terms |
| --- | --- | --- | --- | --- |
| public | sequence | friend_emotion_feed_id_seq | 8192 bytes | friend |
| public | sequence | friend_links_id_seq | 8192 bytes | friend |
| public | sequence | friend_requests_id_seq | 8192 bytes | friend |
| public | sequence | mymodel_create_questions_id_seq | 8192 bytes | mymodel |
| public | sequence | myprofile_requests_id_seq | 8192 bytes | myprofile |
| public | table | analysis_results | 15 MB | analysis |
| public | table | follow_requests | 72 kB | follow |
| public | table | friend_emotion_feed | 848 kB | friend |
| public | table | friend_feed_reads | 56 kB | friend |
| public | table | friend_feed_summaries | 3616 kB | friend |
| public | table | friend_links | 16 kB | friend |
| public | table | friend_notification_settings | 24 kB | friend |
| public | table | friend_request_reads | 56 kB | friend |
| public | table | friend_requests | 80 kB | friend |
| public | table | friendships | 40 kB | friend |
| public | table | mymodel_create_answers | 72 kB | mymodel |
| public | table | mymodel_create_questions | 48 kB | mymodel |
| public | table | mymodel_qna_discovery_logs | 128 kB | discover, mymodel |
| public | table | mymodel_qna_echoes | 144 kB | echo, mymodel |
| public | table | mymodel_qna_metrics | 112 kB | mymodel |
| public | table | mymodel_qna_reads | 32 kB | mymodel |
| public | table | mymodel_qna_resonance_logs | 96 kB | mymodel, resonance |
| public | table | mymodel_qna_resonances | 48 kB | mymodel, resonance |
| public | table | mymodel_qna_view_logs | 96 kB | mymodel |
| public | table | mymodel_reflections | 59 MB | mymodel, reflection |
| public | table | mymodel_structure_patterns | 64 kB | mymodel |
| public | table | myprofile_links | 24 kB | myprofile |
| public | table | myprofile_reports | 408 kB | myprofile |
| public | table | myprofile_requests | 48 kB | myprofile |
| public | table | myweb_reports | 5080 kB | myweb |
| public | view | v_mymodel_qna_discovery_inputs | 0 bytes | discover, mymodel |
| public | view | v_mymodel_qna_echo_inputs | 0 bytes | echo, mymodel |

# 4. old/current table存在確認

| old physical | old_exists | current candidate | current_exists | estimated_rows(old) | phase_note |
| --- | --- | --- | --- | --- | --- |
| friend_emotion_feed | True | emotion_log_feed | False | 3193 | EmotionLog feed table candidate |
| friend_feed_summaries | True | emotion_log_feed_summaries | False | 1270 | EmotionLog feed summary candidate |
| friend_notification_settings | True | emotion_notification_settings | False | 1 | EmotionNotification settings candidate |
| friend_requests | True | follow_requests | True | 11 | Friend request table candidate |
| friendships | True | follow_links | False | 12 | Friendship / follow relation candidate |
| mymodel_create_answers | True | profile_create_answers | False | 21 | ProfileCreate answers candidate |
| mymodel_create_questions | True | profile_create_questions | False | 20 | ProfileCreate questions candidate |
| mymodel_qna_echoes | True | piece_resonances | False | 5 | Piece Resonance candidate |
| mymodel_qna_metrics | True | piece_metrics | False | 15 | Piece metrics candidate |
| mymodel_qna_reads | True | piece_reads | False | 35 | Piece read-state candidate |
| mymodel_qna_resonance_logs | True | piece_resonance_logs | False | 5 | Piece resonance log candidate |
| mymodel_qna_resonances | True | piece_resonances | False | 5 | Piece Resonance candidate |
| mymodel_qna_view_logs | True | piece_view_logs | False | 26 | Piece view log candidate |
| mymodel_reflections | True | pieces | False | 3086 | Piece library candidate |
| myprofile_links | True | follow_links | False | 12 | Follow link table candidate |
| myprofile_reports | True | self_structure_reports | False | 10 | Self Structure report table candidate |
| myprofile_requests | True | follow_requests | True | 1 | Follow request table candidate |
| myweb_reports | True | analysis_reports | False | 477 | Analysis report table candidate |

# 5. bridge view / alias候補

ここは current 名へ寄せる候補ですが、現時点では physical rename ではなく **review済み bridge view候補** として扱います。

| old physical | current bridge candidate | area | risk | estimated_rows |
| --- | --- | --- | --- | --- |
| myweb_reports | analysis_reports | Analysis reports | medium | 477 |
| myprofile_reports | self_structure_reports | Self Structure reports | medium | 10 |
| friend_emotion_feed | emotion_log_feed | EmotionLog feed | medium | 3193 |
| friend_feed_summaries | emotion_log_feed_summaries | EmotionLog feed summaries | medium | 1270 |
| friend_notification_settings | emotion_notification_settings | Emotion notification settings | low | 1 |
| mymodel_create_questions | profile_create_questions | ProfileCreate questions | low | 20 |
| mymodel_create_answers | profile_create_answers | ProfileCreate answers | low | 21 |
| mymodel_reflections | pieces | Piece library | high | 3086 |
| mymodel_qna_metrics | piece_metrics | Piece metrics | low | 15 |
| mymodel_qna_reads | piece_reads | Piece reads | low | 35 |
| mymodel_qna_view_logs | piece_view_logs | Piece view logs | low | 26 |
| mymodel_qna_resonance_logs | piece_resonance_logs | Piece resonance logs | low | 5 |

# 6. 今は単純renameしない候補

| source | target candidate | reason |
| --- | --- | --- |
| friend_requests + myprofile_requests + follow_requests | follow_requests | current名 follow_requests が既に存在し、旧2系統とは schema/意味が違う |
| friendships + myprofile_links | follow_links | symmetric relation と directed follow/access check が混在 |
| mymodel_qna_echoes + mymodel_qna_resonances | piece_resonances | 2系統が同一current概念へ向かうが schema が違う |
| mymodel_qna_discovery_logs | piece_discovery_logs / nexus_discovery_logs | account status / material snapshot / view source に残るため設計未確定 |
| mymodel_structure_patterns | self_structure_patterns | owner/consumer境界確認前 |
| profiles.friend_code / profiles.myprofile_code | connect/share code vocabulary | 24 profile全件で両方non-null。trigger/function/indexを伴う |

# 7. row規模

| table | estimated_live_rows | estimated_dead_rows | last_autoanalyze |
| --- | --- | --- | --- |
| analysis_results | 1805 | 108 | 2026-04-23 15:01:50.82104+00 |
| follow_requests | 3 | 3 |  |
| friend_emotion_feed | 3193 | 0 | 2026-04-16 17:41:16.3718+00 |
| friend_feed_reads | 18 | 51 | 2026-04-13 10:51:41.631003+00 |
| friend_feed_summaries | 1270 | 93 | 2026-04-20 18:18:41.571041+00 |
| friend_links | 0 | 0 |  |
| friend_notification_settings | 1 | 1 |  |
| friend_request_reads | 6 | 16 | 2026-03-16 21:17:58.838415+00 |
| friend_requests | 11 | 27 |  |
| friendships | 12 | 14 |  |
| mymodel_create_answers | 21 | 36 | 2026-03-13 06:19:58.77042+00 |
| mymodel_create_questions | 20 | 31 |  |
| mymodel_qna_discovery_logs | 4 | 4 |  |
| mymodel_qna_echoes | 5 | 4 |  |
| mymodel_qna_metrics | 15 | 26 | 2026-03-30 15:46:14.33668+00 |
| mymodel_qna_reads | 35 | 27 | 2026-03-13 08:49:19.022202+00 |
| mymodel_qna_resonance_logs | 5 | 14 |  |
| mymodel_qna_resonances | 5 | 15 |  |
| mymodel_qna_view_logs | 26 | 36 | 2026-03-13 08:49:19.029187+00 |
| mymodel_reflections | 3086 | 114 | 2026-04-14 08:05:39.756179+00 |
| mymodel_structure_patterns | 13 | 14 | 2026-04-14 20:56:14.717066+00 |
| myprofile_links | 12 | 6 |  |
| myprofile_reports | 10 | 24 | 2026-04-24 10:09:43.94096+00 |
| myprofile_requests | 1 | 1 |  |
| myweb_reports | 477 | 67 | 2026-04-24 08:56:40.762317+00 |

# 8. code系column状態

値そのものは記載せず、件数だけ固定します。

| table | column | total_rows | non_null_rows | distinct_values |
| --- | --- | --- | --- | --- |
| account_visibility_settings | is_friend_code_public | 24 | 24 | 2 |
| profiles | friend_code | 24 | 24 | 24 |
| profiles | myprofile_code | 24 | 24 | 24 |

# 9. source / type的な値に残る旧語彙

| table/view | column | value_text | row_count |
| --- | --- | --- | --- |
| v_all_inputs | source | mymodel_qna_echo | 5 |
| v_all_inputs | source | mymodel_qna_discovery | 4 |
| v_all_inputs_plus_create | source | mymodel_create | 21 |
| v_all_inputs_plus_create | source | mymodel_qna_echo | 5 |
| v_all_inputs_plus_create | source | mymodel_qna_discovery | 4 |
| v_mymodel_qna_discovery_inputs | source | mymodel_qna_discovery | 4 |
| v_mymodel_qna_echo_inputs | source | mymodel_qna_echo | 5 |

# 10. JSON / JSONB内の旧語彙件数

本文は出さず、該当件数のみ固定します。

| table | column | matching_rows |
| --- | --- | --- |
| account_status_summaries | meta | 5 |
| account_status_summaries | payload | 565 |
| analysis_results | payload | 1378 |
| astor_jobs | payload | 12763 |
| friend_feed_summaries | meta | 1270 |
| friend_feed_summaries | payload | 1270 |
| generation_locks | context | 3 |
| global_activity_summaries | payload | 44 |
| material_snapshots | payload | 1240 |
| mymodel_create_answers | reflection_format_meta | 16 |
| mymodel_reflections | content_json | 1695 |
| myprofile_reports | content_json | 10 |
| myweb_reports | content_json | 419 |
| ranking_boards | meta | 25 |
| ranking_boards | payload | 25 |
| report_distribution_push_candidates | open_target_json | 203 |
| report_distribution_push_deliveries | payload_json | 176 |
| subscription_plan_catalog | features_json | 2 |

# 11. trigger

| table | trigger | timing | event | action | terms |
| --- | --- | --- | --- | --- | --- |
| friend_request_reads | trg_friend_request_reads_set_updated_at | BEFORE | UPDATE | EXECUTE FUNCTION tg_friend_request_reads_set_updated_at() | friend |
| mymodel_create_questions | trg_mymodel_create_questions_updated_at | BEFORE | UPDATE | EXECUTE FUNCTION set_updated_at() | mymodel |
| mymodel_reflections | trg_touch_mymodel_reflections_updated_at | BEFORE | UPDATE | EXECUTE FUNCTION touch_mymodel_reflections_updated_at() | mymodel, reflection |
| myweb_reports | myweb_reports_set_updated_at | BEFORE | UPDATE | EXECUTE FUNCTION set_updated_at_myweb_reports() | myweb |
| profiles | set_friend_code_before_insert | BEFORE | INSERT | EXECUTE FUNCTION set_friend_code_on_profiles() | friend, friend_code |
| profiles | trg_ensure_myprofile_code | BEFORE | INSERT | EXECUTE FUNCTION ensure_myprofile_code() | myprofile, myprofile_code |

# 12. view / materialized view

| view | type | terms |
| --- | --- | --- |
| v_all_inputs | view | discover, echo, mymodel |
| v_all_inputs_plus_create | view | mymodel |
| v_mymodel_qna_discovery_inputs | view | discover, mymodel |
| v_mymodel_qna_echo_inputs | view | echo, mymodel |

# 13. RPC / function

| function | arguments | result_type | terms |
| --- | --- | --- | --- |
| account_status_summary | p_target_user_id uuid | TABLE(user_id uuid, login_days_total integer, login_streak_max integer, input_count_total integer, input_chars_total integer, mymodel_questions_total integer, mymodel_views_total integer, mymodel_resonances_total integer, mymodel_discoveries_total integer) | discover, mymodel, resonance |
| account_status_summary_v1 | p_target_user_id uuid | TABLE(user_id uuid, login_days_total bigint, login_streak_max integer, input_count_total bigint, input_chars_total bigint, mymodel_questions_total bigint, mymodel_views_total bigint, mymodel_resonances_total bigint) | mymodel, resonance |
| account_status_summary_v2 | p_target_user_id uuid | TABLE(user_id uuid, login_days_total integer, login_streak_max integer, input_count_total integer, input_chars_total integer, mymodel_questions_total integer, mymodel_views_total integer, mymodel_resonances_total integer, mymodel_discoveries_total integer) | discover, mymodel, resonance |
| ensure_myprofile_code |  | trigger | myprofile, myprofile_code |
| generate_friend_code | p_len integer DEFAULT 10 | text | friend, friend_code |
| generate_myprofile_code | p_len integer DEFAULT 10 | text | myprofile, myprofile_code |
| mymodel_qna_list_v1 | p_viewer_user_id uuid, p_target_user_id uuid, p_effective_tier text, p_limit integer DEFAULT 2000 | TABLE(title text, q_key text, q_instance_id text, generated_at timestamp with time zone, views integer, resonances integer, discoveries integer, is_new boolean) | discover, mymodel, resonance |
| mymodel_qna_unread_v1 | p_viewer_user_id uuid, p_target_user_id uuid, p_effective_tier text | TABLE(total_items integer, unread_count integer) | mymodel |
| myprofile_follow_list_v1 | p_target_user_id uuid, p_tab text DEFAULT 'following'::text, p_limit integer DEFAULT 1000 | TABLE(id uuid, display_name text, friend_code text, myprofile_code text, is_private_account boolean) | follow, friend, friend_code, myprofile, myprofile_code |
| rank_mymodel_discoveries | p_range text, p_limit integer | TABLE(rank integer, user_id uuid, discovery_count integer) | discover, mymodel |
| rank_mymodel_questions | p_range text, p_limit integer DEFAULT 30 | TABLE(rank integer, user_id uuid, mymodel_questions_total integer) | mymodel |
| rank_mymodel_questions_v2 | p_range text, p_limit integer | TABLE(rank integer, user_id uuid, mymodel_questions_total integer, value integer, display_name text, is_private_account boolean) | mymodel |
| rank_mymodel_resonances | p_range text, p_limit integer DEFAULT 30 | TABLE(rank integer, user_id uuid, resonance_count bigint) | mymodel, resonance |
| rank_mymodel_used | p_range text DEFAULT 'week'::text, p_limit integer DEFAULT 30 | TABLE(user_id uuid, used_count bigint, rank integer) | mymodel |
| rank_mymodel_used_v2 | p_range text, p_limit integer | TABLE(rank integer, user_id uuid, used_count integer, value integer, display_name text, is_private_account boolean) | mymodel |
| rank_mymodel_views | p_range text, p_limit integer DEFAULT 30 | TABLE(rank integer, user_id uuid, view_count bigint) | mymodel |
| refresh_daily_global_activity | p_activity_date date DEFAULT NULL::date, p_tz text DEFAULT 'Asia/Tokyo'::text | daily_global_activity | discover, echo, mymodel, reflection |
| set_friend_code_on_profiles |  | trigger | friend, friend_code |
| set_updated_at_myweb_reports |  | trigger | myweb |
| tg_friend_request_reads_set_updated_at |  | trigger | friend |
| touch_mymodel_reflections_updated_at |  | trigger | mymodel, reflection |

# 14. public columns with old/current terms

| table | pos | column | type | nullable | default | terms |
| --- | --- | --- | --- | --- | --- | --- |
| account_visibility_settings | 2 | is_friend_code_public | boolean | NO | true | friend, friend_code |
| analysis_results | 1 | id | uuid | NO | gen_random_uuid() | analysis |
| analysis_results | 2 | target_user_id | uuid | NO |  | analysis |
| analysis_results | 3 | snapshot_id | text | NO |  | analysis |
| analysis_results | 4 | analysis_type | text | NO |  | analysis |
| analysis_results | 5 | scope | text | NO |  | analysis |
| analysis_results | 6 | analysis_stage | text | NO | 'standard'::text | analysis |
| analysis_results | 7 | analysis_version | text | NO |  | analysis |
| analysis_results | 8 | source_hash | text | YES |  | analysis |
| analysis_results | 9 | payload | jsonb | NO | '{}'::jsonb | analysis |
| analysis_results | 10 | created_at | timestamp with time zone | NO | now() | analysis |
| analysis_results | 11 | updated_at | timestamp with time zone | NO | now() | analysis |
| daily_global_activity | 4 | reflection_view_count | integer | NO | 0 | reflection |
| daily_global_activity | 5 | echo_count | integer | NO | 0 | echo |
| daily_global_activity | 6 | discovery_count | integer | NO | 0 | discover |
| follow_requests | 1 | id | uuid | NO | gen_random_uuid() | follow |
| follow_requests | 2 | requester_user_id | uuid | NO |  | follow |
| follow_requests | 3 | target_user_id | uuid | NO |  | follow |
| follow_requests | 4 | created_at | timestamp with time zone | NO | now() | follow |
| friend_emotion_feed | 1 | id | bigint | NO |  | friend |
| friend_emotion_feed | 2 | viewer_user_id | uuid | NO |  | friend |
| friend_emotion_feed | 3 | owner_user_id | uuid | NO |  | friend |
| friend_emotion_feed | 4 | owner_name | text | NO |  | friend |
| friend_emotion_feed | 5 | items | jsonb | NO |  | friend |
| friend_emotion_feed | 6 | created_at | timestamp with time zone | NO | now() | friend |
| friend_feed_reads | 1 | user_id | uuid | NO |  | friend |
| friend_feed_reads | 2 | last_read_at | timestamp with time zone | NO | '1970-01-01 00:00:00+00'::timestamp with time zone | friend |
| friend_feed_summaries | 1 | id | uuid | NO | gen_random_uuid() | friend |
| friend_feed_summaries | 2 | viewer_user_id | text | NO |  | friend |
| friend_feed_summaries | 3 | status | text | NO | 'draft'::text | friend |
| friend_feed_summaries | 4 | payload | jsonb | NO | '{}'::jsonb | friend |
| friend_feed_summaries | 5 | source_hash | text | NO |  | friend |
| friend_feed_summaries | 6 | version | integer | NO | 1 | friend |
| friend_feed_summaries | 7 | meta | jsonb | NO | '{}'::jsonb | friend |
| friend_feed_summaries | 8 | created_at | timestamp with time zone | NO | now() | friend |
| friend_feed_summaries | 9 | updated_at | timestamp with time zone | NO | now() | friend |
| friend_feed_summaries | 10 | published_at | timestamp with time zone | YES |  | friend |
| friend_links | 1 | id | bigint | NO |  | friend |
| friend_links | 2 | user_id | uuid | NO |  | friend |
| friend_links | 3 | friend_user_id | uuid | NO |  | friend |
| friend_links | 4 | status | text | NO |  | friend |
| friend_links | 5 | created_at | timestamp with time zone | NO | now() | friend |
| friend_notification_settings | 1 | viewer_user_id | uuid | NO |  | friend |
| friend_notification_settings | 2 | owner_user_id | uuid | NO |  | friend |
| friend_notification_settings | 3 | is_enabled | boolean | NO | true | friend |
| friend_notification_settings | 4 | updated_at | timestamp with time zone | NO | now() | friend |
| friend_request_reads | 1 | user_id | uuid | NO |  | friend |
| friend_request_reads | 2 | last_read_at | timestamp with time zone | NO | '1970-01-01 00:00:00+00'::timestamp with time zone | friend |
| friend_request_reads | 3 | created_at | timestamp with time zone | NO | now() | friend |
| friend_request_reads | 4 | updated_at | timestamp with time zone | NO | now() | friend |
| friend_requests | 1 | id | bigint | NO |  | friend |
| friend_requests | 2 | requester_user_id | uuid | NO |  | friend |
| friend_requests | 3 | requested_user_id | uuid | NO |  | friend |
| friend_requests | 4 | status | text | NO | 'pending'::text | friend |
| friend_requests | 5 | created_at | timestamp with time zone | NO | now() | friend |
| friend_requests | 6 | responded_at | timestamp with time zone | YES |  | friend |
| friendships | 1 | user_id | uuid | NO |  | friend |
| friendships | 2 | friend_user_id | uuid | NO |  | friend |
| friendships | 3 | created_at | timestamp with time zone | NO | now() | friend |
| mymodel_create_answers | 1 | user_id | uuid | NO |  | mymodel |
| mymodel_create_answers | 2 | question_id | bigint | NO |  | mymodel |
| mymodel_create_answers | 3 | answer_text | text | NO | ''::text | mymodel |
| mymodel_create_answers | 4 | created_at | timestamp with time zone | NO | now() | mymodel |
| mymodel_create_answers | 5 | updated_at | timestamp with time zone | NO | now() | mymodel |
| mymodel_create_answers | 6 | is_secret | boolean | NO | false | mymodel |
| mymodel_create_answers | 7 | reflection_display_text | text | YES |  | mymodel, reflection |
| mymodel_create_answers | 8 | reflection_display_state | text | YES |  | mymodel, reflection |
| mymodel_create_answers | 9 | reflection_format_version | text | YES |  | mymodel, reflection |
| mymodel_create_answers | 10 | reflection_format_meta | jsonb | NO | '{}'::jsonb | mymodel, reflection |
| mymodel_create_answers | 11 | reflection_display_updated_at | timestamp with time zone | YES |  | mymodel, reflection |
| mymodel_create_questions | 1 | id | smallint | NO |  | mymodel |
| mymodel_create_questions | 2 | tier | text | NO | 'light'::text | mymodel |
| mymodel_create_questions | 3 | sort_order | smallint | NO |  | mymodel |
| mymodel_create_questions | 4 | question_text | text | NO |  | mymodel |
| mymodel_create_questions | 5 | is_active | boolean | NO | true | mymodel |
| mymodel_create_questions | 6 | created_at | timestamp with time zone | NO | now() | mymodel |
| mymodel_create_questions | 7 | updated_at | timestamp with time zone | NO | now() | mymodel |
| mymodel_qna_discovery_logs | 1 | id | uuid | NO | gen_random_uuid() | discover, mymodel |
| mymodel_qna_discovery_logs | 2 | viewer_user_id | uuid | NO |  | discover, mymodel |
| mymodel_qna_discovery_logs | 3 | target_user_id | uuid | NO |  | discover, mymodel |
| mymodel_qna_discovery_logs | 4 | question_id | integer | NO |  | discover, mymodel |
| mymodel_qna_discovery_logs | 5 | q_key | text | NO |  | discover, mymodel |
| mymodel_qna_discovery_logs | 6 | q_instance_id | text | NO |  | discover, mymodel |
| mymodel_qna_discovery_logs | 7 | category | text | NO |  | discover, mymodel |
| mymodel_qna_discovery_logs | 8 | memo | text | YES |  | discover, mymodel |
| mymodel_qna_discovery_logs | 9 | created_at | timestamp with time zone | NO | now() | discover, mymodel |
| mymodel_qna_discovery_logs | 10 | context_source_type | text | YES |  | discover, mymodel |
| mymodel_qna_discovery_logs | 11 | context_question | text | YES |  | discover, mymodel |
| mymodel_qna_discovery_logs | 12 | context_answer | text | YES |  | discover, mymodel |
| mymodel_qna_discovery_logs | 13 | context_topic_key | text | YES |  | discover, mymodel |
| mymodel_qna_discovery_logs | 14 | context_category | text | YES |  | discover, mymodel |
| mymodel_qna_echoes | 1 | viewer_user_id | uuid | NO |  | echo, mymodel |
| mymodel_qna_echoes | 2 | q_instance_id | text | NO |  | echo, mymodel |
| mymodel_qna_echoes | 3 | target_user_id | uuid | NO |  | echo, mymodel |
| mymodel_qna_echoes | 4 | question_id | integer | NO |  | echo, mymodel |
| mymodel_qna_echoes | 5 | q_key | text | NO |  | echo, mymodel |
| mymodel_qna_echoes | 6 | strength | text | NO |  | echo, mymodel |
| mymodel_qna_echoes | 7 | created_at | timestamp with time zone | NO | now() | echo, mymodel |
| mymodel_qna_echoes | 8 | id | uuid | YES | gen_random_uuid() | echo, mymodel |
| mymodel_qna_echoes | 9 | memo | text | YES |  | echo, mymodel |
| mymodel_qna_echoes | 10 | context_source_type | text | YES |  | echo, mymodel |
| mymodel_qna_echoes | 11 | context_question | text | YES |  | echo, mymodel |
| mymodel_qna_echoes | 12 | context_answer | text | YES |  | echo, mymodel |
| mymodel_qna_echoes | 13 | context_topic_key | text | YES |  | echo, mymodel |
| mymodel_qna_echoes | 14 | context_category | text | YES |  | echo, mymodel |
| mymodel_qna_metrics | 1 | q_key | text | NO |  | mymodel |
| mymodel_qna_metrics | 2 | views | bigint | NO | 0 | mymodel |
| mymodel_qna_metrics | 3 | resonances | bigint | NO | 0 | mymodel, resonance |
| mymodel_qna_metrics | 4 | updated_at | timestamp with time zone | NO | now() | mymodel |
| mymodel_qna_metrics | 5 | q_instance_id | text | YES |  | mymodel |
| mymodel_qna_reads | 1 | viewer_user_id | uuid | NO |  | mymodel |
| mymodel_qna_reads | 2 | q_instance_id | text | NO |  | mymodel |
| mymodel_qna_reads | 3 | viewed_at | timestamp with time zone | NO | now() | mymodel |
| mymodel_qna_resonance_logs | 1 | id | uuid | NO | gen_random_uuid() | mymodel, resonance |
| mymodel_qna_resonance_logs | 2 | target_user_id | uuid | NO |  | mymodel, resonance |
| mymodel_qna_resonance_logs | 3 | viewer_user_id | uuid | NO |  | mymodel, resonance |
| mymodel_qna_resonance_logs | 4 | question_id | integer | NO |  | mymodel, resonance |
| mymodel_qna_resonance_logs | 5 | q_key | text | NO |  | mymodel, resonance |
| mymodel_qna_resonance_logs | 6 | q_instance_id | text | NO |  | mymodel, resonance |
| mymodel_qna_resonance_logs | 7 | created_at | timestamp with time zone | NO | now() | mymodel, resonance |
| mymodel_qna_resonances | 1 | viewer_user_id | uuid | NO |  | mymodel, resonance |
| mymodel_qna_resonances | 2 | q_instance_id | text | NO |  | mymodel, resonance |
| mymodel_qna_resonances | 3 | q_key | text | NO |  | mymodel, resonance |
| mymodel_qna_resonances | 4 | created_at | timestamp with time zone | NO | now() | mymodel, resonance |
| mymodel_qna_view_logs | 1 | id | uuid | NO | gen_random_uuid() | mymodel |
| mymodel_qna_view_logs | 2 | target_user_id | uuid | NO |  | mymodel |
| mymodel_qna_view_logs | 3 | viewer_user_id | uuid | NO |  | mymodel |
| mymodel_qna_view_logs | 4 | question_id | integer | NO |  | mymodel |
| mymodel_qna_view_logs | 5 | q_key | text | NO |  | mymodel |
| mymodel_qna_view_logs | 6 | q_instance_id | text | NO |  | mymodel |
| mymodel_qna_view_logs | 7 | created_at | timestamp with time zone | NO | now() | mymodel |
| mymodel_reflections | 1 | id | uuid | NO | gen_random_uuid() | mymodel, reflection |
| mymodel_reflections | 2 | public_id | text | YES |  | mymodel, reflection |
| mymodel_reflections | 3 | owner_user_id | uuid | NO |  | mymodel, reflection |
| mymodel_reflections | 4 | source_type | text | NO |  | mymodel, reflection |
| mymodel_reflections | 5 | status | text | NO | 'ready'::text | mymodel, reflection |
| mymodel_reflections | 6 | is_active | boolean | NO | true | mymodel, reflection |
| mymodel_reflections | 7 | question_id | integer | YES |  | mymodel, reflection |
| mymodel_reflections | 8 | q_key | text | YES |  | mymodel, reflection |
| mymodel_reflections | 9 | topic_key | text | YES |  | mymodel, reflection |
| mymodel_reflections | 10 | category | text | YES |  | mymodel, reflection |
| mymodel_reflections | 11 | question | text | NO |  | mymodel, reflection |
| mymodel_reflections | 12 | answer | text | NO |  | mymodel, reflection |
| mymodel_reflections | 13 | content_json | jsonb | NO | '{}'::jsonb | mymodel, reflection |
| mymodel_reflections | 14 | source_snapshot_id | uuid | YES |  | mymodel, reflection |
| mymodel_reflections | 15 | source_hash | text | YES |  | mymodel, reflection |
| mymodel_reflections | 16 | source_refs | jsonb | NO | '[]'::jsonb | mymodel, reflection |
| mymodel_reflections | 17 | locked | boolean | NO | false | mymodel, reflection |
| mymodel_reflections | 18 | lock_note | text | YES |  | mymodel, reflection |
| mymodel_reflections | 19 | created_at | timestamp with time zone | NO | timezone('utc'::text, now()) | mymodel, reflection |
| mymodel_reflections | 20 | updated_at | timestamp with time zone | NO | timezone('utc'::text, now()) | mymodel, reflection |
| mymodel_reflections | 21 | published_at | timestamp with time zone | YES |  | mymodel, reflection |
| mymodel_structure_patterns | 1 | user_id | uuid | NO |  | mymodel |
| mymodel_structure_patterns | 2 | structures | jsonb | NO | '{}'::jsonb | mymodel |
| mymodel_structure_patterns | 3 | updated_at | timestamp with time zone | NO | now() | mymodel |
| myprofile_links | 1 | viewer_user_id | uuid | NO |  | myprofile |
| myprofile_links | 2 | owner_user_id | uuid | NO |  | myprofile |
| myprofile_links | 3 | created_at | timestamp with time zone | NO | now() | myprofile |
| myprofile_reports | 1 | id | uuid | NO | gen_random_uuid() | myprofile |
| myprofile_reports | 2 | user_id | uuid | YES |  | myprofile |
| myprofile_reports | 3 | created_at | timestamp with time zone | YES | now() | myprofile |
| myprofile_reports | 4 | report_type | text | YES |  | myprofile |
| myprofile_reports | 5 | content_text | text | YES |  | myprofile |
| myprofile_reports | 6 | metadata | jsonb | YES |  | myprofile |
| myprofile_reports | 7 | title | text | YES |  | myprofile |
| myprofile_reports | 8 | period_start | date | YES |  | myprofile |
| myprofile_reports | 9 | period_end | date | YES |  | myprofile |
| myprofile_reports | 10 | generated_at | timestamp with time zone | YES | now() | myprofile |
| myprofile_reports | 11 | updated_at | timestamp with time zone | YES | now() | myprofile |
| myprofile_reports | 12 | content_json | jsonb | YES |  | myprofile |
| myprofile_requests | 1 | id | bigint | NO | nextval('myprofile_requests_id_seq'::regclass) | myprofile |
| myprofile_requests | 2 | requester_user_id | uuid | NO |  | myprofile |
| myprofile_requests | 3 | requested_user_id | uuid | NO |  | myprofile |
| myprofile_requests | 4 | status | text | NO | 'pending'::text | myprofile |
| myprofile_requests | 5 | created_at | timestamp with time zone | NO | now() | myprofile |
| myprofile_requests | 6 | responded_at | timestamp with time zone | YES |  | myprofile |
| myweb_reports | 1 | id | uuid | NO | gen_random_uuid() | myweb |
| myweb_reports | 2 | user_id | uuid | NO |  | myweb |
| myweb_reports | 3 | report_type | text | NO |  | myweb |
| myweb_reports | 4 | period_start | timestamp with time zone | NO |  | myweb |
| myweb_reports | 5 | period_end | timestamp with time zone | NO |  | myweb |
| myweb_reports | 6 | title | text | NO |  | myweb |
| myweb_reports | 7 | content_text | text | NO |  | myweb |
| myweb_reports | 8 | content_json | jsonb | YES |  | myweb |
| myweb_reports | 9 | generated_at | timestamp with time zone | NO | now() | myweb |
| myweb_reports | 10 | updated_at | timestamp with time zone | NO | now() | myweb |
| profiles | 4 | friend_code | text | NO | generate_friend_code(10) | friend, friend_code |
| profiles | 5 | myprofile_code | text | NO | generate_myprofile_code(10) | myprofile, myprofile_code |
| v_mymodel_qna_discovery_inputs | 1 | user_id | uuid | YES |  | discover, mymodel |
| v_mymodel_qna_discovery_inputs | 2 | created_at | timestamp with time zone | YES |  | discover, mymodel |
| v_mymodel_qna_discovery_inputs | 3 | memo | text | YES |  | discover, mymodel |
| v_mymodel_qna_discovery_inputs | 4 | memo_action | text | YES |  | discover, mymodel |
| v_mymodel_qna_discovery_inputs | 5 | source | text | YES |  | discover, mymodel |
| v_mymodel_qna_echo_inputs | 1 | user_id | uuid | YES |  | echo, mymodel |
| v_mymodel_qna_echo_inputs | 2 | created_at | timestamp with time zone | YES |  | echo, mymodel |
| v_mymodel_qna_echo_inputs | 3 | memo | text | YES |  | echo, mymodel |
| v_mymodel_qna_echo_inputs | 4 | memo_action | text | YES |  | echo, mymodel |
| v_mymodel_qna_echo_inputs | 5 | source | text | YES |  | echo, mymodel |

# 15. public constraints

| table | constraint | type | definition | terms |
| --- | --- | --- | --- | --- |
| analysis_results | analysis_results_pkey | primary_key | PRIMARY KEY (id) | analysis |
| analysis_results | analysis_results_target_user_id_snapshot_id_analysis_type_a_key | unique | UNIQUE (target_user_id, snapshot_id, analysis_type, analysis_stage) | analysis |
| daily_global_activity | daily_global_activity_discovery_count_check | check | CHECK (discovery_count >= 0) | discover |
| daily_global_activity | daily_global_activity_echo_count_check | check | CHECK (echo_count >= 0) | echo |
| daily_global_activity | daily_global_activity_reflection_view_count_check | check | CHECK (reflection_view_count >= 0) | reflection |
| follow_requests | follow_requests_pkey | primary_key | PRIMARY KEY (id) | follow |
| follow_requests | follow_requests_requester_not_target | check | CHECK (requester_user_id <> target_user_id) | follow |
| follow_requests | follow_requests_requester_user_id_fkey | foreign_key | FOREIGN KEY (requester_user_id) REFERENCES auth.users(id) ON DELETE CASCADE | follow |
| follow_requests | follow_requests_target_user_id_fkey | foreign_key | FOREIGN KEY (target_user_id) REFERENCES auth.users(id) ON DELETE CASCADE | follow |
| follow_requests | follow_requests_unique_pair | unique | UNIQUE (requester_user_id, target_user_id) | follow |
| friend_emotion_feed | friend_emotion_feed_owner_user_id_fkey | foreign_key | FOREIGN KEY (owner_user_id) REFERENCES auth.users(id) | friend |
| friend_emotion_feed | friend_emotion_feed_pkey | primary_key | PRIMARY KEY (id) | friend |
| friend_emotion_feed | friend_emotion_feed_viewer_user_id_fkey | foreign_key | FOREIGN KEY (viewer_user_id) REFERENCES auth.users(id) | friend |
| friend_feed_reads | friend_feed_reads_pkey | primary_key | PRIMARY KEY (user_id) | friend |
| friend_feed_summaries | friend_feed_summaries_pkey | primary_key | PRIMARY KEY (id) | friend |
| friend_feed_summaries | friend_feed_summaries_status_check | check | CHECK (status = ANY (ARRAY['draft'::text, 'ready'::text, 'failed'::text])) | friend |
| friend_links | friend_links_friend_user_id_fkey | foreign_key | FOREIGN KEY (friend_user_id) REFERENCES auth.users(id) | friend |
| friend_links | friend_links_pkey | primary_key | PRIMARY KEY (id) | friend |
| friend_links | friend_links_status_check | check | CHECK (status = ANY (ARRAY['pending'::text, 'accepted'::text])) | friend |
| friend_links | friend_links_user_id_fkey | foreign_key | FOREIGN KEY (user_id) REFERENCES auth.users(id) | friend |
| friend_notification_settings | friend_notification_settings_pkey | primary_key | PRIMARY KEY (viewer_user_id, owner_user_id) | friend |
| friend_request_reads | friend_request_reads_pkey | primary_key | PRIMARY KEY (user_id) | friend |
| friend_request_reads | friend_request_reads_user_id_fkey | foreign_key | FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE | friend |
| friend_requests | friend_requests_not_self | check | CHECK (requester_user_id <> requested_user_id) | friend |
| friend_requests | friend_requests_pkey | primary_key | PRIMARY KEY (id) | friend |
| friend_requests | friend_requests_requested_user_id_fkey | foreign_key | FOREIGN KEY (requested_user_id) REFERENCES auth.users(id) ON DELETE CASCADE | friend |
| friend_requests | friend_requests_requester_user_id_fkey | foreign_key | FOREIGN KEY (requester_user_id) REFERENCES auth.users(id) ON DELETE CASCADE | friend |
| friend_requests | friend_requests_status_check | check | CHECK (status = ANY (ARRAY['pending'::text, 'accepted'::text, 'rejected'::text, 'cancelled'::text])) | friend |
| friendships | friendships_friend_user_id_fkey | foreign_key | FOREIGN KEY (friend_user_id) REFERENCES auth.users(id) ON DELETE CASCADE | friend |
| friendships | friendships_not_self | check | CHECK (user_id <> friend_user_id) | friend |
| friendships | friendships_pkey | primary_key | PRIMARY KEY (user_id, friend_user_id) | friend |
| friendships | friendships_user_id_fkey | foreign_key | FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE | friend |
| mymodel_create_answers | mymodel_create_answers_pkey | primary_key | PRIMARY KEY (user_id, question_id) | mymodel |
| mymodel_create_answers | mymodel_create_answers_question_id_fkey | foreign_key | FOREIGN KEY (question_id) REFERENCES mymodel_create_questions(id) ON DELETE CASCADE | mymodel |
| mymodel_create_answers | mymodel_create_answers_reflection_display_state_chk | check | CHECK (reflection_display_state IS NULL OR (reflection_display_state = ANY (ARRAY['ready'::text, 'masked'::text, 'blocked'::text]))) | mymodel, reflection |
| mymodel_create_answers | mymodel_create_answers_user_id_fkey | foreign_key | FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE | mymodel |
| mymodel_create_questions | mymodel_create_questions_pkey | primary_key | PRIMARY KEY (id) | mymodel |
| mymodel_create_questions | mymodel_create_questions_tier_check | check | CHECK (tier = ANY (ARRAY['light'::text, 'standard'::text])) | mymodel |
| mymodel_qna_discovery_logs | discovery_unique_user | unique | UNIQUE (q_instance_id, viewer_user_id) | discover, mymodel |
| mymodel_qna_discovery_logs | mymodel_qna_discovery_logs_category_check | check | CHECK (category = ANY (ARRAY['new_perspective'::text, 'different_fun'::text, 'well_worded'::text, 'not_sorted'::text, 'shocked'::text])) | discover, mymodel |
| mymodel_qna_discovery_logs | mymodel_qna_discovery_logs_not_self | check | CHECK (viewer_user_id <> target_user_id) | discover, mymodel |
| mymodel_qna_discovery_logs | mymodel_qna_discovery_logs_pkey | primary_key | PRIMARY KEY (id) | discover, mymodel |
| mymodel_qna_discovery_logs | mymodel_qna_discovery_logs_target_user_id_fkey | foreign_key | FOREIGN KEY (target_user_id) REFERENCES auth.users(id) ON DELETE CASCADE | discover, mymodel |
| mymodel_qna_discovery_logs | mymodel_qna_discovery_logs_viewer_user_id_fkey | foreign_key | FOREIGN KEY (viewer_user_id) REFERENCES auth.users(id) ON DELETE CASCADE | discover, mymodel |
| mymodel_qna_echoes | echoes_unique_user | unique | UNIQUE (q_instance_id, viewer_user_id) | echo, mymodel |
| mymodel_qna_echoes | mymodel_qna_echoes_not_self | check | CHECK (viewer_user_id <> target_user_id) | echo, mymodel |
| mymodel_qna_echoes | mymodel_qna_echoes_pkey | primary_key | PRIMARY KEY (viewer_user_id, q_instance_id) | echo, mymodel |
| mymodel_qna_echoes | mymodel_qna_echoes_strength_check | check | CHECK (strength = ANY (ARRAY['small'::text, 'medium'::text, 'large'::text])) | echo, mymodel |
| mymodel_qna_echoes | mymodel_qna_echoes_target_user_id_fkey | foreign_key | FOREIGN KEY (target_user_id) REFERENCES auth.users(id) ON DELETE CASCADE | echo, mymodel |
| mymodel_qna_echoes | mymodel_qna_echoes_viewer_user_id_fkey | foreign_key | FOREIGN KEY (viewer_user_id) REFERENCES auth.users(id) ON DELETE CASCADE | echo, mymodel |
| mymodel_qna_reads | mymodel_qna_reads_pkey | primary_key | PRIMARY KEY (viewer_user_id, q_instance_id) | mymodel |
| mymodel_qna_reads | mymodel_qna_reads_viewer_user_id_fkey | foreign_key | FOREIGN KEY (viewer_user_id) REFERENCES auth.users(id) ON DELETE CASCADE | mymodel |
| mymodel_qna_resonance_logs | mymodel_qna_resonance_logs_no_self | check | CHECK (target_user_id <> viewer_user_id) | mymodel, resonance |
| mymodel_qna_resonance_logs | mymodel_qna_resonance_logs_pkey | primary_key | PRIMARY KEY (id) | mymodel, resonance |
| mymodel_qna_resonance_logs | mymodel_qna_resonance_logs_unique | unique | UNIQUE (viewer_user_id, q_instance_id) | mymodel, resonance |
| mymodel_qna_resonances | mymodel_qna_resonances_pkey | primary_key | PRIMARY KEY (viewer_user_id, q_instance_id) | mymodel, resonance |
| mymodel_qna_resonances | mymodel_qna_resonances_viewer_user_id_fkey | foreign_key | FOREIGN KEY (viewer_user_id) REFERENCES auth.users(id) ON DELETE CASCADE | mymodel, resonance |
| mymodel_qna_view_logs | mymodel_qna_view_logs_no_self | check | CHECK (target_user_id <> viewer_user_id) | mymodel |
| mymodel_qna_view_logs | mymodel_qna_view_logs_pkey | primary_key | PRIMARY KEY (id) | mymodel |
| mymodel_reflections | mymodel_reflections_answer_nonempty | check | CHECK (btrim(answer) <> ''::text) | mymodel, reflection |
| mymodel_reflections | mymodel_reflections_create_requires_question_map | check | CHECK (source_type <> 'create'::text OR question_id IS NOT NULL AND q_key IS NOT NULL AND btrim(q_key) <> ''::text) | mymodel, reflection |
| mymodel_reflections | mymodel_reflections_generated_requires_topic_map | check | CHECK (source_type <> 'generated'::text OR topic_key IS NOT NULL AND btrim(topic_key) <> ''::text) | mymodel, reflection |
| mymodel_reflections | mymodel_reflections_pkey | primary_key | PRIMARY KEY (id) | mymodel, reflection |
| mymodel_reflections | mymodel_reflections_question_nonempty | check | CHECK (btrim(question) <> ''::text) | mymodel, reflection |
| mymodel_reflections | mymodel_reflections_source_type_check | check | CHECK (source_type = ANY (ARRAY['create'::text, 'generated'::text])) | mymodel, reflection |
| mymodel_reflections | mymodel_reflections_status_check | check | CHECK (status = ANY (ARRAY['draft'::text, 'ready'::text, 'rejected'::text, 'failed'::text, 'archived'::text])) | mymodel, reflection |
| mymodel_structure_patterns | mymodel_structure_patterns_pkey | primary_key | PRIMARY KEY (user_id) | mymodel |
| mymodel_structure_patterns | mymodel_structure_patterns_user_id_fkey | foreign_key | FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE | mymodel |
| myprofile_links | myprofile_links_owner_user_id_fkey | foreign_key | FOREIGN KEY (owner_user_id) REFERENCES profiles(id) ON DELETE CASCADE | myprofile |
| myprofile_links | myprofile_links_pkey | primary_key | PRIMARY KEY (viewer_user_id, owner_user_id) | myprofile |
| myprofile_links | myprofile_links_viewer_user_id_fkey | foreign_key | FOREIGN KEY (viewer_user_id) REFERENCES profiles(id) ON DELETE CASCADE | myprofile |
| myprofile_reports | myprofile_reports_pkey | primary_key | PRIMARY KEY (id) | myprofile |
| myprofile_reports | myprofile_reports_user_id_fkey | foreign_key | FOREIGN KEY (user_id) REFERENCES auth.users(id) | myprofile |
| myprofile_reports | myprofile_reports_user_type_period_key | unique | UNIQUE (user_id, report_type, period_start, period_end) | myprofile |
| myprofile_requests | myprofile_requests_pkey | primary_key | PRIMARY KEY (id) | myprofile |
| myprofile_requests | myprofile_requests_requested_user_id_fkey | foreign_key | FOREIGN KEY (requested_user_id) REFERENCES profiles(id) ON DELETE CASCADE | myprofile |
| myprofile_requests | myprofile_requests_requester_user_id_fkey | foreign_key | FOREIGN KEY (requester_user_id) REFERENCES profiles(id) ON DELETE CASCADE | myprofile |
| myprofile_requests | myprofile_requests_status_check | check | CHECK (status = ANY (ARRAY['pending'::text, 'accepted'::text, 'rejected'::text, 'cancelled'::text])) | myprofile |
| myweb_reports | myweb_reports_pkey | primary_key | PRIMARY KEY (id) | myweb |
| myweb_reports | myweb_reports_report_type_check | check | CHECK (report_type = ANY (ARRAY['daily'::text, 'weekly'::text, 'monthly'::text])) | myweb |
| myweb_reports | myweb_reports_user_id_fkey | foreign_key | FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE | myweb |

# 16. public indexes

| table | index | definition | terms |
| --- | --- | --- | --- |
| analysis_results | analysis_results_pkey | CREATE UNIQUE INDEX analysis_results_pkey ON public.analysis_results USING btree (id) | analysis |
| analysis_results | analysis_results_target_user_id_snapshot_id_analysis_type_a_key | CREATE UNIQUE INDEX analysis_results_target_user_id_snapshot_id_analysis_type_a_key ON public.analysis_results USING btree (target_user_id, snapshot_id, analysis_type, analysis_stage) | analysis |
| analysis_results | idx_analysis_results_payload_gin | CREATE INDEX idx_analysis_results_payload_gin ON public.analysis_results USING gin (payload) | analysis |
| analysis_results | idx_analysis_results_snapshot | CREATE INDEX idx_analysis_results_snapshot ON public.analysis_results USING btree (snapshot_id) | analysis |
| analysis_results | idx_analysis_results_target_scope | CREATE INDEX idx_analysis_results_target_scope ON public.analysis_results USING btree (target_user_id, scope) | analysis |
| analysis_results | idx_analysis_results_type_stage | CREATE INDEX idx_analysis_results_type_stage ON public.analysis_results USING btree (analysis_type, analysis_stage) | analysis |
| follow_requests | follow_requests_pkey | CREATE UNIQUE INDEX follow_requests_pkey ON public.follow_requests USING btree (id) | follow |
| follow_requests | follow_requests_requester_created_at_idx | CREATE INDEX follow_requests_requester_created_at_idx ON public.follow_requests USING btree (requester_user_id, created_at DESC) | follow |
| follow_requests | follow_requests_target_created_at_idx | CREATE INDEX follow_requests_target_created_at_idx ON public.follow_requests USING btree (target_user_id, created_at DESC) | follow |
| follow_requests | follow_requests_unique_pair | CREATE UNIQUE INDEX follow_requests_unique_pair ON public.follow_requests USING btree (requester_user_id, target_user_id) | follow |
| friend_emotion_feed | friend_emotion_feed_pkey | CREATE UNIQUE INDEX friend_emotion_feed_pkey ON public.friend_emotion_feed USING btree (id) | friend |
| friend_emotion_feed | friend_emotion_feed_viewer_created_at_idx | CREATE INDEX friend_emotion_feed_viewer_created_at_idx ON public.friend_emotion_feed USING btree (viewer_user_id, created_at DESC) | friend |
| friend_feed_reads | friend_feed_reads_pkey | CREATE UNIQUE INDEX friend_feed_reads_pkey ON public.friend_feed_reads USING btree (user_id) | friend |
| friend_feed_summaries | friend_feed_summaries_pkey | CREATE UNIQUE INDEX friend_feed_summaries_pkey ON public.friend_feed_summaries USING btree (id) | friend |
| friend_feed_summaries | friend_feed_summaries_status_updated_idx | CREATE INDEX friend_feed_summaries_status_updated_idx ON public.friend_feed_summaries USING btree (status, updated_at DESC) | friend |
| friend_feed_summaries | friend_feed_summaries_viewer_source_hash_uidx | CREATE UNIQUE INDEX friend_feed_summaries_viewer_source_hash_uidx ON public.friend_feed_summaries USING btree (viewer_user_id, source_hash) | friend |
| friend_feed_summaries | friend_feed_summaries_viewer_status_updated_idx | CREATE INDEX friend_feed_summaries_viewer_status_updated_idx ON public.friend_feed_summaries USING btree (viewer_user_id, status, updated_at DESC) | friend |
| friend_links | friend_links_pkey | CREATE UNIQUE INDEX friend_links_pkey ON public.friend_links USING btree (id) | friend |
| friend_notification_settings | friend_notification_settings_pkey | CREATE UNIQUE INDEX friend_notification_settings_pkey ON public.friend_notification_settings USING btree (viewer_user_id, owner_user_id) | friend |
| friend_request_reads | friend_request_reads_pkey | CREATE UNIQUE INDEX friend_request_reads_pkey ON public.friend_request_reads USING btree (user_id) | friend |
| friend_requests | friend_requests_pkey | CREATE UNIQUE INDEX friend_requests_pkey ON public.friend_requests USING btree (id) | friend |
| friend_requests | friend_requests_requested_user_id_idx | CREATE INDEX friend_requests_requested_user_id_idx ON public.friend_requests USING btree (requested_user_id) | friend |
| friend_requests | friend_requests_requester_user_id_idx | CREATE INDEX friend_requests_requester_user_id_idx ON public.friend_requests USING btree (requester_user_id) | friend |
| friend_requests | friend_requests_unique_pending_pair | CREATE UNIQUE INDEX friend_requests_unique_pending_pair ON public.friend_requests USING btree (LEAST(requester_user_id, requested_user_id), GREATEST(requester_user_id, requested_user_id)) WHERE (status = 'pending'::text) | friend |
| friendships | friendships_pkey | CREATE UNIQUE INDEX friendships_pkey ON public.friendships USING btree (user_id, friend_user_id) | friend |
| friendships | friendships_user_id_idx | CREATE INDEX friendships_user_id_idx ON public.friendships USING btree (user_id) | friend |
| mymodel_create_answers | mymodel_create_answers_pkey | CREATE UNIQUE INDEX mymodel_create_answers_pkey ON public.mymodel_create_answers USING btree (user_id, question_id) | mymodel |
| mymodel_create_questions | idx_mymodel_create_questions_tier_order | CREATE INDEX idx_mymodel_create_questions_tier_order ON public.mymodel_create_questions USING btree (tier, sort_order) WHERE is_active | mymodel |
| mymodel_create_questions | mymodel_create_questions_pkey | CREATE UNIQUE INDEX mymodel_create_questions_pkey ON public.mymodel_create_questions USING btree (id) | mymodel |
| mymodel_qna_discovery_logs | discovery_unique_user | CREATE UNIQUE INDEX discovery_unique_user ON public.mymodel_qna_discovery_logs USING btree (q_instance_id, viewer_user_id) | discover, mymodel |
| mymodel_qna_discovery_logs | idx_mymodel_qna_discovery_logs_created_at | CREATE INDEX idx_mymodel_qna_discovery_logs_created_at ON public.mymodel_qna_discovery_logs USING btree (created_at) | discover, mymodel |
| mymodel_qna_discovery_logs | mymodel_qna_discovery_logs_pkey | CREATE UNIQUE INDEX mymodel_qna_discovery_logs_pkey ON public.mymodel_qna_discovery_logs USING btree (id) | discover, mymodel |
| mymodel_qna_discovery_logs | mymodel_qna_discovery_logs_target_created_at_idx | CREATE INDEX mymodel_qna_discovery_logs_target_created_at_idx ON public.mymodel_qna_discovery_logs USING btree (target_user_id, created_at DESC) | discover, mymodel |
| mymodel_qna_discovery_logs | mymodel_qna_discovery_logs_target_instance_created_at_idx | CREATE INDEX mymodel_qna_discovery_logs_target_instance_created_at_idx ON public.mymodel_qna_discovery_logs USING btree (target_user_id, q_instance_id, created_at DESC) | discover, mymodel |
| mymodel_qna_discovery_logs | mymodel_qna_discovery_logs_viewer_created_at_idx | CREATE INDEX mymodel_qna_discovery_logs_viewer_created_at_idx ON public.mymodel_qna_discovery_logs USING btree (viewer_user_id, created_at DESC) | discover, mymodel |
| mymodel_qna_discovery_logs | mymodel_qna_discovery_logs_viewer_instance_created_at_idx | CREATE INDEX mymodel_qna_discovery_logs_viewer_instance_created_at_idx ON public.mymodel_qna_discovery_logs USING btree (viewer_user_id, q_instance_id, created_at DESC) | discover, mymodel |
| mymodel_qna_echoes | echoes_unique_user | CREATE UNIQUE INDEX echoes_unique_user ON public.mymodel_qna_echoes USING btree (q_instance_id, viewer_user_id) | echo, mymodel |
| mymodel_qna_echoes | idx_mymodel_qna_echoes_created_at | CREATE INDEX idx_mymodel_qna_echoes_created_at ON public.mymodel_qna_echoes USING btree (created_at) | echo, mymodel |
| mymodel_qna_echoes | idx_mymodel_qna_echoes_viewer_instance | CREATE INDEX idx_mymodel_qna_echoes_viewer_instance ON public.mymodel_qna_echoes USING btree (viewer_user_id, q_instance_id) | echo, mymodel |
| mymodel_qna_echoes | mymodel_qna_echoes_pkey | CREATE UNIQUE INDEX mymodel_qna_echoes_pkey ON public.mymodel_qna_echoes USING btree (viewer_user_id, q_instance_id) | echo, mymodel |
| mymodel_qna_echoes | mymodel_qna_echoes_target_created_at_idx | CREATE INDEX mymodel_qna_echoes_target_created_at_idx ON public.mymodel_qna_echoes USING btree (target_user_id, created_at DESC) | echo, mymodel |
| mymodel_qna_echoes | mymodel_qna_echoes_target_instance_created_at_idx | CREATE INDEX mymodel_qna_echoes_target_instance_created_at_idx ON public.mymodel_qna_echoes USING btree (target_user_id, q_instance_id, created_at DESC) | echo, mymodel |
| mymodel_qna_echoes | mymodel_qna_echoes_viewer_created_at_idx | CREATE INDEX mymodel_qna_echoes_viewer_created_at_idx ON public.mymodel_qna_echoes USING btree (viewer_user_id, created_at DESC) | echo, mymodel |
| mymodel_qna_echoes | mymodel_qna_echoes_viewer_instance_created_at_idx | CREATE INDEX mymodel_qna_echoes_viewer_instance_created_at_idx ON public.mymodel_qna_echoes USING btree (viewer_user_id, q_instance_id, created_at DESC) | echo, mymodel |
| mymodel_qna_metrics | mymodel_qna_metrics_idx_q_instance_id | CREATE INDEX mymodel_qna_metrics_idx_q_instance_id ON public.mymodel_qna_metrics USING btree (q_instance_id) | mymodel |
| mymodel_qna_metrics | mymodel_qna_metrics_idx_q_key | CREATE INDEX mymodel_qna_metrics_idx_q_key ON public.mymodel_qna_metrics USING btree (q_key) | mymodel |
| mymodel_qna_metrics | mymodel_qna_metrics_unique_global | CREATE UNIQUE INDEX mymodel_qna_metrics_unique_global ON public.mymodel_qna_metrics USING btree (q_key) WHERE (q_instance_id IS NULL) | mymodel |
| mymodel_qna_metrics | mymodel_qna_metrics_unique_instance | CREATE UNIQUE INDEX mymodel_qna_metrics_unique_instance ON public.mymodel_qna_metrics USING btree (q_instance_id) WHERE (q_instance_id IS NOT NULL) | mymodel |
| mymodel_qna_reads | mymodel_qna_reads_pkey | CREATE UNIQUE INDEX mymodel_qna_reads_pkey ON public.mymodel_qna_reads USING btree (viewer_user_id, q_instance_id) | mymodel |
| mymodel_qna_resonance_logs | mymodel_qna_resonance_logs_created_target_idx | CREATE INDEX mymodel_qna_resonance_logs_created_target_idx ON public.mymodel_qna_resonance_logs USING btree (created_at DESC, target_user_id) | mymodel, resonance |
| mymodel_qna_resonance_logs | mymodel_qna_resonance_logs_instance_idx | CREATE INDEX mymodel_qna_resonance_logs_instance_idx ON public.mymodel_qna_resonance_logs USING btree (q_instance_id) | mymodel, resonance |
| mymodel_qna_resonance_logs | mymodel_qna_resonance_logs_pkey | CREATE UNIQUE INDEX mymodel_qna_resonance_logs_pkey ON public.mymodel_qna_resonance_logs USING btree (id) | mymodel, resonance |
| mymodel_qna_resonance_logs | mymodel_qna_resonance_logs_target_created_idx | CREATE INDEX mymodel_qna_resonance_logs_target_created_idx ON public.mymodel_qna_resonance_logs USING btree (target_user_id, created_at DESC) | mymodel, resonance |
| mymodel_qna_resonance_logs | mymodel_qna_resonance_logs_unique | CREATE UNIQUE INDEX mymodel_qna_resonance_logs_unique ON public.mymodel_qna_resonance_logs USING btree (viewer_user_id, q_instance_id) | mymodel, resonance |
| mymodel_qna_resonances | mymodel_qna_resonances_pkey | CREATE UNIQUE INDEX mymodel_qna_resonances_pkey ON public.mymodel_qna_resonances USING btree (viewer_user_id, q_instance_id) | mymodel, resonance |
| mymodel_qna_resonances | mymodel_qna_resonances_q_key_idx | CREATE INDEX mymodel_qna_resonances_q_key_idx ON public.mymodel_qna_resonances USING btree (q_key) | mymodel, resonance |
| mymodel_qna_view_logs | idx_mymodel_qna_view_logs_created_at | CREATE INDEX idx_mymodel_qna_view_logs_created_at ON public.mymodel_qna_view_logs USING btree (created_at) | mymodel |
| mymodel_qna_view_logs | mymodel_qna_view_logs_created_target_idx | CREATE INDEX mymodel_qna_view_logs_created_target_idx ON public.mymodel_qna_view_logs USING btree (created_at DESC, target_user_id) | mymodel |
| mymodel_qna_view_logs | mymodel_qna_view_logs_instance_idx | CREATE INDEX mymodel_qna_view_logs_instance_idx ON public.mymodel_qna_view_logs USING btree (q_instance_id) | mymodel |
| mymodel_qna_view_logs | mymodel_qna_view_logs_pkey | CREATE UNIQUE INDEX mymodel_qna_view_logs_pkey ON public.mymodel_qna_view_logs USING btree (id) | mymodel |
| mymodel_qna_view_logs | mymodel_qna_view_logs_target_created_idx | CREATE INDEX mymodel_qna_view_logs_target_created_idx ON public.mymodel_qna_view_logs USING btree (target_user_id, created_at DESC) | mymodel |
| mymodel_reflections | idx_mymodel_reflections_owner_active_updated | CREATE INDEX idx_mymodel_reflections_owner_active_updated ON public.mymodel_reflections USING btree (owner_user_id, is_active, updated_at DESC) | mymodel, reflection |
| mymodel_reflections | idx_mymodel_reflections_owner_category | CREATE INDEX idx_mymodel_reflections_owner_category ON public.mymodel_reflections USING btree (owner_user_id, category) WHERE ((category IS NOT NULL) AND (is_active = true)) | mymodel, reflection |
| mymodel_reflections | idx_mymodel_reflections_owner_locked | CREATE INDEX idx_mymodel_reflections_owner_locked ON public.mymodel_reflections USING btree (owner_user_id, locked, updated_at DESC) | mymodel, reflection |
| mymodel_reflections | idx_mymodel_reflections_owner_source | CREATE INDEX idx_mymodel_reflections_owner_source ON public.mymodel_reflections USING btree (owner_user_id, source_type, updated_at DESC) | mymodel, reflection |
| mymodel_reflections | idx_mymodel_reflections_owner_topic | CREATE INDEX idx_mymodel_reflections_owner_topic ON public.mymodel_reflections USING btree (owner_user_id, topic_key) WHERE ((topic_key IS NOT NULL) AND (is_active = true)) | mymodel, reflection |
| mymodel_reflections | idx_mymodel_reflections_status_active | CREATE INDEX idx_mymodel_reflections_status_active ON public.mymodel_reflections USING btree (status, is_active, published_at) | mymodel, reflection |
| mymodel_reflections | mymodel_reflections_pkey | CREATE UNIQUE INDEX mymodel_reflections_pkey ON public.mymodel_reflections USING btree (id) | mymodel, reflection |
| mymodel_reflections | uq_generated_active_owner_qkey | CREATE UNIQUE INDEX uq_generated_active_owner_qkey ON public.mymodel_reflections USING btree (owner_user_id, q_key) WHERE ((source_type = 'generated'::text) AND (is_active = true) AND (status = ANY (ARRAY['ready'::text, 'published'::text])) AND (q_key IS NOT NULL) AND (btrim(q_key) <> ''::text)) | mymodel, reflection |
| mymodel_reflections | uq_mymodel_reflections_create_owner_question | CREATE UNIQUE INDEX uq_mymodel_reflections_create_owner_question ON public.mymodel_reflections USING btree (owner_user_id, question_id) WHERE ((source_type = 'create'::text) AND (is_active = true)) | mymodel, reflection |
| mymodel_reflections | uq_mymodel_reflections_generated_owner_topic | CREATE UNIQUE INDEX uq_mymodel_reflections_generated_owner_topic ON public.mymodel_reflections USING btree (owner_user_id, topic_key) WHERE ((source_type = 'generated'::text) AND (is_active = true)) | mymodel, reflection |
| mymodel_reflections | uq_mymodel_reflections_public_id | CREATE UNIQUE INDEX uq_mymodel_reflections_public_id ON public.mymodel_reflections USING btree (public_id) | mymodel, reflection |
| mymodel_structure_patterns | mymodel_structure_patterns_pkey | CREATE UNIQUE INDEX mymodel_structure_patterns_pkey ON public.mymodel_structure_patterns USING btree (user_id) | mymodel |
| myprofile_links | myprofile_links_pkey | CREATE UNIQUE INDEX myprofile_links_pkey ON public.myprofile_links USING btree (viewer_user_id, owner_user_id) | myprofile |
| myprofile_reports | myprofile_reports_pkey | CREATE UNIQUE INDEX myprofile_reports_pkey ON public.myprofile_reports USING btree (id) | myprofile |
| myprofile_reports | myprofile_reports_unique_period | CREATE UNIQUE INDEX myprofile_reports_unique_period ON public.myprofile_reports USING btree (user_id, report_type, period_start, period_end) | myprofile |
| myprofile_reports | myprofile_reports_user_type_period_key | CREATE UNIQUE INDEX myprofile_reports_user_type_period_key ON public.myprofile_reports USING btree (user_id, report_type, period_start, period_end) | myprofile |
| myprofile_requests | myprofile_requests_pkey | CREATE UNIQUE INDEX myprofile_requests_pkey ON public.myprofile_requests USING btree (id) | myprofile |
| myprofile_requests | myprofile_requests_unique_pending | CREATE UNIQUE INDEX myprofile_requests_unique_pending ON public.myprofile_requests USING btree (requester_user_id, requested_user_id) WHERE (status = 'pending'::text) | myprofile |
| myweb_reports | myweb_reports_pkey | CREATE UNIQUE INDEX myweb_reports_pkey ON public.myweb_reports USING btree (id) | myweb |
| myweb_reports | myweb_reports_user_type_period_unique | CREATE UNIQUE INDEX myweb_reports_user_type_period_unique ON public.myweb_reports USING btree (user_id, report_type, period_start, period_end) | myweb |
| profiles | profiles_friend_code_key | CREATE UNIQUE INDEX profiles_friend_code_key ON public.profiles USING btree (friend_code) | friend, friend_code |
| profiles | profiles_friend_code_unique_idx | CREATE UNIQUE INDEX profiles_friend_code_unique_idx ON public.profiles USING btree (friend_code) WHERE (friend_code IS NOT NULL) | friend, friend_code |
| profiles | profiles_myprofile_code_key | CREATE UNIQUE INDEX profiles_myprofile_code_key ON public.profiles USING btree (myprofile_code) | myprofile, myprofile_code |

# 17. RLS policies

| table | policy | cmd | qual | with_check | terms |
| --- | --- | --- | --- | --- | --- |
| follow_requests | follow_requests_delete_requester | DELETE | (auth.uid() = requester_user_id) |  | follow |
| follow_requests | follow_requests_delete_target | DELETE | (auth.uid() = target_user_id) |  | follow |
| follow_requests | follow_requests_insert_requester | INSERT |  | (auth.uid() = requester_user_id) | follow |
| follow_requests | follow_requests_select_participants | SELECT | ((auth.uid() = requester_user_id) OR (auth.uid() = target_user_id)) |  | follow |
| friend_emotion_feed | viewer_can_select_own_feed | SELECT | (viewer_user_id = auth.uid()) |  | friend |
| friend_feed_reads | friend_feed_reads_insert_own | INSERT |  | (auth.uid() = user_id) | friend |
| friend_feed_reads | friend_feed_reads_select_own | SELECT | (auth.uid() = user_id) |  | friend |
| friend_feed_reads | friend_feed_reads_update_own | UPDATE | (auth.uid() = user_id) | (auth.uid() = user_id) | friend |
| friend_links | users_can_delete_their_own_links | DELETE | (user_id = auth.uid()) |  | friend |
| friend_links | users_can_insert_their_own_links | INSERT |  | (user_id = auth.uid()) | friend |
| friend_links | users_can_update_their_own_links | UPDATE | (user_id = auth.uid()) |  | friend |
| friend_links | users_can_view_their_own_links | SELECT | ((user_id = auth.uid()) OR (friend_user_id = auth.uid())) |  | friend |
| friend_notification_settings | insert own settings | INSERT |  | (viewer_user_id = auth.uid()) | friend |
| friend_notification_settings | select own settings | SELECT | (viewer_user_id = auth.uid()) |  | friend |
| friend_notification_settings | update own settings | UPDATE | (viewer_user_id = auth.uid()) | (viewer_user_id = auth.uid()) | friend |
| friend_request_reads | friend_request_reads_delete_own | DELETE | (auth.uid() = user_id) |  | friend |
| friend_request_reads | friend_request_reads_insert_own | INSERT |  | (auth.uid() = user_id) | friend |
| friend_request_reads | friend_request_reads_select_own | SELECT | (auth.uid() = user_id) |  | friend |
| friend_request_reads | friend_request_reads_update_own | UPDATE | (auth.uid() = user_id) | (auth.uid() = user_id) | friend |
| friend_requests | friend_requests_select_own | SELECT | (requested_user_id = auth.uid()) |  | friend |
| friend_requests | select_own_friend_requests | SELECT | ((requester_user_id = auth.uid()) OR (requested_user_id = auth.uid())) |  | friend |
| friendships | select_own_friendships | SELECT | (user_id = auth.uid()) |  | friend |
| mymodel_create_questions | mymodel_create_questions_read | SELECT | true |  | mymodel |
| myprofile_links | myprofile_links_no_client_insert | INSERT |  | false | myprofile |
| myprofile_links | myprofile_links_no_client_update | UPDATE | false | false | myprofile |
| myprofile_links | myprofile_links_select_viewer | SELECT | (auth.uid() = viewer_user_id) |  | myprofile |
| myprofile_reports | myprofile_reports_select_own | SELECT | (user_id = auth.uid()) |  | myprofile |
| myprofile_requests | myprofile_requests_no_client_insert | INSERT |  | false | myprofile |
| myprofile_requests | myprofile_requests_no_client_update | UPDATE | false | false | myprofile |
| myprofile_requests | myprofile_requests_select_own | SELECT | ((auth.uid() = requester_user_id) OR (auth.uid() = requested_user_id)) |  | myprofile |
| myweb_reports | myweb_reports_select_own | SELECT | (user_id = auth.uid()) |  | myweb |

# 18. 次に進む条件

1. `follow_requests` family / `follow_links` family / `piece_resonances` family の追加確認を行う。
2. 1対1候補だけ bridge view を作るか、物理renameに進むかを分ける。
3. bridge view / table rename方針が決まってから API table constant / RPC / tests を current名へ切り替える。
4. legacy route / legacy DB名 / legacy façade の retire は最後に行う。

# 19. 現時点でdropしてよいDB object

現時点で **即dropしてよいDB objectはありません**。

`friend_links` は SQL 10 上では 0 row ですが、constraint / policy / indexを持つため、まだ drop しません。


# 20. 2026-04-26 差分追記: DB boundary v2 確定後の current state

## 20-1. 完了したDB作業

このセッションでは DB physical rename / drop は行わず、current-name bridge view を作成し、backend-readonly に硬化しました。

| phase | current bridge view | old physical source | rows / count | DB state |
|---|---|---|---:|---|
| low | `emotion_notification_settings` | `friend_notification_settings` | 1 | `security_invoker=true`, backend-readonly |
| low | `profile_create_questions` | `mymodel_create_questions` | 20 | `security_invoker=true`, backend-readonly |
| low | `profile_create_answers` | `mymodel_create_answers` | 21 | `security_invoker=true`, backend-readonly |
| low | `piece_metrics` | `mymodel_qna_metrics` | 15 | `security_invoker=true`, backend-readonly |
| low | `piece_reads` | `mymodel_qna_reads` | 35 | `security_invoker=true`, backend-readonly |
| low | `piece_view_logs` | `mymodel_qna_view_logs` | 26 | `security_invoker=true`, backend-readonly |
| low | `piece_resonance_logs` | `mymodel_qna_resonance_logs` | 5 | `security_invoker=true`, backend-readonly |
| medium | `analysis_reports` | `myweb_reports` | 486 | `security_invoker=true`, backend-readonly |
| medium | `self_structure_reports` | `myprofile_reports` | 10 | `security_invoker=true`, backend-readonly |
| medium | `emotion_log_feed` | `friend_emotion_feed` | 3211 | `security_invoker=true`, backend-readonly |
| medium | `emotion_log_feed_summaries` | `friend_feed_summaries` | 1288 | `security_invoker=true`, backend-readonly |
| high | `pieces` | `mymodel_reflections` | 1695 | `security_invoker=true`, backend-readonly |


共通状態:

- `relkind = v`
- `security_invoker=true`
- `anon` / `authenticated` は直接権限なし
- `service_role` は `SELECT` のみ
- PostgREST schema cache refresh 用に DDL後 `notify pgrst, 'reload schema'` を実行
- old physical table はすべて残存
- data mutation は未実行

## 20-2. API read-only switch gate

DB側の gate は low / medium / high `pieces` まで通過済みです。API側では SELECT-only path だけ current bridge view へ切替可能です。

| area | read-only current view | write/update/delete/upsert old physical |
|---|---|---|
| ProfileCreate questions | `profile_create_questions` | n/a |
| ProfileCreate answers | `profile_create_answers` | `mymodel_create_answers` |
| Piece metrics/read-state | `piece_metrics`, `piece_reads` | `mymodel_qna_metrics`, `mymodel_qna_reads` |
| Emotion notification settings | `emotion_notification_settings` | `friend_notification_settings` |
| Analysis reports | `analysis_reports` | `myweb_reports` |
| Self Structure reports | `self_structure_reports` | `myprofile_reports` |
| EmotionLog feed | `emotion_log_feed` | `friend_emotion_feed` |
| EmotionLog feed summaries | `emotion_log_feed_summaries` | `friend_feed_summaries` |
| Piece library | `pieces` | `mymodel_reflections` |


## 20-3. request / link / resonance / code-column family の禁止ライン

以下は引き続き bridge view / rename / drop 対象外です。

| family | 実DB結果 | 判断 |
|---|---|---|
| request | `follow_requests=3`, `friend_requests=11`, `myprofile_requests=1`; `friend_requests` と `follow_requests` の directed overlap `2`; `friend_requests` と `myprofile_requests` の reverse overlap `1` | 統合・rename禁止 |
| link | `friend_links=0`, `friendships=12`, `myprofile_links=12`; `friendships` と `myprofile_links` は same/reverse overlap ともに `6`; `friendships` は undirected duplicate groups `6` | 統合・drop禁止 |
| resonance | `mymodel_qna_echoes=5`, `mymodel_qna_resonance_logs=5`, `mymodel_qna_resonances=5`; same viewer + q_instance overlap `5` | `piece_resonances` への単純統合禁止 |
| code column | `profiles.friend_code` と `profiles.myprofile_code` は24件全件non-null、distinctも各24、同一値0 | rename / 統合禁止 |

## 20-4. payload / semantic rewrite 禁止

`pieces` 相当の `mymodel_reflections` では、`json_old_vocab_rows=1695`, `scalar_old_vocab_rows=1695` が確認済みです。  
medium側でも `analysis_reports` / `self_structure_reports` / `emotion_log_feed_summaries` 相当の payload / meta に旧語彙が残っています。

したがって、現時点では以下を禁止します。

- JSON key 一括置換
- scalar vocabulary rewrite
- response contract rewrite
- legacy route / contract retirement
- old-named file deletion

## 20-5. physical rename / drop 禁止理由

`mymodel_reflections` には以下が残っています。

- function: `touch_mymodel_reflections_updated_at`
- trigger: `trg_touch_mymodel_reflections_updated_at`
- index: `mymodel_reflections_pkey`, `uq_mymodel_reflections_public_id`, `uq_mymodel_reflections_create_owner_question`, `uq_mymodel_reflections_generated_owner_topic`, `uq_generated_active_owner_qkey` など11本

medium / low source table側にも RLS policy / trigger / index / constraint が残っています。  
bridge view commit は current API read path のための安全層であり、DB object rename の完了ではありません。

## 20-6. 次に進む条件

1. runtime smoke で current bridge view read が通る
2. write / update / delete / upsert / insert が旧物理 table のまま通る
3. legacy route / public contract / registry / RN release boundary を棚卸しする
4. contract retirement の可否を判断する
5. 旧名称APIファイル削除可否を1件ずつ判定する
6. DB physical rename / drop はその後に別途SQL reviewから開始する

# 21. 2026-04-26 現時点でdropしてよいDB object / file

現時点で **即dropしてよいDB objectはありません**。  
現時点で **削除してよいAPI/RNファイルもありません**。

`friend_links` は 0 rows ですが、constraint / policy / indexを持つため、まだ drop しません。  
旧名称APIファイルは compat façade / legacy route / DB physical name boundary として保持します。


# 22. 2026-04-27 差分追記: SQL smoke v2 / endpoint smoke 後のDB境界

## 22-1. SQL smoke v2結果

`01_bridge_view_runtime_smoke_SELECT_ONLY_v2(1).txt` の結果では、DB修正SQLは不要です。

| flag | value |
|---|---|
| `all_bridge_views_exist` | `true` |
| `all_old_objects_are_tables` | `true` |
| `all_bridge_objects_are_views` | `true` |
| `all_old_physical_tables_exist` | `true` |
| `all_bridge_views_security_invoker` | `true` |
| `all_row_counts_match_old_physical` | `true` |
| `all_views_have_service_role_select` | `true` |
| `all_views_have_no_service_role_write_grants` | `true` |
| `all_views_have_no_anon_or_authenticated_grants` | `true` |
| `all_column_name_type_signatures_match_old_physical` | `true` |
| `all_column_diffs_are_nullability_only` | `true` |

row count status:

| current bridge view | old physical table | old rows | bridge rows | match |
|---|---|---:|---:|---|
| `pieces` | `mymodel_reflections` | 1695 | 1695 | true |
| `emotion_notification_settings` | `friend_notification_settings` | 1 | 1 | true |
| `piece_metrics` | `mymodel_qna_metrics` | 15 | 15 | true |
| `piece_reads` | `mymodel_qna_reads` | 35 | 35 | true |
| `piece_resonance_logs` | `mymodel_qna_resonance_logs` | 5 | 5 | true |
| `piece_view_logs` | `mymodel_qna_view_logs` | 26 | 26 | true |
| `profile_create_answers` | `mymodel_create_answers` | 21 | 21 | true |
| `profile_create_questions` | `mymodel_create_questions` | 20 | 20 | true |
| `analysis_reports` | `myweb_reports` | 487 | 487 | true |
| `emotion_log_feed` | `friend_emotion_feed` | 3219 | 3219 | true |
| `emotion_log_feed_summaries` | `friend_feed_summaries` | 1296 | 1296 | true |
| `self_structure_reports` | `myprofile_reports` | 10 | 10 | true |

nullability 差分は view 側の表示仕様に由来する診断情報として扱い、pass/fail 対象は `column_name + udt_name + ordinal_position` とする。column name/type/order は old physical table と一致しています。

## 22-2. endpoint smoke結果から見たDB境界

`endpoint_smoke_write_result(1).json` は次の結果です。

- `status=pass`
- `hard_502_count=0`
- `non_2xx_count=0`
- `writes_enabled=true`

代表 write endpoint は 2xx で通過しました。

- `POST /profile-create/answers`: `200`
- `POST /emotion-notifications/settings/{friend_user_id}`: `200`
- `POST /report-reads/mark`: `200`

Piece write は `q_instance_id not found` のため今回対象外です。`/nexus/pieces?limit=5` が `total_items=0` / `items=[]` の状態なので、Piece が1件以上公開・閲覧可能になった段階で `POST /piece/view` / `POST /piece/resonance` を再確認します。

## 22-3. 現時点のDB禁止ライン

この結果は DB physical rename / drop を許可しません。引き続き以下は禁止です。

- DB physical rename
- DB table drop
- current bridge view への write
- write / update / delete / upsert / insert path の current名切替
- JSON key 一括置換
- scalar vocabulary rewrite
- trigger / function / RLS / index の rename

現時点で即dropしてよいDB object: **0件**。


# 2026-04-29 差分追記: 名称混在保管方針下のDB境界

今回の方針では、DB physical name の旧名称は無理に解消しない。  
アプリ稼働・public API・write path・account delete・access policy に問題が出る箇所だけを修正対象にする。

## 23-1. 現時点で進めないもの

次は、名称整理目的だけでは実行しない。

- DB physical rename
- DB table drop
- current bridge view への write切替
- write / update / delete / upsert / insert path の current名切替
- trigger / function / RLS / index の rename
- JSON key / value の一括置換
- scalar vocabulary rewrite
- 旧名称APIファイル削除

## 23-2. 非Pieceで次に確認するもの

Pieceを後回しにするため、次回のDB確認は non-Piece JSON / semantic vocabulary の **SELECT確認** から始める。

対象候補:

- `analysis_results.payload`
- `myweb_reports.content_json`
- `myprofile_reports.content_json`
- `friend_feed_summaries.meta`
- `friend_feed_summaries.payload`
- `account_status_summaries.meta`
- `account_status_summaries.payload`
- `global_activity_summaries.payload`
- `material_snapshots.payload`
- `report_distribution_push_candidates.open_target_json`
- `report_distribution_push_deliveries.payload_json`
- `subscription_plan_catalog.features_json`
- `astor_jobs.payload`
- `generation_locks.context`
- `ranking_boards.meta`
- `ranking_boards.payload`
- `mymodel_create_answers.reflection_format_meta`

Piece後回しのため、`mymodel_reflections.content_json` と `mymodel_qna_*` 系は今回の非Piece工程から外す。

## 23-3. 更新SQLをまだ作らない理由

旧語彙が残っていること自体は、rename実行の根拠にならない。  
どの key / value が、表示・API契約・保存データ・通知・削除処理に影響するかを確認してから更新可否を決める。

したがって、次に作るSQLは UPDATE / DELETE / ALTER ではなく、SELECT の対象一覧化SQLに限定する。
