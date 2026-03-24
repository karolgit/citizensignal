# Oracle Cloud and Terraform Alignment

This note explains how the current administration foundation can fit into an Oracle Cloud Infrastructure deployment that follows OCI Landing Zones guidance and a CIS-oriented tenancy baseline.

## Deployment Principles

- Oracle Cloud Infrastructure is the deployment target.
- Terraform is the only intended infrastructure provisioning path.
- The application layer should be placed into compartments and networks defined by the landing zone foundation rather than creating ad hoc tenancy resources.
- Application code should remain decoupled from tenancy bootstrap concerns.

## Likely OCI Resource Areas

### Application Hosting

Reasonable future options include:

- OCI Container Instances for lightweight early environments
- OKE for a containerized multi-service platform
- Compute instances if the team prefers a simpler VM-based rollout first

Terraform implication:
Use separate application modules layered on top of the landing zone foundation, not mixed into landing zone bootstrap code.

### Database Connectivity

The PRD points to Oracle Autonomous AI JSON Database. The application layer should treat database access through repository implementations so connection handling can be wired later with:

- private endpoints where possible
- compartment-scoped database resources
- secret-backed connection configuration

Terraform implication:
Define database resources, networking attachments, and connection-secret references in application environment modules.

### IAM Integration

The current application privilege-group model is app-level authorization and should stay separate from OCI IAM.

OCI IAM should handle:

- workload identity
- operator access
- environment boundaries
- least-privilege access to secrets, logging, and database resources

Terraform implication:
Model dynamic groups, policies, and application principals as separate IAM modules attached to the landing zone compartments.

### Secrets Management

Expected secrets later include:

- database credentials or wallet materials
- API keys for future connectors
- signing keys or session secrets

Terraform implication:
Use OCI Vault and secret distribution patterns that align with the landing zone guardrails. Do not store secrets in code, state outputs, or `.env` files beyond local development placeholders.

### Logging and Audit

The codebase currently produces application-level audit events. In OCI, that should be complemented by:

- OCI Logging for application/runtime logs
- OCI Audit for tenancy control-plane activity
- centralized log routing aligned to landing zone logging patterns

Terraform implication:
Provision log groups, connectors, retention settings, and any downstream sink integrations with environment-specific modules.

### Networking and Compartments

The application should assume:

- compartments are pre-structured by the landing zone
- VCN/subnet placement follows central guardrails
- ingress and egress controls are managed according to CIS-aligned patterns

Terraform implication:
Reference landing-zone-provided networking outputs rather than creating isolated networking structures inside the application stack.

## Suggested Terraform Module Layers

Keep Terraform responsibilities separated:

1. landing zone foundation
2. shared platform services
3. application environment modules
4. application deployment modules

For this repository, the most likely future fit is layer 3 and layer 4. The landing zone itself should remain a separate concern unless this repo intentionally becomes the infrastructure control repo.

## Design Implications for the Current Code

The current TypeScript administration foundation already supports a clean OCI path because:

- repositories isolate persistence concerns
- services do not depend on OCI SDKs
- permission logic is application-native and not coupled to cloud IAM semantics
- audit events are structured and can be mirrored into platform logging later

## Follow-On Infrastructure Work

When infrastructure work is explicitly requested, likely next deliverables are:

- Terraform folder structure and module conventions
- environment variable and secret contract definitions
- OCI database repository implementation adapters
- deployment workflow design for dev, staging, and production
- observability and operational runbook documentation
