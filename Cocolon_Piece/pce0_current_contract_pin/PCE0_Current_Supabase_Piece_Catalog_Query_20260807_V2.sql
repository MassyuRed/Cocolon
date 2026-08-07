-- PCE-0 Current Supabase Piece Catalog Evidence Query V2
-- Created: 2026-08-07 JST
-- Supersedes for execution:
--   PCE0_Current_Supabase_Piece_Schema_RLS_Migration_Query_20260807.sql
-- Reason:
--   Attempt 001 terminated with SQLSTATE 42P01 because the V1 query directly
--   referenced supabase_migrations.schema_migrations even when that relation
--   did not exist.
-- Purpose:
--   Produce one body-free, catalog-only JSON packet for the PCE-0 blockers.
-- Effect:
--   One SELECT statement only. No DDL, DML, policy change, user-row read,
--   migration execution, or direct reference to an uncertain application table.
-- Privacy:
--   Do not add API keys, JWTs, passwords, connection strings, user text,
--   Piece body, email, phone, profile data, or raw application rows.

with
target_relations as (
  select
    n.nspname as schema_name,
    c.relname as relation_name,
    c.relkind as relation_kind,
    pg_get_userbyid(c.relowner) as relation_owner,
    c.relrowsecurity as rls_enabled,
    c.relforcerowsecurity as rls_forced,
    c.reloptions as relation_options
  from pg_catalog.pg_class c
  join pg_catalog.pg_namespace n on n.oid = c.relnamespace
  where n.nspname = 'public'
    and c.relname in ('mymodel_reflections', 'pieces', 'pieces_read')
),
target_columns as (
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
),
target_constraints as (
  select
    n.nspname as schema_name,
    c.relname as relation_name,
    con.conname as constraint_name,
    con.contype as constraint_type,
    pg_get_constraintdef(con.oid, true) as constraint_definition
  from pg_catalog.pg_constraint con
  join pg_catalog.pg_class c on c.oid = con.conrelid
  join pg_catalog.pg_namespace n on n.oid = c.relnamespace
  where n.nspname = 'public'
    and c.relname in ('mymodel_reflections', 'pieces', 'pieces_read')
),
target_indexes as (
  select
    schemaname as schema_name,
    tablename as relation_name,
    indexname as index_name,
    indexdef as index_definition
  from pg_catalog.pg_indexes
  where schemaname = 'public'
    and tablename in ('mymodel_reflections', 'pieces', 'pieces_read')
),
target_triggers as (
  select
    n.nspname as schema_name,
    c.relname as relation_name,
    t.tgname as trigger_name,
    t.tgenabled as trigger_enabled,
    pg_get_triggerdef(t.oid, true) as trigger_definition
  from pg_catalog.pg_trigger t
  join pg_catalog.pg_class c on c.oid = t.tgrelid
  join pg_catalog.pg_namespace n on n.oid = c.relnamespace
  where not t.tgisinternal
    and n.nspname = 'public'
    and c.relname in ('mymodel_reflections', 'pieces', 'pieces_read')
),
target_policies as (
  select
    schemaname as schema_name,
    tablename as relation_name,
    policyname as policy_name,
    permissive,
    roles,
    cmd,
    qual,
    with_check
  from pg_catalog.pg_policies
  where schemaname = 'public'
    and tablename in ('mymodel_reflections', 'pieces', 'pieces_read')
),
target_grants as (
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
),
target_views as (
  select
    schemaname as schema_name,
    viewname as view_name,
    viewowner as view_owner,
    definition
  from pg_catalog.pg_views
  where schemaname = 'public'
    and viewname in ('pieces', 'pieces_read')
),
migration_candidate_relations as (
  select
    n.nspname as schema_name,
    c.relname as relation_name,
    c.relkind as relation_kind,
    pg_get_userbyid(c.relowner) as relation_owner,
    c.relrowsecurity as rls_enabled,
    c.relforcerowsecurity as rls_forced
  from pg_catalog.pg_class c
  join pg_catalog.pg_namespace n on n.oid = c.relnamespace
  where n.nspname not in ('pg_catalog', 'information_schema', 'pg_toast')
    and c.relkind in ('r', 'p', 'v', 'm', 'f')
    and (
      lower(n.nspname) like '%migration%'
      or lower(c.relname) like '%migration%'
      or lower(c.relname) in ('schema_migrations', 'migrations')
    )
),
migration_candidate_columns as (
  select
    table_schema,
    table_name,
    ordinal_position,
    column_name,
    data_type,
    udt_name,
    is_nullable
  from information_schema.columns
  where table_schema not in ('pg_catalog', 'information_schema')
    and (
      lower(table_schema) like '%migration%'
      or lower(table_name) like '%migration%'
      or lower(table_name) in ('schema_migrations', 'migrations')
    )
)
select jsonb_build_object(
  'packet_version', 'pce0.current_supabase_piece_catalog.v2',
  'captured_at_utc', timezone('UTC', statement_timestamp()),
  'environment', jsonb_build_object(
    'current_database', current_database(),
    'current_user', current_user,
    'current_schema', current_schema(),
    'postgres_version', version()
  ),
  'expected_object_resolution', jsonb_build_object(
    'public.mymodel_reflections', to_regclass('public.mymodel_reflections')::text,
    'public.pieces', to_regclass('public.pieces')::text,
    'public.pieces_read', to_regclass('public.pieces_read')::text,
    'supabase_migrations.schema_migrations',
      to_regclass('supabase_migrations.schema_migrations')::text
  ),
  'target_relations', coalesce((
    select jsonb_agg(
      jsonb_build_object(
        'schema_name', schema_name,
        'relation_name', relation_name,
        'relation_kind', relation_kind,
        'relation_owner', relation_owner,
        'rls_enabled', rls_enabled,
        'rls_forced', rls_forced,
        'relation_options', relation_options
      ) order by schema_name, relation_name
    )
    from target_relations
  ), '[]'::jsonb),
  'target_columns', coalesce((
    select jsonb_agg(
      jsonb_build_object(
        'table_schema', table_schema,
        'table_name', table_name,
        'ordinal_position', ordinal_position,
        'column_name', column_name,
        'data_type', data_type,
        'udt_name', udt_name,
        'is_nullable', is_nullable,
        'column_default', column_default,
        'identity_generation', identity_generation,
        'is_generated', is_generated,
        'generation_expression', generation_expression
      ) order by table_name, ordinal_position
    )
    from target_columns
  ), '[]'::jsonb),
  'target_constraints', coalesce((
    select jsonb_agg(
      jsonb_build_object(
        'schema_name', schema_name,
        'relation_name', relation_name,
        'constraint_name', constraint_name,
        'constraint_type', constraint_type,
        'constraint_definition', constraint_definition
      ) order by relation_name, constraint_type, constraint_name
    )
    from target_constraints
  ), '[]'::jsonb),
  'target_indexes', coalesce((
    select jsonb_agg(
      jsonb_build_object(
        'schema_name', schema_name,
        'relation_name', relation_name,
        'index_name', index_name,
        'index_definition', index_definition
      ) order by relation_name, index_name
    )
    from target_indexes
  ), '[]'::jsonb),
  'target_triggers', coalesce((
    select jsonb_agg(
      jsonb_build_object(
        'schema_name', schema_name,
        'relation_name', relation_name,
        'trigger_name', trigger_name,
        'trigger_enabled', trigger_enabled,
        'trigger_definition', trigger_definition
      ) order by relation_name, trigger_name
    )
    from target_triggers
  ), '[]'::jsonb),
  'target_policies', coalesce((
    select jsonb_agg(
      jsonb_build_object(
        'schema_name', schema_name,
        'relation_name', relation_name,
        'policy_name', policy_name,
        'permissive', permissive,
        'roles', to_jsonb(roles),
        'command', cmd,
        'using_expression', qual,
        'with_check_expression', with_check
      ) order by relation_name, policy_name
    )
    from target_policies
  ), '[]'::jsonb),
  'target_grants', coalesce((
    select jsonb_agg(
      jsonb_build_object(
        'table_schema', table_schema,
        'table_name', table_name,
        'grantor', grantor,
        'grantee', grantee,
        'privilege_type', privilege_type,
        'is_grantable', is_grantable,
        'with_hierarchy', with_hierarchy
      ) order by table_name, grantee, privilege_type
    )
    from target_grants
  ), '[]'::jsonb),
  'target_view_definitions', coalesce((
    select jsonb_agg(
      jsonb_build_object(
        'schema_name', schema_name,
        'view_name', view_name,
        'view_owner', view_owner,
        'definition', definition
      ) order by view_name
    )
    from target_views
  ), '[]'::jsonb),
  'migration_history_observation', jsonb_build_object(
    'expected_relation', 'supabase_migrations.schema_migrations',
    'expected_relation_state', case
      when to_regclass('supabase_migrations.schema_migrations') is null
        then 'NOT_PRESENT'
      else 'PRESENT'
    end,
    'row_read_attempted', false,
    'interpretation_limit',
      'NOT_PRESENT does not prove that no migrations were ever applied; candidate relations and current catalog remain separate evidence.'
  ),
  'migration_candidate_relations', coalesce((
    select jsonb_agg(
      jsonb_build_object(
        'schema_name', schema_name,
        'relation_name', relation_name,
        'relation_kind', relation_kind,
        'relation_owner', relation_owner,
        'rls_enabled', rls_enabled,
        'rls_forced', rls_forced
      ) order by schema_name, relation_name
    )
    from migration_candidate_relations
  ), '[]'::jsonb),
  'migration_candidate_columns', coalesce((
    select jsonb_agg(
      jsonb_build_object(
        'table_schema', table_schema,
        'table_name', table_name,
        'ordinal_position', ordinal_position,
        'column_name', column_name,
        'data_type', data_type,
        'udt_name', udt_name,
        'is_nullable', is_nullable
      ) order by table_schema, table_name, ordinal_position
    )
    from migration_candidate_columns
  ), '[]'::jsonb),
  'deferred_nonblocking_evidence', jsonb_build_array(
    'application-row aggregate counts',
    'question/answer/content_json field-presence counts'
  ),
  'deferred_reason',
    'PCE0-U009 is non-blocking and direct row queries are deferred until the catalog confirms the exact table and columns.'
) as pce0_current_supabase_piece_catalog_packet;
