# -*- coding:utf-8 -*-
__author__ = 'Daniel'

import pyodbc
import datetime
import os
import importlib
import traceback
import urllib.request
import urllib.response
from plugins import Result, Query, Response
from bs4 import BeautifulSoup
from multiprocessing import Pool, Process, Queue

NumProcess = 3
Count = 10000
Plugins = []

def LoadPlugins():
    global Plugins
    plugins = os.listdir('./plugins')
    plugins = [ plugin for plugin in plugins if not plugin.startswith('_')]
    Plugins = [ importlib.import_module('plugins.' + modname) for modname in plugins ]

def proceHtml(content):
    if type(content) == bytes:
        content = content.decode('utf-8')
    params = ""
    if content[:3] == 'GET':
        query, response, html = content.split('\r\n\r\n', 2)
    elif content[:5] == 'POST ':
        query, params, response, html = content.split('\r\n\r\n', 3)
    else:
        print('[INFO] not excepted.', type(content), content[:content.find('\r\n')])
        return
    #print(html[:250].encode('utf-8').decode('gbk'))
    query = Query(query, params)
    response = Response(response)
    soup = BeautifulSoup(html, 'lxml', from_encoding='utf-8')
    for plugin in Plugins:
        if plugin.Domain in query.host:  # error in cdn
            for mod in plugin.modules:
                if not hasattr(mod, 'Filter'):
                    continue
                print(mod.Filter, query.url)
                if mod.Filter in query.url.lower():
                    print(mod, 'process...')
                    result = Result()
                    mod.Load(query, response, soup, result)
                    print(result)
                    return

def ProcessMod():
    for mod in Plugins:
        setattr(mod, 'modules', [])
        for name in dir(mod):
            if not name.startswith('_') and hasattr(getattr(mod, name), 'Type'):
                mod.modules.append(getattr(mod, name))

def ProcessHtml(qu, i):
    LoadPlugins()
    ProcessMod()
    while True:
        content = qu.get()
        if (content == "quit"): return
        proceHtml(content)

def makeProcess():
    contents = Queue(100)
    tasks = [ Process(target=ProcessHtml, args=(contents, i )) for i in range(NumProcess) ]
    for task in tasks:
        task.start()
    return contents, tasks

def stopProcess(msg, tasks):
    for i in range(NumProcess):
        msg.put("quit")
    [ task.join() for task in tasks ]

def gethtmlfromdb(*ids):
    dbconn = pyodbc.connect("driver={SQL Server};server=10.55.100.14;database=ERU_DB_BAK;uid=gh;pwd=123.com")
    cur = dbconn.cursor()
    sql = "select data from visit_raw_data_2014_06 where id in ("
    for id in ids:
        sql += "%d,"%id
    sql = sql[0:-1] + ')'
    print(sql)
    cur.execute(sql)
    result = cur.fetchall()
    cur.close()
    dbconn.close()
    return [ row[0] for row in result ]
    #return result

def gethtmlfromfild():
    #fnames = [ 'cnki%d.html'%i for i in range(10) ]
    fnames = ['cnki10.html']
    result = [ open(fname,'rb').read() for fname in fnames ]
    return result

# parse plugins
def run():
    QMsg, tasks = makeProcess()
    #Msgs = gethtmlfromdb(158652618,158648491)
                         #,158644816,158628304,158606530,158604213,158578024,158569452,158563367,158560000)
    Msgs = gethtmlfromfild()

    start = datetime.datetime.now()
    for i in range(Count):
        for Msg in Msgs:
            QMsg.put(Msg)
    stopProcess(QMsg, tasks)
    print(start, datetime.datetime.now())

# process bs
def pretyhtml():
    htmls = os.listdir(".")
    htmls = [ html for html in htmls if html.endswith("htm") ]
    for html in htmls:
        print("==" * 10, html)
        print(PretyHtml(html))
        break

def PretyHtml(html):
    content = open(html, "rt", encoding="utf-8").read()
    pos = content.find("<html")
    content = content[pos:]
    print(content.encode("utf-8").decode("gbk"))
    return BeautifulSoup(content, from_encoding="utf-8").get_text().encode(encoding="utf16").decode(encoding="gbk", errors="replace")

if __name__ == "__main__":
    pretyhtml()    
    #run()
