# -*- coding: utf-8 -*-
import scrapy

from joblister.items import JoblisterItem
import re


class AmdSpider(scrapy.Spider):
    name = 'AMDSpider'

    # allowed_domains = ['jobs.amd.com/search/']
    # start_urls = ['https://jobs.amd.com/search//']

    def start_requests(self):
        payload = {'q': '',
                   'q2': '',
                   'title': '',
                   'location': 'US',
                   'date': ''
                   }
        url_payload = '?' + '&'.join(['%s=%s' % (k, v) for k, v in payload.items()])
        yield scrapy.Request(url='https://jobs.amd.com/search/' + url_payload)

    def parse_items(self, response):
        item = JoblisterItem()
        item['job_id'] = re.findall(r'<strong>Requisition Number:\xa0</strong>(\d+)',
                                    response.xpath('//span[@itemprop="description"]').extract_first())
        item['company'] = 'AMD'
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
            yield scrapy.Request(url=response.urljoin(url), callback=self.parse, dont_filter=True)

        for job in response.xpath('//*[@id="searchresults"]//tbody/tr/td//a/@href').extract():
            yield scrapy.Request(url=response.urljoin(job), callback=self.parse_items)
