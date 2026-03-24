# OCI Deployment Runbook

This runbook describes how to provision the Oracle Cloud Infrastructure for CitizenSignal, apply the Oracle database schema, deploy the application, and run it.

## Scope

This repository assumes:

- the tenancy foundation is already governed by OCI Landing Zones
- this application repository provisions the workload slice under a landing-zone-managed parent compartment
- Terraform provisions the OCI resources
- the Node.js application connects to Oracle Autonomous Database using the `oracledb` driver

## Prerequisites

- an OCI tenancy and region enabled for the target workload
- an OCI Landing Zones aligned parent compartment for the application workload
- Terraform 1.6 or newer
- Node.js 20 or newer
- OCI API signing key and a user or workload identity with permission to provision the required resources
- an SSH keypair for VM access
- an Oracle Linux image OCID for the application VM

## Repository Assets

- Terraform root: `terraform/oci`
- Terraform modules: `terraform/oci/modules/compartments`, `terraform/oci/modules/network`, `terraform/oci/modules/database`, `terraform/oci/modules/compute`
- Oracle schema SQL: `database/schema`
- Schema application script: `scripts/db/apply-schema.mjs`
- Oracle connection layer: `src/infrastructure/oracle`
- Environment template: `config/.env.oci.example`

## Step 1: Prepare Terraform Variables

1. Copy `terraform/oci/terraform.tfvars.example` to `terraform/oci/terraform.tfvars`.
2. Fill in tenancy, user, region, compartment, image, SSH, and database values.
3. Point `workload_parent_compartment_ocid` to the landing-zone-managed parent compartment for this workload.
4. Decide whether the app VM should have a public IP. Leave `assign_public_ip_to_app = false` unless you explicitly want a simpler but less locked-down access pattern.

## Step 2: Provision OCI Resources

From the repository root:

```bash
cd terraform/oci
terraform init
terraform plan
terraform apply
```

This Terraform creates:

- workload compartments for `security`, `network`, `database`, and `appdev`
- an OCI Vault and key in the security compartment
- a VCN, subnets, gateways, route tables, and NSGs in the network compartment
- an Autonomous Database in the database compartment
- an application VM in the appdev compartment

The Terraform is split into modules so each major concern can evolve independently:

- `compartments`: workload compartments and core security bootstrap resources
- `network`: VCN, subnets, gateways, route tables, and NSGs
- `database`: Autonomous Database
- `compute`: application VM bootstrap

## Step 3: Obtain Autonomous Database Connection Materials

After the database is available:

1. Download the Autonomous Database wallet from OCI for the provisioned database.
2. Place the wallet files on the deployment host or the application VM.
3. Choose the service name you want to use for the app, such as a lower-concurrency service for admin workflows.

## Step 4: Configure Application Environment

1. Copy `config/.env.oci.example` to your runtime environment file.
2. Set:
   - `ORACLE_DB_USER`
   - `ORACLE_DB_PASSWORD`
   - `ORACLE_DB_CONNECT_STRING`
   - `ORACLE_DB_WALLET_DIR`
   - `ORACLE_DB_WALLET_PASSWORD` if required

## Step 5: Apply the Database Schema

On a machine with Node.js and network access to the Autonomous Database:

```bash
npm install
npm run db:apply-schema
```

If you want Terraform to invoke schema application during provisioning, set:

- `schema_apply_enabled = true`
- `schema_apply_connect_string` to the usable connect string for the target service

That path is best used only when the operator environment already has Node.js and the required wallet/config available.

## Step 6: Deploy the Application to the VM

Choose one of these patterns:

### Simple Manual Deployment

1. SSH to the application VM.
2. Install Node.js 20 or newer.
3. Clone or copy this repository to the VM.
4. Copy the wallet to a secure directory on the VM.
5. Set the OCI database environment variables.
6. Run:

```bash
npm install
npm run build
npm start
```

### Service-Based Deployment

1. Build the TypeScript app.
2. Create a systemd unit or another service wrapper for `node dist/index.js`.
3. Store environment variables outside the repository, such as in a protected environment file or OCI secret retrieval workflow.
4. Restart the service after each deployment.

## Step 7: Run the Application

For local or VM execution:

```bash
npm run dev
```

For compiled production execution:

```bash
npm run build
npm start
```

## Step 8: Switch from In-Memory to Oracle Repositories

The current codebase now includes Oracle-backed repository implementations under `src/infrastructure/oracle`.

The next integration step is:

1. create an Oracle connection pool with `createOraclePool`
2. create a repository bundle with `createOracleRepositoryBundle`
3. inject that bundle into the existing administration services

## Operational Notes

- Keep the application VM and database in private subnets unless you intentionally choose otherwise.
- Keep OCI IAM and app-level privilege groups separate.
- Use OCI Vault or a stronger secret-distribution pattern for runtime credentials.
- Treat the Terraform root in this repo as a workload stack, not a replacement for the landing-zone foundation itself.
