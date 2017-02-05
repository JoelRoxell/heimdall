# -*- coding: utf-8 -*-
import utils.package as package

# # # # # # # # # # # # # # # # # # # # # # # # #
# General service configuration
# # # # # # # # # # # # # # # # # # # # # # # # #

# Project name and version, taken from package.json
PROJECT = package.NAME
VERSION = package.VERSION

# Which Docker repository to push to (this gets fetched in run-time atm)
REPOSITORY = None

# Name of the AWS ECS cluster to deploy to
CLUSTER = 'default'


# # # # # # # # # # # # # # # # # # # # # # # # #
# Deployment configuration
# # # # # # # # # # # # # # # # # # # # # # # # #

# The desired number of task definitions (containers) to run for this service
DESIRED_COUNT = 1

# Represents an upper limit on the number of your service's tasks that are
# allowed in the RUNNING or PENDING state during a deployment, as a percentage
# of the DESIRED_COUNT (rounded down to the nearest integer). This parameter
# enables you to define the deployment batch size. For example, if your service
# has a DESIRED_COUNT of four tasks and a DEPLOY_MAX_PERCENT value of 200%, the
# scheduler may start four new tasks before stopping the four older tasks
# (provided that the cluster resources required to do this are available). The
# default value for DEPLOY_MAX_PERCENT is 200%.
DEPLOY_MAX_PERCENT = 200

# Represents a lower limit on the number of your service's tasks that must
# remain in the RUNNING state during a deployment, as a percentage of the
# DESIRED_COUNT (rounded up to the nearest integer). This parameter enables you
# to deploy without using additional cluster capacity. For example, if your
# service has a DESIRED_COUNT of four tasks and a DEPLOY_MIN_HEALTHY_PERCENT of
# 50%, the scheduler may stop two existing tasks to free up cluster capacity
# before starting two new tasks.
DEPLOY_MIN_HEALTHY_PERCENT = 100


# # # # # # # # # # # # # # # # # # # # # # # # #
# Load balancing configuration
# # # # # # # # # # # # # # # # # # # # # # # # #

# Wheter or not this service uses a load balancer. Note: Load balancer must be
# configured before deploying the first time, see deploy/ecs/README.md for info.
USE_LOAD_BALANCER = False

# Name of the load balancer to use
LOAD_BALANCER_NAME = 'production'

# ARN (Amazon Resource Name) of the load balancer target group.
LOAD_BALANCER_TARGET_GROUP_ARN = ''

# Container port for load balancer to send traffic to
LOAD_BALANCER_CONTAINER_PORT = 8000

# ARN of the IAM role that allows Amazon ECS to make calls to your load balancer
# on your behalf
LOAD_BALANCER_ROLE = ''
