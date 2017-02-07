# -*- coding: utf-8 -*-
import os
from slackclient import SlackClient

"""Notifications

Notification implementation for deploy pipeline steps using Slack
"""

# Slack channel to post to
CHANNEL = os.getenv('SLACK_CHANNEL', '#general')

# Bot username to post as
USERNAME = os.getenv('SLACK_USERNAME', 'Dompen')

# Avatar to use for bot (48x48 optimal)
AVATAR = os.getenv('SLACK_AVATAR', 'http://i.imgur.com/Hl2mu1Q.jpg')

sc = SlackClient(os.getenv('SLACK_TOKEN', ''))

def info(msg, meta = None):
    """Sends an info message to Slack

    Arguments:
        msg {string} -- Message to send

    Keyword Arguments:
        meta {mixed} -- Any relevant meta data,
            will show up as a plain text block (default: {None})
    """
    print msg, meta if meta else ''
    msg = ':punch: ' + msg

    if meta:
        msg = msg + '\n```' + str(meta) + '```'

    sc.api_call(
        'chat.postMessage',
        channel=CHANNEL,
        text=msg,
        username=USERNAME,
        icon_url=AVATAR
    )

def error(msg, ex):
    """Sends an error message to Slack

    Arguments:
        msg {string} -- Message to send
        ex {Exception} -- Exception to send along
    """
    print msg, ex
    msg = ':x: {msg}: `{exmsg}`\n```{ex}```'.format(msg=msg, exmsg=str(ex[0]), ex=str(ex[1]))
    sc.api_call(
        'chat.postMessage',
        channel=CHANNEL,
        text=msg,
        username=USERNAME,
        icon_url=AVATAR
    )
