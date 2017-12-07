# -*- coding: utf-8 -*-
import scrapy

import re


class BroadcomSpider(scrapy.Spider):
    name = 'Broadcom'
    # allowed_domains = ['avagotech.wd1.myworkdayjobs.com/External_Career']
    # baseurl = 'https://avagotech.wd1.myworkdayjobs.com/External_Career/'
    baseurl = 'https://nvidia.wd5.myworkdayjobs.com/NVIDIAExternalCareerSite'

    def start_requests(self):
        yield scrapy.Request(url=self.baseurl, meta={'selenium_condition': "kggmanamaridta"})

    def parse(self, response):
        facets = response.xpath('//*[@id="workdayApplicationFrame"]//div[@data-automation-id="facet"]')
        facet_data = []

        for facet in facets:
            facet.xpath('//div[@data-automation-id="facetValue"]')
        # for i in data:
        #     print(i)
        #     open('results/ids.txt', 'a').write(i + '\n')

            # open('results/nvidia.html', 'w').write(data)

    def jsonparse(self, response):
        print(response.headers)
        open('save.html', 'w').write(response.body_as_unicode())

    def save_js(self, response):
        file_name = response.url.split('?')[0].split("/")[-1]
        print(file_name)
        open('results/%s' % file_name, 'w').write(response.body_as_unicode().encode('ascii').decode('ascii'))
