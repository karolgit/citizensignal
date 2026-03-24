provider "oci" {
  tenancy_ocid     = var.tenancy_ocid
  user_ocid        = var.user_ocid
  fingerprint      = var.fingerprint
  private_key_path = var.private_key_path
  region           = var.region
}

locals {
  name_prefix = lower(replace(var.project_prefix, "_", "-"))
  freeform_tags = {
    project      = var.project_prefix
    managed_by   = "terraform"
    architecture = "cis-landing-zone-aligned"
  }
}

module "compartments" {
  source = "./modules/compartments"

  parent_compartment_ocid = var.workload_parent_compartment_ocid
  name_prefix             = local.name_prefix
  freeform_tags           = local.freeform_tags
}

module "network" {
  source = "./modules/network"

  compartment_id            = module.compartments.network_compartment_id
  project_prefix            = var.project_prefix
  name_prefix               = local.name_prefix
  vcn_cidr                  = var.vcn_cidr
  public_subnet_cidr        = var.public_subnet_cidr
  app_subnet_cidr           = var.app_subnet_cidr
  database_subnet_cidr      = var.database_subnet_cidr
  admin_access_cidr         = var.admin_access_cidr
  application_ingress_cidr  = var.application_ingress_cidr
  application_port          = var.application_port
  assign_public_ip_to_app   = var.assign_public_ip_to_app
  freeform_tags             = local.freeform_tags
}

module "database" {
  source = "./modules/database"

  compartment_id                   = module.compartments.database_compartment_id
  subnet_id                        = module.network.database_subnet_id
  network_security_group_ids       = [module.network.database_network_security_group_id]
  db_name                          = var.autonomous_database_db_name
  display_name                     = var.autonomous_database_display_name
  admin_password                   = var.autonomous_database_admin_password
  cpu_core_count                   = var.autonomous_database_cpu_core_count
  data_storage_size_in_tbs         = var.autonomous_database_storage_tbs
  db_workload                      = var.autonomous_database_workload
  freeform_tags                    = local.freeform_tags
}

module "compute" {
  source = "./modules/compute"

  compartment_id        = module.compartments.appdev_compartment_id
  availability_domain   = var.availability_domain
  display_name          = "${local.name_prefix}-app-vm"
  shape                 = var.app_instance_shape
  ocpus                 = var.app_instance_ocpus
  memory_in_gbs         = var.app_instance_memory_gbs
  subnet_id             = module.network.app_instance_subnet_id
  assign_public_ip      = var.assign_public_ip_to_app
  network_security_group_ids = [module.network.app_network_security_group_id]
  ssh_public_key        = var.ssh_public_key
  image_ocid            = var.app_image_ocid
  app_directory         = var.app_directory
  app_repo_url          = var.app_repo_url
  freeform_tags         = local.freeform_tags
}

resource "terraform_data" "apply_database_schema" {
  count = var.schema_apply_enabled && var.schema_apply_connect_string != "" ? 1 : 0

  triggers_replace = [
    module.database.autonomous_database_id,
    filesha256("${path.module}/../../database/schema/001_base_documents.sql"),
    filesha256("${path.module}/../../scripts/db/apply-schema.mjs"),
  ]

  provisioner "local-exec" {
    command     = "node ../../scripts/db/apply-schema.mjs"
    working_dir = path.module
    environment = {
      ORACLE_DB_USER           = "ADMIN"
      ORACLE_DB_PASSWORD       = var.autonomous_database_admin_password
      ORACLE_DB_CONNECT_STRING = var.schema_apply_connect_string
    }
  }
}
