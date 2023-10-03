output "dns_name_servers" {
  value = google_dns_managed_zone.dns-zone.name_servers
}

output "dns_zone_name" {
  value = google_dns_managed_zone.dns-zone.name
}
