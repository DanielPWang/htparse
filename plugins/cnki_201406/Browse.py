__author__ = 'Daniel'

from plugins import *

Type = 'View'
Filter = '/kcms/detail/detail.aspx'

def Load(query, response, soup, result):
    result.datebase = soup.title.string.split('-')[1]
    result.title = soup.title.string.split('-')[0]
    result.abstract = soup.find('span', id='ChDivSummary').string
    result.author = soup.find('a', class_="KnowledgeNetLink").string