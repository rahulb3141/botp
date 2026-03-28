variable "aws_region" {
    type    = string
    default = "us-east-1"
}

variable "cluster_name" {
    type    = string
    default = "example-eks-cluster"
}

variable "node_instance_type" {
    type    = string
    default = "t3.medium"
}

variable "node_desired_capacity" {
    type    = number
    default = 2
}
