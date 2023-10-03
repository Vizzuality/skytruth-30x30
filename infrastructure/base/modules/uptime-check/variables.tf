variable "project_id" {
  type        = string
  description = "The GCP project id to deploy service into"
}

variable "name" {
  type = string
}

variable "host" {
  type = string
}

variable "path" {
  type = string
  default = ""
}

variable "period" {
  type = string
  default = "300s"
}

variable "email" {
  type = string
}
