terraform {
  backend "gcs" {
    // TF does not allow vars here. Use the value from var.bucket_name from the remote-state project
    bucket = "30x30-tf-state"
    // TF does not allow vars here. Use the value from var.tf_state_prefix
    prefix = "state"
  }
}

module "staging" {
  source                        = "./modules/env"
  gcp_project_id                = var.gcp_project_id
  gcp_region                    = var.gcp_region
  github_org                    = var.github_org
  github_project                = var.github_project
  github_branch                 = "develop"
  project_name                  = var.staging_project_name
  frontend_min_scale            = 0
  backend_min_scale             = 0
  frontend_max_scale            = 1
  backend_max_scale             = 2
  dns_zone_name                 = module.dns.dns_zone_name
  domain                        = var.domain
  subdomain                     = "30x30"
  backend_path_prefix           = "cms"
  functions_path_prefix         = "functions"
  analysis_function_path_prefix = "analysis"
  uptime_alert_email            = var.uptime_alert_email
  environment                   = "staging"
  database_name                 = "strapi"
  database_user                 = "strapi"
}

module "dns" {
  source = "./modules/dns"
  domain = var.domain
  name   = "skytruth"
}

resource "google_service_account" "data_pipelines_service_account" {
  project      = var.gcp_project_id
  account_id   = "data-pipelines"
  display_name = "data-pipelines"
  description  = "Data Pipelines Service Account"
}

import {
  id = "projects/x30-399415/serviceAccounts/data-pipelines@x30-399415.iam.gserviceaccount.com"
  to = google_service_account.data_pipelines_service_account
}

data "google_storage_bucket" "data_pipelines_bucket" {
  name = "vector-data-raw"
}

resource "google_storage_bucket_iam_member" "member" {
  bucket = data.google_storage_bucket.data_pipelines_bucket.name
  role   = "roles/storage.admin"
  member = "serviceAccount:${google_service_account.data_pipelines_service_account.email}"
}
