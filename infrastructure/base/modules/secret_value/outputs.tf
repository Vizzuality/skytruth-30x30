output "secret_name" {
  value = google_secret_manager_secret.secret.secret_id
}

output "secret_id" {
  value = google_secret_manager_secret.secret.id
}

output "secret_value" {
  value = google_secret_manager_secret_version.backend_app_secret.secret_data
}
