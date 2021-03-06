# -*-coding:utf-8-*-

import json
from elasticsearch import Elasticsearch
from sensitive_user_portrait.global_utils import es_flow_text as es_text
from sensitive_user_portrait.global_utils import ES_CLUSTER_FLOW1 as es_bci


def query_body(message_type, uid):
    query_body = {
        "query":{
            "filtered":{
                "filter":{
                    "bool":{
                        "must":[
                            {"term":{"message_type":message_type}},
                            {"term":{"uid": uid}}
                        ]
                    }
                }
            }
        },
        "size": 1000
    }

    return query_body

def bci_detail(date, uid, sensitive=0):
    if not sensitive:
        bci_index = "bci_" + date.replace('-','')
        try:
            bci_result = es_bci.get(index=bci_index, doc_type="bci", id=uid)['_source']
        except:
            bci_result = dict()

        try:
            origin_retweeted = json.loads(bci_result.get("origin_weibo_retweeted_detail", []))
        except:
            origin_retweeted = []
        origin_weibo_retweeted_brust_average = bci_result.get("origin_weibo_retweeted_brust_average", 0) # 爆发数
        try:
            origin_comment = json.loads(bci_result.get("origin_weibo_comment_detail", []))
        except:
            origin_comment = []
        origin_weibo_comment_brust_average = bci_result.get("origin_weibo_comment_brust_average", 0)
        try:
            retweeted_retweeted = json.loads(bci_result.get("retweeted_weibo_retweeted_detail", []))
        except:
            retweeted_retweeted = []
        retweeted_weibo_retweeted_brust_average = bci_result.get('retweeted_weibo_retweeted_brust_average', 0)
        try:
            retweeted_comment = json.loads(bci_result.get("retweeted_weibo_comment_detail", []))
        except:
            retweeted_comment = []
        retweeted_weibo_comment_brust_average = bci_result.get('retweeted_weibo_comment_brust_average', 0)



    origin_query = query_body(1, uid)
    text_index = "flow_text_" + date
    if not sensitive:
        origin_text = es_text.search(index=text_index, doc_type="text", body=origin_query)["hits"]["hits"]
    else:
        sensitive_origin_query = origin_query["query"]["filtered"]["filter"]["bool"]["must"].append({"range":{"sensitive":{"gt":0}}})
        origin_text = es_text.search(index=text_index, doc_type="text", body=sensitive_origin_query)["hits"]["hits"]
    #print origin_text
    retweeted_query = query_body(3, uid)
    if not sensitive:
        retweeted_text = es_text.search(index=text_index, doc_type="text", body=retweeted_query)["hits"]["hits"]
    else:
        sensitive_retweeted_query = retweeted_query["query"]["filtered"]["filter"]["bool"]["must"].append({"range":{"sensitive":{"gt":0}}})
        retweeted_text = es_text.search(index=text_index, doc_type="text", body=sensitive_retweeted_query)["hits"]["hits"]

    origin_weibo_number = len(origin_text) # 1
    retweeted_weibo_number = len(retweeted_text) #2
 
    retweet_total_number = 0 # 转发总数
    comment_total_number = 0 # 评论总数
    origin_retweet_total_number = 0 # 原创被转发总数
    origin_comment_total_number = 0 # 原创被评论总数
    retweet_retweet_total_number = 0 # 转发被转发总数
    retweet_comment_total_number = 0 # 转发被评论总数
    origin_retweet_average_number = 0 # 原创被转发平均数
    origin_comment_average_number = 0 # 原创被评论平均数
    retweet_retweet_average_number = 0 # 转发被转发平均数
    retweet_comment_average_number = 0 # 转发被评论平均数
    origin_retweet_top_number = 0 # 原创被转发最高
    origin_comment_top_number = 0 # 原创被评论最高
    retweet_retweet_top_number = 0 # 转发被转发最高
    retweet_comment_top_number = 0 # 转发被评论最高
    origin_sensitive_words_dict = dict()
    retweeted_sensitive_words_dict = dict()
    for item in origin_text:
        retweet_total_number += item['_source'].get('retweeted', 0)
        comment_total_number += item['_source'].get('comment', 0)
        origin_retweet_total_number += item['_source'].get('retweeted', 0)
        origin_comment_total_number += item['_source'].get('comment', 0)
        if origin_retweet_top_number < item['_source'].get('retweeted', 0):
            origin_retweet_top_number = item['_source'].get('retweeted', 0)
        if origin_comment_top_number < item['_source'].get('comment', 0):
            origin_comment_top_number = item['_source'].get('comment', 0)
        if sensitive:
            sensitive_words_dict = json.loads(item['_source']['sensitive_words_dict'])
            if sensitive_words_dict:
                for k,v in sensitive_words_dict.iteritems():
                    try:
                        origin_sensitive_words_dict[k] += v
                    except:
                        origin_sensitive_words_dict[k] = v
    for item in retweeted_text:
        retweet_total_number += item['_source'].get('retweeted', 0)
        comment_total_number += item['_source'].get('comment', 0)
        retweet_retweet_total_number += item['_source'].get('retweeted', 0)
        retweet_comment_total_number += item['_source'].get('comment', 0)
        if retweet_retweet_top_number < item['_source'].get('retweeted', 0):
            retweeet_retweet_top_number = item['_source'].get('retweeted', 0)
        if retweet_comment_top_number < item['_source'].get('comment', 0):
            retweet_comment_top_number = item['_source'].get('comment', 0)
        if sensitive:
            sensitive_words_dict = json.loads(item['_source']['sensitive_words_dict'])
            if sensitive_words_dict:
                for k,v in sensitive_words_dict.iteritems():
                    try:
                        retweeted_sensitive_words_dict[k] += v
                    except:
                        retweeted_sensitive_words_dict[k] = v
    try:
        average_retweet_number = retweet_total_number/(origin_weibo_number+retweeted_weibo_number) # 平均转发数
    except:
        average_retweet_number = 0
    try:
        average_comment_number = comment_total_number/(origin_weibo_number+retweeted_weibo_number) # 平均评论数
    except:
        average_comment_number = 0

    try:
        origin_retweet_average_number = origin_retweet_total_number/origin_weibo_number
    except:
        origin_retweet_average_number = 0
    try:
        origin_comment_average_number = origin_comment_total_number/origin_weibo_number
    except:
        origin_comment_average_number = 0
    try:
        retweet_retweet_average_number = retweet_retweet_total_number/retweeted_weibo_number
    except:
        retweet_retweet_average_number = 0
    try:
        retweet_comment_average_number = retweet_comment_total_number/retweeted_weibo_number
    except:
        retweet_comment_average_number = 0

    result = dict()
    result["origin_weibo_number"] = origin_weibo_number
    result["retweeted_weibo_number"] = retweeted_weibo_number
    result["origin_weibo_retweeted_total_number"] = origin_retweet_total_number
    result["origin_weibo_comment_total_number"] = origin_comment_total_number
    result["retweeted_weibo_retweeted_total_number"] = retweet_retweet_total_number
    result["retweeted_weibo_comment_total_number"] = retweet_comment_total_number
    result["origin_weibo_retweeted_average_number"] = origin_retweet_average_number
    result["origin_weibo_comment_average_number"] = origin_comment_average_number
    result["retweeted_weibo_retweeted_average_number"] = retweet_retweet_average_number
    result["retweeted_weibo_comment_average_number"] = retweet_comment_average_number
    result["origin_weibo_retweeted_top_number"] = origin_retweet_top_number
    result["origin_weibo_comment_top_number"] = origin_comment_top_number
    result["retweeted_weibo_retweeted_top_number"] = retweet_retweet_top_number
    result["retweeted_weibo_comment_top_number"] = retweet_comment_top_number
    if not sensitive:
        result["origin_weibo_comment_brust_average"] = origin_weibo_comment_brust_average
        result["origin_weibo_retweeted_brust_average"] = origin_weibo_retweeted_brust_average
        result["retweeted_weibo_comment_brust_average"] = retweeted_weibo_comment_brust_average
        result["retweeted_weibo_retweeted_brust_average"] = retweeted_weibo_retweeted_brust_average
        result['user_index'] = bci_result.get('user_index', 0)
    else:
        result["retweeted_sensitive_words_list"] = sorted(retweeted_sensitive_words_dict.items(), key=lambda x:x[1], reverse=True)
        result["origin_sensitive_words_list"] = sorted(origin_sensitive_words_dict.items(), key=lambda x:x[1], reverse=True)
        result["retweeted_sensitive_words_number"] = len(retweeted_sensitive_words_dict)
        result["origin_sensitive_words_number"] = len(origin_sensitive_words_dict)

    return result

if __name__ == "__main__":
    print bci_detail("2016-03-28", "1742566624")
