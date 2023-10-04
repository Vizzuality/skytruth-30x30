variable "project_id" {
  type        = string
  description = "GCP project id"
}

variable "backend_service_account_email" {
  type        = string
  description = "Email address of the backend service account to grant access to error reporting"
}
