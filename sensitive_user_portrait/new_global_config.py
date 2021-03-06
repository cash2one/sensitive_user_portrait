# -*- coding: utf-8 -*-

import os
from flask import Flask

REDIS_HOST_INFLUENCE = "10.168.40.1"
REDIS_PORT_INFLUENCE = '6379'

REDIS_HOST_IP = '10.168.40.2'
REDIS_PORT_IP = '6379'

REDIS_HOST_ACTIVITY = '10.168.40.3'
REDIS_PORT_ACTIVITY = '6379'

REDIS_HOST_CLUSTER = '10.168.40.4'
REDIS_PORT_CLUSTER = '6379'

REDIS_HOST_RETWEET = '10.168.40.5'
REDIS_PORT_RETWEET = '6379'

REDIS_HOST_COMMENT = '10.168.40.6'
REDIS_PORT_COMMENT = '6379'

UNAME2UID_HOST = '10.168.40.7'
UNAME2UID_PORT = '6379'
UNAME2UID_HASH = 'weibo_user'

REDIS_HOST = '10.168.40.8'
REDIS_PORT = '6379'
MONITOR_REDIS_HOST = '10.168.40.8'
MONITOR_REDIS_PORT = '6379'

ES_CLUSTER_HOST_FLOW1 = ['10.168.40.1', '10.168.40.2']

ZMQ_VENT_PORT_FLOW1 = '6387'
ZMQ_CTRL_VENT_PORT_FLOW1 = '5585'
ZMQ_VENT_HOST_FLOW1 = '10.168.40.1'
ZMQ_CTRL_HOST_FLOW1 = '10.168.40.8'

ZMQ_VENT_PORT_FLOW2 = '6388'
ZMQ_CTRL_VENT_PORT_FLOW2 = '5586'
ZMQ_VENT_HOST_FLOW2 = '10.168.40.2'
ZMQ_CTRL_HOST_FLOW2 = '10.168.40.8'

ZMQ_VENT_PORT_FLOW3 = '6389'
ZMQ_CTRL_VENT_PORT_FLOW3 = '5587'
ZMQ_VENT_HOST_FLOW3 = '10.168.40.3'
ZMQ_CTRL_HOST_FLOW3 = '10.168.40.8'

ZMQ_VENT_PORT_FLOW4 = '6390'
ZMQ_CTRL_VENT_PORT_FLOW4 = '5588'
ZMQ_VENT_HOST_FLOW4 = '10.168.40.4'
ZMQ_CTRL_HOST_FLOW4 = '10.168.40.8'


USER_PROFILE_ES_HOST = ['10.168.40.1', '10.168.40.2']
USER_PROFILE_ES_PORT = 9200
SENSITIVE_USER_PORTRAIT_ES_HOST = ['10.168.40.3', '10.168.40.4']
SENSITIVE_USER_PORTRAIT_ES_PORT = 9200
FLOW_TEXT_ES_HOST = ['10.168.40.1', '10.168.40.3','10.168.40.8']
FLOW_TEXT_ES_PORT = 9200

R_BEGIN_TIME = '2016-04-25'

RECOMMENTATION_TOPK = 10000

BIN_FILE_PATH = '/home/redis/weibo'
WRITTEN_TXT_PATH = '/home/redis/txt'
