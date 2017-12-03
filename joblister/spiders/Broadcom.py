# -*- coding: utf-8 -*-
import scrapy


class BroadcomSpider(scrapy.Spider):
    name = 'Broadcom'
    # allowed_domains = ['avagotech.wd1.myworkdayjobs.com/External_Career']
    baseurl = 'https://avagotech.wd1.myworkdayjobs.com/External_Career/'

    def start_requests(self):
        yield scrapy.Request(url=self.baseurl)

    def parse(self, response):
        # response.xpath('*[@id="wd-Facet-locations"]//*[""]')
        open('save.html', 'w').write(response.body_as_unicode())
