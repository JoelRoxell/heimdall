# -*- coding: utf-8 -*-
import sys
from utils.cli import shell
from utils.notify import info, error
from config import VERSION, REPOSITORY

"""Builds the Docker image

Builds the Docker image with the correct build tag based on project name and
version specified in package.json
"""

try:
    shell('docker build -t %s:%s .' % (REPOSITORY, VERSION))
    info('Docker image built successfully (%s:%s)' % (REPOSITORY, VERSION))
except Exception, ex:
    error('Could not build Docker image (%s:%s)' % (REPOSITORY, VERSION), ex)
    sys.exit(3)
