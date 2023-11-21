resource "google_compute_instance" "bastion" {
  name         = "${var.name}-bastion"
  machine_type = "e2-micro"


  boot_disk {
    initialize_params {
      image = "ubuntu-os-cloud/ubuntu-2204-lts"
    }
  }

  network_interface {
    subnetwork = var.subnetwork_name
  }

  service_account {
    email  = data.google_compute_default_service_account.default.email
    scopes = ["sql-admin"]
  }

  allow_stopping_for_update = true

  lifecycle {
    ignore_changes = [
      boot_disk,
      labels,
      metadata # SSH keys added via gcloud compute ssh
    ]
  }
}

data "google_compute_default_service_account" "default" {
}

resource "google_project_iam_member" "sql_reader" {
  project = var.project_id
  role    = "roles/cloudsql.client"
  member  = "serviceAccount:${data.google_compute_default_service_account.default.email}"
}
