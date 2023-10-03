resource "google_project_service" "error_reporting_api" {
  service            = "clouderrorreporting.googleapis.com"
  disable_on_destroy = false
}

resource "google_project_iam_member" "error_reporting_backend_writer" {
  project = var.project_id
  role    = "roles/errorreporting.writer"
  member  = "serviceAccount:${var.backend_service_account_email}"
}
