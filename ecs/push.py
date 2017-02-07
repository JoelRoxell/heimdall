# -*- coding: utf-8 -*-
import sys
from utils.cli import shell
from utils.notify import info, error
from config import VERSION, REPOSITORY

"""Handles pushing of Docker image to the repository

1. Authenticates against AWS ECR (EC2 Container Registry)
2. Pushes the Docker image
3. Cleans up the built image to prevent filling disk on integration server
"""

try:
    shell('eval "$(aws ecr get-login)"')
    info('Authenticated against ECR, pushing image...')
    shell('docker push %s:%s' % (REPOSITORY, VERSION))
    info('Docker image (%s:%s) pushed, cleaning up...' % (REPOSITORY, VERSION))
    shell('docker rmi %s:%s' % (REPOSITORY, VERSION))
except Exception, ex:
    error('Could not push Docker image', ex)
    sys.exit(4)
