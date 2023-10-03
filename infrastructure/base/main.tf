terraform {
  backend "gcs" {
    // TF does not allow vars here. Use the value from var.bucket_name from the remote-state project
    bucket = "30x30-tf-state"
    // TF does not allow vars here. Use the value from var.tf_state_prefix
    prefix = "state"
  }
}

module "staging" {
  source                 = "./modules/env"
  domain                 = var.domain
  gcp_project_id         = var.gcp_project_id
  gcp_region             = var.gcp_region
  github_org             = var.github_org
  github_project         = var.github_project
  github_branch          = "develop"
  project_name           = var.staging_project_name
  frontend_min_scale     = 0
  backend_min_scale      = 0
  frontend_max_scale     = 1
  backend_max_scale      = 1
  subdomain              = "30x30"
  uptime_alert_email     = var.uptime_alert_email
  environment            = "staging"
  database_name          = "strapi"
  database_user          = "strapi"
  http_auth_username     = var.staging_http_auth_username
  http_auth_password     = var.staging_http_auth_password
}
