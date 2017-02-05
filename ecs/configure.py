# -*- coding: utf-8 -*-
import sys
from utils.cli import shell
from utils.notify import info, error
from config import *
from os.path import join, realpath, dirname
from os import unlink

"""Handles AWS configuration

- Builds and creates new task definitions
"""

DIR_NAME = dirname(realpath(__file__))
REPLACE = {
    '<REPOSITORY>': REPOSITORY,
    '<PROJECT>': PROJECT,
    '<VERSION>': VERSION
}

def generate_from_template(template_file, dst_file, mapping):
    """Fills out template files with provided data

    Arguments:
        template_file {string} -- Filename of the template file
        dst_file {string} -- Filename of the destination file
        mapping {Dict} -- Mapping between template values and the real values

    Returns:
        string -- Full path to the destination file
    """
    with open(join(DIR_NAME, template_file), 'r') as src:
        contents = src.read()

    for key, value in mapping.iteritems():
        contents = contents.replace(key, str(value))

    dst_file = join(DIR_NAME, dst_file)

    with open(dst_file, 'w') as dst:
        dst.write(contents)

    return dst_file

def is_service_created(service):
    """Checks if a service is created or not

    Arguments:
        service {string} -- Name of the service to check

    Returns:
        bool -- True if the service already existed, false if not
    """
    res = shell('aws ecs describe-services --services %s --output text' % service)
    return not 'MISSING' in res

def get_service_update_cmd():
    """Builds the AWS cli service update command

    Returns:
        string -- Command string
    """
    return ('aws ecs update-service '
            '--cluster {cluster} '
            '--service {project} '
            '--desired-count {desired_count} '
            '--task-definition {project} '
            '--deployment-configuration '
            'maximumPercent={deploy_max_percent},'
            'minimumHealthyPercent={deploy_min_healthy_percent}').format(
                cluster=CLUSTER, project=PROJECT, desired_count=DESIRED_COUNT,
                deploy_max_percent=DEPLOY_MAX_PERCENT,
                deploy_min_healthy_percent=DEPLOY_MIN_HEALTHY_PERCENT)

def get_service_create_cmd():
    """Builds the AWS cli service create command

    Omits the load balancer argument if loadbalancer was disabled in config

    Returns:
        string -- Command string
    """
    lb = ('--role {role} '
          '--load-balancers '
          'targetGroupArn={lb_target_group_arn},'
          'loadBalancerName={lb_name},'
          'containerName={project},'
          'containerPort={lb_container_port} ').format(
            lb_target_group_arn=LOAD_BALANCER_TARGET_GROUP_ARN,
            lb_container_port=LOAD_BALANCER_CONTAINER_PORT,
            lb_name=LOAD_BALANCER_NAME, project=PROJECT) if USE_LOAD_BALANCER else ''

    return ('aws ecs create-service '
            '--cluster {cluster} '
            '--service-name {project} '
            '--task-definition {project} '
            '{lb}'
            '--desired-count {desired_count} '
            '--deployment-configuration '
            'maximumPercent={deploy_max_percent},'
            'minimumHealthyPercent={deploy_min_healthy_percent} '
    ).format(cluster=CLUSTER, project=PROJECT, desired_count=DESIRED_COUNT,
             deploy_max_percent=DEPLOY_MAX_PERCENT,
             deploy_min_healthy_percent=DEPLOY_MIN_HEALTHY_PERCENT,
             role=LOAD_BALANCER_ROLE, lb=lb)

try:
    info('Creating new task definition...')
    taskdef = generate_from_template('task-definition-template.json',
                                     'task-definition.json', REPLACE)
    shell('aws ecs register-task-definition --cli-input-json file://' + taskdef)
    unlink(taskdef)

    if is_service_created(PROJECT):
        cmd = get_service_update_cmd()
    else:
        cmd = get_service_create_cmd()

    shell(cmd)
    info('%s was deployed! :champagne:' % PROJECT)
except Exception, ex:
    error('Could not configure AWS', ex)
    sys.exit(5)
