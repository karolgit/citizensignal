# Database Schema

This directory contains the Oracle schema assets for CitizenSignal's application-level document store.

## Files

- `001_base_documents.sql`: creates the JSON document tables and the first round of indexes needed for the administration workflows.

## Collections Mapped to Tables

- `cs_district_documents`
- `cs_source_documents`
- `cs_audience_segment_documents`
- `cs_segment_definition_documents`
- `cs_audience_record_documents`
- `cs_user_documents`
- `cs_privilege_group_documents`
- `cs_audit_event_documents`

Each table stores one logical document type in a native Oracle JSON column.

