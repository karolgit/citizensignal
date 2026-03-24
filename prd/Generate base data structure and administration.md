# Prompt: Generate Base Data Structure and Administration Functionality

Use this prompt to generate the initial database foundation and administrator capabilities for CitizenSignal.

## Prompt

You are a senior TypeScript architect and full-stack implementation agent working inside the CitizenSignal repository.

Your task is to design and implement the base data structure and administration functionality for the MVP described in the PRD. The repository is a TypeScript project scaffold. Build the foundation in a way that supports future issue analysis, source ingestion, audience segmentation, and outreach workflows, but focus this task on the data model and administrator features only.

Use the PRD in `prd/Local Election Analysis PRD.md` as the source of truth.

## Cloud Deployment Context

Oracle Cloud Infrastructure is the deployment target for this system.

All cloud infrastructure components must be provisioned with Terraform.

The cloud deployment architecture must follow the OCI Landing Zones guidance and align with the CIS-oriented landing zone approach published by the `oci-landing-zones` GitHub organization. Prefer patterns compatible with OCI Core Landing Zone unless there is a strong reason to choose a different OCI Landing Zones blueprint.

When proposing infrastructure, environment layout, identity boundaries, networking boundaries, storage, secrets handling, logging, or security controls:

- assume Oracle Cloud Infrastructure as the target platform
- assume Terraform is the infrastructure-as-code standard
- structure the solution so it can fit into an OCI Landing Zones compliant tenancy foundation
- avoid ad hoc cloud setup that conflicts with CIS landing zone guardrails
- separate application implementation concerns from tenancy, compartment, network, and governance concerns

Assume the OCI Landing Zones tenancy foundation already exists. The work produced by this prompt should create the workload-layer infrastructure for CitizenSignal under a landing-zone-managed parent compartment rather than attempting to recreate the entire landing zone bootstrap.

## Core Goals

Implement the database-oriented domain model and administrator workflows needed for:

1. administrator-managed segment definitions used in analysis
2. administrator-managed users and privilege groups
3. administrator-managed district source identification and classification

## Required MVP Administration Features

### 1. Segment Administration

Administrators must be able to create and modify normalized segments used in analysis and targeting.

Required segment dimensions for MVP:

- age group
- income group
- political viewpoint
- sex or gender where legally appropriate
- occupation group

Occupation group examples should support values such as:

- white collar professional
- blue collar worker
- stay-at-home parent
- teacher
- healthcare worker
- small business owner
- retiree

The solution must support:

- creating segment dimensions
- creating allowed values within a dimension
- updating labels, descriptions, order, and status
- activating, deactivating, and archiving definitions
- preserving auditability when definitions change
- preventing silent breakage of saved audience segments when definitions are modified

### 2. User and Privilege Administration

Administrators must be able to:

- create users
- edit users
- deactivate and reactivate users
- assign one or more privilege groups to users

Privilege groups must be used to determine access to specific screens and major workflows.

The MVP permissions model must support access control for at least:

- district management
- source registry
- segment administration
- audience records
- user administration

The design should prefer reusable named privilege groups over one-off per-user permission flags.

### 3. District Source Administration

Administrators must be able to identify and classify local sources relevant to a political district.

Supported source types for MVP should include:

- local newspapers
- regional newspapers
- town newsletters
- municipal or public records pages
- accessible community discussion sources

Source administration must support metadata such as:

- source name
- source type
- url
- platform
- covered municipalities
- covered zip codes
- covered districts
- political leaning or framing tendency when inferable
- confidence or trust score
- update frequency
- active status
- tags

The implementation should support hyperlocal and regional source coverage.

Use this district example in the seed data, tests, or fixtures where helpful:

- Maine House District 34
- Hyperlocal: Kennebunk Post, The Weekly Sentinel, Times Record, Biddeford-Saco-Old Orchard Beach Courier
- Town newsletters: Kennebunk Currents
- Facebook groups: The Village: Arundel, Kennebunk and Kennebunkport
- Regional coverage: Portland Press Herald, The Forecaster, American Journal, Times Record

## Database and Modeling Expectations

The PRD specifies Oracle Autonomous AI JSON Database. Design the primary records as JSON documents rather than a strictly relational schema.

Use the PRD’s data model guidance and include at minimum support for these document types:

- `district`
- `source`
- `audience_segment`
- `segment_definition`
- `audience_record`
- `user`
- `privilege_group`
- `audit_event`

For each document type, define:

- TypeScript domain type or interface
- validation strategy
- repository interface
- indexing recommendations
- example JSON shape

Be thoughtful about document boundaries:

- embed bounded substructures that are usually loaded together
- reference large or high-volume records separately
- preserve auditability and explainability

In addition to the TypeScript domain model, create the Oracle database schema assets required to store these JSON documents in Oracle Autonomous Database. Include:

- SQL files for creating the base document tables
- indexes appropriate for the administrator workflows
- a repeatable schema-application mechanism that can be run from Node.js

## Implementation Expectations

If the repository does not yet contain a full application framework, create a clean foundation using TypeScript modules and clear boundaries that can be integrated into a future API or UI.

Implement the following:

1. domain models for administrator-related entities
2. repository interfaces and in-memory or file-backed development implementations if a live database connection is not yet present
3. service-layer logic for:
   - segment definition management
   - user management
   - privilege-group assignment
   - source registration and classification
4. permission-checking primitives or helpers
5. seed data or fixtures for at least one district and example administrator-managed records
6. tests covering the core administrator workflows
7. documentation describing the data model and administration architecture

Also implement the infrastructure and operational foundation, not just a design note. Add:

1. Terraform for Oracle Cloud Infrastructure
2. a modular Terraform layout with:
   - `compartments`
   - `network`
   - `database`
   - `compute`
3. Terraform for creating:
   - security, appdev, database, and network compartments
   - the VCN, subnets, gateways, route tables, and network security groups needed by the application
   - the Oracle Autonomous Database
   - the virtual machine resources needed to run the application
   - security support resources such as Vault or key-management primitives when appropriate
4. Oracle database schema application support, ideally through a Node.js script and optionally with a Terraform hook for schema application when explicitly enabled
5. a runbook that explains how to provision OCI resources, apply the schema, deploy the application, and run the application

The Terraform should be organized as a workload stack layered on top of an OCI Landing Zones managed tenancy, with the root Terraform wiring together the individual modules.

## Functional Requirements to Enforce

Your implementation must reflect these behaviors:

- only users with the right privilege group can access administrator operations
- user creation and privilege assignment changes are auditable
- source creation and source classification changes are auditable
- segment definition changes are auditable
- segment definition changes should identify saved audience segments that may be affected
- privilege groups control screen-level or workflow-level access in a way that can expand later
- source records support district-specific relevance and coverage metadata
- the Oracle-backed implementation can replace the in-memory repository layer without rewriting the service layer
- the database schema can be applied repeatably
- the Terraform creates workload-layer OCI resources in a way that is consistent with CIS-oriented landing zone boundaries
- the Terraform module boundaries are clear enough that network, database, compute, and compartment logic can evolve independently

## Technical Constraints

- Use TypeScript throughout
- Keep the code modular and easy to extend
- Prefer clear domain names over generic helper abstractions
- Do not introduce unnecessary infrastructure if the repo does not support it yet
- Keep the application code ready to integrate with future Oracle Cloud deployment components without coupling the domain layer directly to OCI SDK calls
- Use the `oracledb` Node.js driver for the Oracle Autonomous Database integration layer
- Keep Oracle persistence behind repository interfaces so the in-memory and Oracle-backed implementations are swappable
- Express infrastructure as Terraform code, not manual console steps
- Keep Terraform root orchestration thin and place resource logic inside focused modules
- Add concise comments only where logic is not self-evident
- Keep secrets and real credentials out of the repository

## Deliverables

Produce:

1. the data model implementation
2. administrator domain services
3. repository layer interfaces and starter implementations
4. an Oracle-backed Node.js integration layer for Oracle Autonomous Database
5. Oracle schema SQL and a schema application script
6. Terraform for OCI infrastructure with separate `compartments`, `network`, `database`, and `compute` modules
7. tests for the administration flows
8. a short technical design document summarizing the architecture and document model
9. a short Oracle Cloud and Terraform deployment alignment note describing how this foundation would fit into an OCI Landing Zones based environment
10. a runbook for provisioning OCI resources, deploying the application, and running the application

## Output Format

When you respond:

1. summarize the architecture you chose
2. list the files you created or updated
3. explain any assumptions you made
4. identify follow-up work that should come next

If the repository lacks a database integration layer, do not stop. Implement the domain and repository foundation in a way that is immediately usable and easy to swap to Oracle Autonomous AI JSON Database later.

If the repository lacks existing OCI Terraform, do not stop. Add the workload Terraform foundation in a modular way that can be validated and extended later.
