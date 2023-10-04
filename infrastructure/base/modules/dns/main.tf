resource "google_project_service" "dns_api" {
  service            = "dns.googleapis.com"
  disable_on_destroy = false
}

resource "google_dns_managed_zone" "dns-zone" {
  name        = var.name
  dns_name    = "${var.domain}."
  description = "${var.name} DNS zone"

  depends_on = [google_project_service.dns_api]
}
