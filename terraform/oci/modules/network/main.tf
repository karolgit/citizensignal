data "oci_core_services" "all" {}

locals {
  dns_prefix   = substr(regexreplace(lower(var.project_prefix), "[^a-z0-9]", ""), 0, 12)
  service      = one([for service in data.oci_core_services.all.services : service if length(regexall("Oracle Services Network", service.name)) > 0])
  service_ocid = local.service.id
  service_cidr = local.service.cidr_block
}

resource "oci_core_vcn" "application" {
  compartment_id = var.compartment_id
  cidr_blocks    = [var.vcn_cidr]
  display_name   = "${var.name_prefix}-vcn"
  dns_label      = local.dns_prefix
  freeform_tags  = var.freeform_tags
}

resource "oci_core_internet_gateway" "application" {
  compartment_id = var.compartment_id
  vcn_id         = oci_core_vcn.application.id
  display_name   = "${var.name_prefix}-igw"
  enabled        = true
  freeform_tags  = var.freeform_tags
}

resource "oci_core_nat_gateway" "application" {
  compartment_id = var.compartment_id
  vcn_id         = oci_core_vcn.application.id
  display_name   = "${var.name_prefix}-nat"
  freeform_tags  = var.freeform_tags
}

resource "oci_core_service_gateway" "application" {
  compartment_id = var.compartment_id
  vcn_id         = oci_core_vcn.application.id
  display_name   = "${var.name_prefix}-sgw"

  services {
    service_id = local.service_ocid
  }

  freeform_tags = var.freeform_tags
}

resource "oci_core_route_table" "public" {
  compartment_id = var.compartment_id
  vcn_id         = oci_core_vcn.application.id
  display_name   = "${var.name_prefix}-public-rt"

  route_rules {
    destination       = "0.0.0.0/0"
    destination_type  = "CIDR_BLOCK"
    network_entity_id = oci_core_internet_gateway.application.id
  }

  freeform_tags = var.freeform_tags
}

resource "oci_core_route_table" "private" {
  compartment_id = var.compartment_id
  vcn_id         = oci_core_vcn.application.id
  display_name   = "${var.name_prefix}-private-rt"

  route_rules {
    destination       = "0.0.0.0/0"
    destination_type  = "CIDR_BLOCK"
    network_entity_id = oci_core_nat_gateway.application.id
  }

  route_rules {
    destination       = local.service_cidr
    destination_type  = "SERVICE_CIDR_BLOCK"
    network_entity_id = oci_core_service_gateway.application.id
  }

  freeform_tags = var.freeform_tags
}

resource "oci_core_network_security_group" "app" {
  compartment_id = var.compartment_id
  vcn_id         = oci_core_vcn.application.id
  display_name   = "${var.name_prefix}-app-nsg"
  freeform_tags  = var.freeform_tags
}

resource "oci_core_network_security_group" "database" {
  compartment_id = var.compartment_id
  vcn_id         = oci_core_vcn.application.id
  display_name   = "${var.name_prefix}-db-nsg"
  freeform_tags  = var.freeform_tags
}

resource "oci_core_network_security_group_security_rule" "app_ingress_ssh" {
  network_security_group_id = oci_core_network_security_group.app.id
  direction                 = "INGRESS"
  protocol                  = "6"
  source                    = var.admin_access_cidr
  source_type               = "CIDR_BLOCK"
  description               = "SSH access for administration."

  tcp_options {
    destination_port_range {
      min = 22
      max = 22
    }
  }
}

resource "oci_core_network_security_group_security_rule" "app_ingress_http" {
  network_security_group_id = oci_core_network_security_group.app.id
  direction                 = "INGRESS"
  protocol                  = "6"
  source                    = var.application_ingress_cidr
  source_type               = "CIDR_BLOCK"
  description               = "CitizenSignal application port."

  tcp_options {
    destination_port_range {
      min = var.application_port
      max = var.application_port
    }
  }
}

resource "oci_core_network_security_group_security_rule" "app_egress_all" {
  network_security_group_id = oci_core_network_security_group.app.id
  direction                 = "EGRESS"
  protocol                  = "all"
  destination               = "0.0.0.0/0"
  destination_type          = "CIDR_BLOCK"
  description               = "Outbound connectivity for patching and application dependencies."
}

resource "oci_core_network_security_group_security_rule" "database_ingress_from_app" {
  network_security_group_id = oci_core_network_security_group.database.id
  direction                 = "INGRESS"
  protocol                  = "6"
  source                    = var.app_subnet_cidr
  source_type               = "CIDR_BLOCK"
  description               = "Application subnet access to Autonomous Database private endpoint."

  tcp_options {
    destination_port_range {
      min = 1522
      max = 1522
    }
  }
}

resource "oci_core_network_security_group_security_rule" "database_egress_all" {
  network_security_group_id = oci_core_network_security_group.database.id
  direction                 = "EGRESS"
  protocol                  = "all"
  destination               = "0.0.0.0/0"
  destination_type          = "CIDR_BLOCK"
  description               = "Outbound connectivity from the database private endpoint."
}

resource "oci_core_subnet" "public" {
  compartment_id             = var.compartment_id
  vcn_id                     = oci_core_vcn.application.id
  cidr_block                 = var.public_subnet_cidr
  display_name               = "${var.name_prefix}-public-subnet"
  dns_label                  = "public"
  prohibit_public_ip_on_vnic = false
  route_table_id             = oci_core_route_table.public.id
  freeform_tags              = var.freeform_tags
}

resource "oci_core_subnet" "app" {
  compartment_id             = var.compartment_id
  vcn_id                     = oci_core_vcn.application.id
  cidr_block                 = var.app_subnet_cidr
  display_name               = "${var.name_prefix}-app-subnet"
  dns_label                  = "app"
  prohibit_public_ip_on_vnic = !var.assign_public_ip_to_app
  route_table_id             = oci_core_route_table.private.id
  freeform_tags              = var.freeform_tags
}

resource "oci_core_subnet" "database" {
  compartment_id             = var.compartment_id
  vcn_id                     = oci_core_vcn.application.id
  cidr_block                 = var.database_subnet_cidr
  display_name               = "${var.name_prefix}-db-subnet"
  dns_label                  = "db"
  prohibit_public_ip_on_vnic = true
  route_table_id             = oci_core_route_table.private.id
  freeform_tags              = var.freeform_tags
}
