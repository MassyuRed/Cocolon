-- PCE-0 Current Supabase Piece Schema / RLS / Migration Evidence Query
-- Created: 2026-08-07 JST
-- Purpose: body-free, read-only metadata evidence for PCE-0 closure.
-- Effect: SELECT only. No DDL, DML, function execution, policy change, or user-row export.
-- Do not add API keys, JWTs, passwords, connection strings, or raw Piece/user text to the returned packet.

-- ============================================================
-- A. Environment and object existence
-- ============================================================
select
  current_database() as current_database,
  current_user as current_user,
  current_schema() as current_schema,
  version() as postgres_version,
  to_regclass('public.mymodel_reflections') as mymodel_reflections,
  to_regclass('public.pieces') as pieces,
  to_regclass('public.pieces_read') as pieces_read,
  to_regclass('supabase_migrations.schema_migrations') as migration_history_table;

-- ============================================================
-- B. Columns / defaults / nullability / generated identity
-- ============================================================
select
  table_schema,
  table_name,
  ordinal_position,
  column_name,
  data_type,
  udt_name,
  is_nullable,
  column_default,
  identity_generation,
  is_generated,
  generation_expression
from information_schema.columns
where table_schema = 'public'
  and table_name in ('mymodel_reflections', 'pieces', 'pieces_read')
order by table_name, ordinal_position;

-- ============================================================
-- C. Constraints: CHECK / UNIQUE / PRIMARY KEY / FOREIGN KEY
-- ============================================================
select
  n.nspname as schema_name,
  c.relname as relation_name,
  con.conname as constraint_name,
  con.contype as constraint_type,
  pg_get_constraintdef(con.oid, true) as constraint_definition
from pg_constraint con
join pg_class c on c.oid = con.conrelid
join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public'
  and c.relname in ('mymodel_reflections', 'pieces', 'pieces_read')
order by c.relname, con.contype, con.conname;

-- ============================================================
-- D. Indexes
-- ============================================================
select
  schemaname,
  tablename,
  indexname,
  indexdef
from pg_indexes
where schemaname = 'public'
  and tablename in ('mymodel_reflections', 'pieces', 'pieces_read')
order by tablename, indexname;

-- ============================================================
-- E. Triggers (internal triggers excluded)
-- ============================================================
select
  n.nspname as schema_name,
  c.relname as relation_name,
  t.tgname as trigger_name,
  t.tgenabled as trigger_enabled,
  pg_get_triggerdef(t.oid, true) as trigger_definition
from pg_trigger t
join pg_class c on c.oid = t.tgrelid
join pg_namespace n on n.oid = c.relnamespace
where not t.tgisinternal
  and n.nspname = 'public'
  and c.relname in ('mymodel_reflections', 'pieces', 'pieces_read')
order by c.relname, t.tgname;

-- ============================================================
-- F. RLS enabled / forced state and object owner
-- ============================================================
select
  n.nspname as schema_name,
  c.relname as relation_name,
  c.relkind as relation_kind,
  pg_get_userbyid(c.relowner) as relation_owner,
  c.relrowsecurity as rls_enabled,
  c.relforcerowsecurity as rls_forced,
  c.reloptions as relation_options
from pg_class c
join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public'
  and c.relname in ('mymodel_reflections', 'pieces', 'pieces_read')
order by c.relname;

-- ============================================================
-- G. RLS policies
-- ============================================================
select
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
from pg_policies
where schemaname = 'public'
  and tablename in ('mymodel_reflections', 'pieces', 'pieces_read')
order by tablename, policyname;

-- ============================================================
-- H. Table/view grants
-- ============================================================
select
  table_schema,
  table_name,
  grantor,
  grantee,
  privilege_type,
  is_grantable,
  with_hierarchy
from information_schema.role_table_grants
where table_schema = 'public'
  and table_name in ('mymodel_reflections', 'pieces', 'pieces_read')
order by table_name, grantee, privilege_type;

-- ============================================================
-- I. View definitions (object definitions only; no row data)
-- ============================================================
select
  schemaname,
  viewname,
  viewowner,
  definition
from pg_views
where schemaname = 'public'
  and viewname in ('pieces', 'pieces_read')
order by viewname;

-- ============================================================
-- J. Migration identity
-- This removes a possible "statements" field so only body-free identity/meta remains.
-- If the table does not exist, this SELECT alone may error; section A tells us first.
-- ============================================================
select
  to_jsonb(m) - 'statements' as migration_identity
from supabase_migrations.schema_migrations m
order by (to_jsonb(m)->>'version') desc
limit 200;

-- ============================================================
-- K. Optional body-free aggregate shape counts
-- No user identifiers or Piece text are returned.
-- ============================================================
select
  coalesce(source_type::text, '<NULL>') as source_type,
  coalesce(status::text, '<NULL>') as status,
  is_active,
  count(*) as row_count
from public.mymodel_reflections
group by source_type, status, is_active
order by source_type, status, is_active;

-- ============================================================
-- L. Optional body-free field-presence counts for migration planning
-- No content_json values or text bodies are returned.
-- ============================================================
select
  count(*) as total_rows,
  count(*) filter (where content_json is null) as content_json_null_rows,
  count(*) filter (where question is null or btrim(question::text) = '') as question_missing_rows,
  count(*) filter (where answer is null or btrim(answer::text) = '') as answer_missing_rows,
  count(*) filter (where q_key is null or btrim(q_key::text) = '') as q_key_missing_rows,
  count(*) filter (
    where content_json is not null
      and jsonb_typeof(content_json::jsonb) = 'object'
      and content_json::jsonb ? 'piece_core'
  ) as piece_core_present_rows,
  count(*) filter (
    where content_json is not null
      and jsonb_typeof(content_json::jsonb) = 'object'
      and content_json::jsonb ? 'national_core'
  ) as national_core_present_rows
from public.mymodel_reflections;
