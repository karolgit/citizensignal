resource "oci_identity_compartment" "security" {
  compartment_id = var.parent_compartment_ocid
  name           = "${var.name_prefix}-security"
  description    = "Security compartment for CitizenSignal workload resources."
  enable_delete  = true
}

resource "oci_identity_compartment" "network" {
  compartment_id = var.parent_compartment_ocid
  name           = "${var.name_prefix}-network"
  description    = "Network compartment for CitizenSignal workload resources."
  enable_delete  = true
}

resource "oci_identity_compartment" "database" {
  compartment_id = var.parent_compartment_ocid
  name           = "${var.name_prefix}-database"
  description    = "Database compartment for CitizenSignal workload resources."
  enable_delete  = true
}

resource "oci_identity_compartment" "appdev" {
  compartment_id = var.parent_compartment_ocid
  name           = "${var.name_prefix}-appdev"
  description    = "Application development compartment for CitizenSignal workload resources."
  enable_delete  = true
}

resource "oci_kms_vault" "application" {
  compartment_id = oci_identity_compartment.security.id
  display_name   = "${var.name_prefix}-vault"
  vault_type     = "DEFAULT"
  freeform_tags  = var.freeform_tags
}

resource "oci_kms_key" "application" {
  compartment_id      = oci_identity_compartment.security.id
  display_name        = "${var.name_prefix}-key"
  management_endpoint = oci_kms_vault.application.management_endpoint

  key_shape {
    algorithm = "AES"
    length    = 32
  }

  freeform_tags = var.freeform_tags
}
