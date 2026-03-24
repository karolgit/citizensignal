begin
  execute immediate q'[
    create table cs_district_documents (
      doc_id varchar2(128) primary key,
      payload json not null,
      created_at timestamp with time zone default systimestamp not null,
      updated_at timestamp with time zone default systimestamp not null
    )
  ]';
exception
  when others then
    if sqlcode != -955 then
      raise;
    end if;
end;
/

begin
  execute immediate q'[
    create table cs_source_documents (
      doc_id varchar2(128) primary key,
      payload json not null,
      created_at timestamp with time zone default systimestamp not null,
      updated_at timestamp with time zone default systimestamp not null
    )
  ]';
exception
  when others then
    if sqlcode != -955 then
      raise;
    end if;
end;
/

begin
  execute immediate q'[
    create table cs_audience_segment_documents (
      doc_id varchar2(128) primary key,
      payload json not null,
      created_at timestamp with time zone default systimestamp not null,
      updated_at timestamp with time zone default systimestamp not null
    )
  ]';
exception
  when others then
    if sqlcode != -955 then
      raise;
    end if;
end;
/

begin
  execute immediate q'[
    create table cs_segment_definition_documents (
      doc_id varchar2(128) primary key,
      payload json not null,
      created_at timestamp with time zone default systimestamp not null,
      updated_at timestamp with time zone default systimestamp not null
    )
  ]';
exception
  when others then
    if sqlcode != -955 then
      raise;
    end if;
end;
/

begin
  execute immediate q'[
    create table cs_audience_record_documents (
      doc_id varchar2(128) primary key,
      payload json not null,
      created_at timestamp with time zone default systimestamp not null,
      updated_at timestamp with time zone default systimestamp not null
    )
  ]';
exception
  when others then
    if sqlcode != -955 then
      raise;
    end if;
end;
/

begin
  execute immediate q'[
    create table cs_user_documents (
      doc_id varchar2(128) primary key,
      payload json not null,
      created_at timestamp with time zone default systimestamp not null,
      updated_at timestamp with time zone default systimestamp not null
    )
  ]';
exception
  when others then
    if sqlcode != -955 then
      raise;
    end if;
end;
/

begin
  execute immediate q'[
    create table cs_privilege_group_documents (
      doc_id varchar2(128) primary key,
      payload json not null,
      created_at timestamp with time zone default systimestamp not null,
      updated_at timestamp with time zone default systimestamp not null
    )
  ]';
exception
  when others then
    if sqlcode != -955 then
      raise;
    end if;
end;
/

begin
  execute immediate q'[
    create table cs_audit_event_documents (
      doc_id varchar2(128) primary key,
      payload json not null,
      created_at timestamp with time zone default systimestamp not null,
      updated_at timestamp with time zone default systimestamp not null
    )
  ]';
exception
  when others then
    if sqlcode != -955 then
      raise;
    end if;
end;
/

begin
  execute immediate q'[create unique index cs_district_documents_pk_idx on cs_district_documents (doc_id)]';
exception when others then if sqlcode != -955 then raise; end if;
end;
/

begin
  execute immediate q'[create unique index cs_source_documents_pk_idx on cs_source_documents (doc_id)]';
exception when others then if sqlcode != -955 then raise; end if;
end;
/

begin
  execute immediate q'[create search index cs_source_documents_json_idx on cs_source_documents (payload) for json]';
exception when others then if sqlcode != -955 then raise; end if;
end;
/

begin
  execute immediate q'[create search index cs_audience_segment_documents_json_idx on cs_audience_segment_documents (payload) for json]';
exception when others then if sqlcode != -955 then raise; end if;
end;
/

begin
  execute immediate q'[create unique index cs_segment_definition_documents_dimension_idx on cs_segment_definition_documents (json_value(payload, ''$.dimensionKey'' returning varchar2(128)))]';
exception when others then if sqlcode != -955 then raise; end if;
end;
/

begin
  execute immediate q'[create index cs_audience_record_documents_district_idx on cs_audience_record_documents (json_value(payload, ''$.districtIds[0]'' returning varchar2(128)))]';
exception when others then if sqlcode != -955 then raise; end if;
end;
/

begin
  execute immediate q'[create unique index cs_user_documents_email_idx on cs_user_documents (lower(json_value(payload, ''$.email'' returning varchar2(320))))]';
exception when others then if sqlcode != -955 then raise; end if;
end;
/

begin
  execute immediate q'[create search index cs_user_documents_json_idx on cs_user_documents (payload) for json]';
exception when others then if sqlcode != -955 then raise; end if;
end;
/

begin
  execute immediate q'[create search index cs_privilege_group_documents_json_idx on cs_privilege_group_documents (payload) for json]';
exception when others then if sqlcode != -955 then raise; end if;
end;
/

begin
  execute immediate q'[create index cs_audit_event_documents_target_idx on cs_audit_event_documents (json_value(payload, ''$.targetType'' returning varchar2(64)), json_value(payload, ''$.targetId'' returning varchar2(128)))]';
exception when others then if sqlcode != -955 then raise; end if;
end;
/

begin
  execute immediate q'[create index cs_audit_event_documents_timestamp_idx on cs_audit_event_documents (created_at)]';
exception when others then if sqlcode != -955 then raise; end if;
end;
/

