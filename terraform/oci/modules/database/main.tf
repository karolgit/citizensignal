resource "oci_database_autonomous_database" "application" {
  compartment_id              = var.compartment_id
  db_name                     = var.db_name
  display_name                = var.display_name
  admin_password              = var.admin_password
  cpu_core_count              = var.cpu_core_count
  data_storage_size_in_tbs    = var.data_storage_size_in_tbs
  db_workload                 = var.db_workload
  is_auto_scaling_enabled     = true
  is_mtls_connection_required = true
  subnet_id                   = var.subnet_id
  nsg_ids                     = var.network_security_group_ids
  freeform_tags               = var.freeform_tags
}
