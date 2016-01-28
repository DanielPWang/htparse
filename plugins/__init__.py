__author__ = 'Daniel'

from bs4 import BeautifulSoup
import re

class Result:
    def __init__(self):
        pass
    def __getattr__(self, item):
        return ""
    def __setattr__(self, key, value):
        self.__dict__[key] = value
    def __str__(self):
        return str(self.__dict__)

class Query:
    def __init__(self, query, params):
        self.content = query
        self.params = params
        self.lines = query.splitlines()
    def __getattr__(self, item):
        if item=='url':
            return self.lines[0]
        for line in self.lines[1:]:
            line = line.lower()
            name, value = line.split(':')
            if name==item: return value
        return ''
    def __str__(self):
        return self.content

class Response:
    def __init__(self, response):
        self.content = response
        self.lines = response.splitlines()
    def __getattr__(self, item):
        if item=='state':
            return self.lines[0]
        for line in self.lines[1:]:
            line = line.lower()
            name, value = line.split(':')
            if name==item: return value
        return ''
    def __str__(self):
        return self.content