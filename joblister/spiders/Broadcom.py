# -*- coding: utf-8 -*-
import scrapy


class BroadcomSpider(scrapy.Spider):
    name = 'Broadcom'
    # allowed_domains = ['avagotech.wd1.myworkdayjobs.com/External_Career']
    start_urls = ['https://avagotech.wd1.myworkdayjobs.com/External_Career/']

    def parse(self, response):
        response.xpath('*[@id="wd-Facet-locations"]//*[""]')
wd-Facet-locations