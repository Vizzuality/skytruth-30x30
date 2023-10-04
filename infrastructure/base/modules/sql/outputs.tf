output "database_host" {
  value = google_sql_database_instance.db-main.private_ip_address
}

output "database_name" {
  value = google_sql_database.database.name
}

output "database_user" {
  value = google_sql_user.app-user.name
}

output "database_password" {
  value = google_sql_user.app-user.password
}

output "database" {
  value = google_sql_database.database
}
