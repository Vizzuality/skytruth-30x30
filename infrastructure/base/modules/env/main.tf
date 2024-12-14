locals {
  domain = var.subdomain == "" ? var.domain : "${var.subdomain}.${var.domain}"
}

module "network" {
  source     = "../network"
  project_id = var.gcp_project_id
  region     = var.gcp_region
  name       = var.project_name
}

module "frontend_gcr" {
  source     = "../gcr"
  project_id = var.gcp_project_id
  region     = var.gcp_region
  name       = "${var.project_name}-frontend"
}

module "backend_gcr" {
  source     = "../gcr"
  project_id = var.gcp_project_id
  region     = var.gcp_region
  name       = "${var.project_name}-backend"
}

module "postgres_application_user_password" {
  source           = "../secret_value"
  region           = var.gcp_region
  key              = "${var.project_name}_postgres_user_password"
  use_random_value = true
}

module "frontend_cloudrun" {
  source                = "../cloudrun"
  name                  = "${var.project_name}-fe"
  region                = var.gcp_region
  project_id            = var.gcp_project_id
  repository            = module.frontend_gcr.repository_name
  container_port        = 3000
  vpc_connector_name    = module.network.vpc_access_connector_name
  database              = module.database.database
  min_scale             = var.frontend_min_scale
  max_scale             = var.frontend_max_scale
  tag                   = var.environment
  use_hello_world_image = var.use_hello_world_image
}

module "backend_cloudrun" {
  source                = "../cloudrun"
  name                  = "${var.project_name}-be"
  region                = var.gcp_region
  project_id            = var.gcp_project_id
  repository            = module.backend_gcr.repository_name
  container_port        = 1337
  vpc_connector_name    = module.network.vpc_access_connector_name
  database              = module.database.database
  min_scale             = var.backend_min_scale
  max_scale             = var.backend_max_scale
  tag                   = var.environment
  use_hello_world_image = var.use_hello_world_image
  cloudrun_memory_limit = var.cloudrun_memory_limit
}

module "database" {
  source                     = "../sql"
  name                       = var.project_name
  project_id                 = var.gcp_project_id
  region                     = var.gcp_region
  database_name              = var.database_name
  database_user              = var.database_user
  database_password          = module.postgres_application_user_password.secret_value
  network_id                 = module.network.network_id
  sql-database-instance-tier = "db-custom-2-3840"

  # explicit dependency for:
  # Error, failed to create instance because the network doesn't have at least 1 private services connection.
  depends_on = [module.network.vpc_access_connector_name]
}

module "bastion" {
  source          = "../bastion"
  name            = var.project_name
  project_id      = var.gcp_project_id
  subnetwork_name = module.network.subnetwork_name
}

module "client_uptime_check" {
  source     = "../uptime-check"
  name       = "${var.project_name} Client"
  host       = element(split("/", module.frontend_cloudrun.cloudrun_service_url), 2)
  email      = var.uptime_alert_email
  project_id = var.gcp_project_id
}

module "cms_uptime_check" {
  source     = "../uptime-check"
  name       = "${var.project_name} CMS"
  host       = element(split("/", module.backend_cloudrun.cloudrun_service_url), 2)
  email      = var.uptime_alert_email
  project_id = var.gcp_project_id
}

module "error_reporting" {
  source                        = "../error-reporting"
  project_id                    = var.gcp_project_id
  backend_service_account_email = module.backend_cloudrun.service_account_email
}

resource "random_password" "api_token_salt" {
  length           = 32
  special          = true
  override_special = "!#$%&*()-_=+[]{}<>:?"
}

resource "random_password" "admin_jwt_secret" {
  length           = 32
  special          = true
  override_special = "!#$%&*()-_=+[]{}<>:?"
}

resource "random_password" "transfer_token_salt" {
  length           = 32
  special          = true
  override_special = "!#$%&*()-_=+[]{}<>:?"
}

resource "random_password" "jwt_secret" {
  length           = 32
  special          = true
  override_special = "!#$%&*()-_=+[]{}<>:?"
}

resource "random_password" "app_key" {
  length           = 16
  special          = true
  override_special = "!#$%&*()-_=+[]{}<>:?"
}

locals {
  frontend_lb_url    = "https://${local.domain}"
  cms_lb_url         = "https://${local.domain}/${var.backend_path_prefix}/"
  api_lb_url         = "https://${local.domain}/${var.backend_path_prefix}/api/"
  analysis_cf_lb_url = "https://${local.domain}/${var.functions_path_prefix}/${var.analysis_function_path_prefix}/"
  cms_env = {
    HOST = "0.0.0.0"
    PORT = 1337
    APP_KEYS = join(
      ",",
      [
        base64encode(random_password.app_key.result),
        base64encode(random_password.app_key.result)
      ]
    )
    API_TOKEN_SALT      = random_password.api_token_salt.result
    ADMIN_JWT_SECRET    = random_password.admin_jwt_secret.result
    TRANSFER_TOKEN_SALT = random_password.transfer_token_salt.result
    JWT_SECRET          = random_password.jwt_secret.result
    CMS_URL             = local.cms_lb_url

    DATABASE_CLIENT   = "postgres"
    DATABASE_HOST     = module.database.database_host
    DATABASE_NAME     = module.database.database_name
    DATABASE_USERNAME = module.database.database_user
    DATABASE_PASSWORD = module.postgres_application_user_password.secret_value
    DATABASE_SSL      = false
  }
  client_env = {
    NEXT_PUBLIC_URL             = local.frontend_lb_url
    NEXT_PUBLIC_API_URL         = local.api_lb_url
    NEXT_PUBLIC_ANALYSIS_CF_URL = local.analysis_cf_lb_url
    NEXT_PUBLIC_ENVIRONMENT     = "production"
    LOG_LEVEL                   = "info"
  }
  analysis_cloud_function_env = {
    DATABASE_CLIENT   = "postgres"
    DATABASE_HOST     = module.database.database_host
    DATABASE_NAME     = module.database.database_name
    DATABASE_USERNAME = module.database.database_user
    DATABASE_SSL      = false
  }
  analysis_cloud_function_secrets = [{
    key        = "DATABASE_PASSWORD"
    project_id = var.gcp_project_id
    secret     = module.postgres_application_user_password.secret_name
    version    = module.postgres_application_user_password.latest_version
  }]

  depends_on = [module.postgres_application_user_password]
}

locals {
  gcp_sa_key        = "${upper(var.environment)}_GCP_SA_KEY"
  cms_env_file      = "${upper(var.environment)}_CMS_ENV_TF_MANAGED"
  client_env_file   = "${upper(var.environment)}_CLIENT_ENV_TF_MANAGED"
  project_name      = "${upper(var.environment)}_PROJECT_NAME"
  cms_repository    = "${upper(var.environment)}_CMS_REPOSITORY"
  client_repository = "${upper(var.environment)}_CLIENT_REPOSITORY"
  cms_service       = "${upper(var.environment)}_CMS_SERVICE"
  client_service    = "${upper(var.environment)}_CLIENT_SERVICE"
  analysis_cf_name  = "${upper(var.environment)}_ANALYSIS_CF_NAME"
}

module "github_values" {
  source    = "../github_values"
  repo_name = var.github_project
  secret_map = {
    (local.gcp_sa_key)        = base64decode(google_service_account_key.deploy_service_account_key.private_key)
    (local.project_name)      = var.project_name
    (local.cms_repository)    = module.backend_gcr.repository_name
    (local.client_repository) = module.frontend_gcr.repository_name
    (local.cms_service)       = module.backend_cloudrun.name
    (local.client_service)    = module.frontend_cloudrun.name
    (local.analysis_cf_name)  = module.analysis_cloud_function.function_name
    (local.cms_env_file)      = join("\n", [for key, value in local.cms_env : "${key}=${value}"])
    (local.client_env_file)   = join("\n", [for key, value in local.client_env : "${key}=${value}"])
  }
}

resource "google_service_account" "deploy_service_account" {
  account_id   = "${var.project_name}-deploy-sa"
  display_name = "${var.project_name} Deploy Service Account"
}

resource "google_service_account_key" "deploy_service_account_key" {
  service_account_id = google_service_account.deploy_service_account.name
  public_key_type    = "TYPE_X509_PEM_FILE"
}

resource "google_project_iam_member" "deploy_service_account_roles" {
  count = length(var.roles)

  project = var.gcp_project_id
  role    = var.roles[count.index]
  member  = "serviceAccount:${google_service_account.deploy_service_account.email}"
}

variable "roles" {
  description = "List of roles to grant to the Cloud Run Deploy Service Account"
  type        = list(string)
  default = [
    "roles/iam.serviceAccountTokenCreator",
    "roles/iam.serviceAccountUser",
    "roles/run.developer",
    "roles/artifactregistry.reader",
    "roles/artifactregistry.writer",
    "roles/cloudfunctions.developer"
  ]
}

resource "google_project_service" "iam_service" {
  project = var.gcp_project_id
  service = "iam.googleapis.com"
}

module "load_balancer" {
  source                        = "../load-balancer"
  region                        = var.gcp_region
  project                       = var.gcp_project_id
  name                          = var.project_name
  backend_cloud_run_name        = module.backend_cloudrun.name
  frontend_cloud_run_name       = module.frontend_cloudrun.name
  analysis_function_name        = module.analysis_cloud_function.function_name
  domain                        = var.domain
  subdomain                     = var.subdomain
  dns_managed_zone_name         = var.dns_zone_name
  backend_path_prefix           = var.backend_path_prefix
  functions_path_prefix         = var.functions_path_prefix
  analysis_function_path_prefix = var.analysis_function_path_prefix
}

module "analysis_cloud_function" {
  source                           = "../cloudfunction"
  region                           = var.gcp_region
  project                          = var.gcp_project_id
  vpc_connector_name               = module.network.vpc_access_connector_name
  function_name                    = "${var.project_name}-analysis"
  description                      = "Analysis Cloud Function"
  source_dir                       = "${path.root}/../../cloud_functions/analysis"
  runtime                          = "python312"
  entry_point                      = "index"
  runtime_environment_variables    = local.analysis_cloud_function_env
  secrets                          = local.analysis_cloud_function_secrets
  timeout_seconds                  = var.analysis_function_timeout_seconds
  available_memory                 = var.analysis_function_available_memory
  available_cpu                    = var.analysis_function_available_cpu
  max_instance_count               = var.analysis_function_max_instance_count
  max_instance_request_concurrency = var.analysis_function_max_instance_request_concurrency

  depends_on = [module.postgres_application_user_password]
}
