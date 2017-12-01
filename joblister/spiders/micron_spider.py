# -*- coding: utf-8 -*-
import re

import scrapy

from joblister.items import JoblisterItem


class MicronSpider(scrapy.Spider):
    name = 'MicronSpider'

    # start_urls = ['https://jobs.micron.com/search/']

    def start_requests(self):
        payload = {'q': '',
                   'q2': '',
                   'title': '',
                   'location': 'US',
                   'date': ''
                   }
        url_payload = '?' + '&'.join(['%s=%s' % (k, v) for k, v in payload.items()])
        yield scrapy.Request(url='https://jobs.micron.com/search/' + url_payload)

    def parse_items(self, response):
        item = JoblisterItem()
        item['job_id'] = re.findall('Req. ID: (\d+)', response.xpath('//span[@itemprop="description"]').extract_first())
        item['company'] = 'Micron'
        item['description'] = response.xpath('//span[@itemprop="description"]').extract_first()
        item['title'] = response.xpath('//*[@id="job-title"]/text()').extract_first()
        # item['location'] =
        # item['experience']
        # item['category']
        item['apply_url'] = response.urljoin(
            response.xpath('//div[@class="jobTitle"]/div[@class="applylink"]/a/@href').extract_first())
        yield item

    def parse(self, response):
        all_nexts = response.xpath('//div[@class="pagination"]//a/@href').extract()
        for url in all_nexts:
            yield scrapy.Request(url=response.urljoin(url), callback=self.parse)

        for job in response.xpath('//*[@id="searchresults"]//tbody/tr/td//a/@href').extract():
            yield scrapy.Request(url=response.urljoin(job), callback=self.parse_items)
