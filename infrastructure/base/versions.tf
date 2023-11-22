terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 4.84"
    }

    google-beta = {
      source  = "hashicorp/google-beta"
      version = "~> 4.84"
    }

    random = {
      source  = "hashicorp/random"
      version = "~> 3.5.1"
    }
  }
  required_version = "1.6.4"
}

provider "google" {
  project = var.gcp_project_id
  region  = var.gcp_region
  zone    = var.gcp_zone
}

provider "google-beta" {
  project = var.gcp_project_id
  region  = var.gcp_region
}
