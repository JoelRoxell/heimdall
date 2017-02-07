# -*- coding: utf-8 -*-
import json
from os.path import join, realpath, dirname

"""Loads package.json configuration
"""

# Load package.json
dir_name = dirname(realpath(__file__))
with open(join(dir_name, '../../package.json')) as data_file:
    package = json.load(data_file)

NAME = package['name']
VERSION = package['version']
