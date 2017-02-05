# -*- coding: utf8 -*-
import subprocess
import sys

"""Command line helper tools
"""

def shell(cmd):
    """Runs a shell command

    Arguments:
        cmd {string} -- The command to run

    Returns:
        string -- Stdout and stderr

    Raises:
        Exception -- If the exit code wasnt 0
    """
    p = subprocess.Popen(cmd, shell=True, stdout=subprocess.PIPE,
                         stderr=subprocess.STDOUT)

    result = ''

    for line in iter(p.stdout.readline, ''):
        result += line
        sys.stdout.write(line)

    retval = p.wait() # Wait for the process to exit to get exit code

    if retval != 0:
        raise Exception('Command exited with non zero code (' + str(retval) + ')',
                        result)

    return result
