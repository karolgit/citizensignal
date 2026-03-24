resource "oci_core_instance" "app" {
  availability_domain = var.availability_domain
  compartment_id      = var.compartment_id
  display_name        = var.display_name
  shape               = var.shape
  freeform_tags       = var.freeform_tags

  shape_config {
    ocpus         = var.ocpus
    memory_in_gbs = var.memory_in_gbs
  }

  create_vnic_details {
    subnet_id        = var.subnet_id
    nsg_ids          = var.network_security_group_ids
    assign_public_ip = var.assign_public_ip
    hostname_label   = "citizensignal"
  }

  metadata = {
    ssh_authorized_keys = var.ssh_public_key
    user_data = base64encode(templatefile("${path.module}/user-data/app-server-cloud-init.tftpl", {
      app_directory = var.app_directory
      app_repo_url  = var.app_repo_url
    }))
  }

  source_details {
    source_type = "image"
    source_id   = var.image_ocid
  }
}
