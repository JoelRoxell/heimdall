# -*- coding: utf-8 -*-
import sys

"""Runs the deployment stages
"""

# Determine which pipeline to run
if len(sys.argv) <= 1:
  print 'Please specify pipeline as first argument'
  sys.exit(1)

PIPELINE = sys.argv[1]
STAGES = [
  'setup',
  'build',
  'push',
  'configure'
]

for stage in STAGES:
  __import__('%s.%s' % (PIPELINE, stage))
