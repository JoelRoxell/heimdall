# -*- coding: utf-8 -*-
import sys
from utils.cli import shell
from utils.notify import info, error
import config

"""Sets up the necessary AWS configurations

Creates repository if it doesnt exists
"""

def get_repository_uri(repository):
    """Checks if a repository is created already

    Arguments:
      repository {string} -- Name of the repository

    Returns:
       mixed -- Repository URI or None if not found
    """
    res = shell('aws ecr describe-repositories --output text --repository-names %s' % config.PROJECT)

    lines = res.split('\n')
    repo = None

    for line in lines:
        if '/' + repository in line:
            repo = line
            break

    if not repo:
        return None

    return line.split('\t')[-1]

def create_repository(repository):
  """Creates ECR repository

  Arguments:
    repository {string} -- Name of the repository

  Returns:
    string -- Repository URI
  """
  return shell('aws ecr create-repository --repository-name %s --output text' % repository
        ).split('\t')[-1]

try:
    info('Starting deploy!')

    # Create the repository if it doesnt exists already
    uri = get_repository_uri(config.PROJECT)

    if not uri:
        uri = create_repository(config.PROJECT)
        info('Repository %s created' % config.PROJECT)

    config.REPOSITORY = uri
except Exception, ex:
    error('Could not create repository', ex)
    sys.exit(2)
