# -*- coding: utf-8 -*-
import json

import scrapy

import requests
import time

from joblister.items import JoblisterItem


class QualcommSpider(scrapy.Spider):
    name = 'QualcommSpider'
    start_urls = ['https://jobs.qualcomm.com/public/jobDetails.xhtml']

    def get_content(self, page=0, jobs=[]):
        payload = {'action': 'getJobsSearchResults',
                   'searchTerm': '',
                   'facetId': 'WORLD',
                   'subFacetId': 'US',
                   'facetsSelected': '',
                   'filterCleared': '',
                   'recordsNumber': '',
                   'sortOrder': '',
                   'timeOfRequest': '%d' % int(time.time()),
                   'referer': ''}

        if page > 0:
            payload['pageNumber'] = page
        r = requests.get("https://jobs.qualcomm.com/SolrSearchServlet.do", params=payload)
        print(r.url)

        data = r.json()
        job_search_results = json.loads(data['jobsSearchResultsList'])

        jobs += job_search_results['response']['docs']

        if job_search_results['response']['numFound'] > job_search_results['response']['start']:
            jobs = self.get_content(
                page=job_search_results['response']['start'] + len(job_search_results['response']['docs']),
                jobs=jobs)
        return jobs

    def parse(self, page=0):
        job_search_results = self.get_content()
        for job in job_search_results:
            item = JoblisterItem()

            item['job_id'] = job['REQ_DIV_ID']
            item['company'] = 'Qualcomm'
            item['description'] = job['SYNOPSIS']
            item['title'] = job['POSTING_TITLE']
            # item['location'] =
            # item['experience']
            # item['category']
            item['apply_url'] = 'https://jobs.qualcomm.com/public/jobDetails.xhtml?requisitionId=%s' % job['REQ_NUM_ID']
            yield item
