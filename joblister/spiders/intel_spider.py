import scrapy

from joblister.items import JoblisterItem
import logging

import requests


class IntelSpider(scrapy.Spider):
    name = "IntelSpider"

    def start_requests(self):
        # urls = ['http://jobs.intel.com/ListJobs/All']
        urls = ['http://jobs.intel.com/ListJobs/All/Search/country/us/']
        for url in urls:
            yield scrapy.Request(url=url, callback=self.parse)

    def parse(self, response):
        for req in response.xpath('//div[@class="pager jobs-nav"]/a/@href').extract():
            try:
                print(response.urljoin(req))
                yield scrapy.Request(url=response.urljoin(req), callback=self.parse)
            except TypeError:
                logging.warning("Type error URL")

        jobs = response.xpath('//table[@class="JobListTable"]//tr')
        for job in jobs[2:]:
            url = job.xpath('td[@class="coljobtitle"]/a/@href').extract_first()
            yield scrapy.Request(url=response.urljoin(url), callback=self.parse_description)

    def parse_description(self, response):
        job = JoblisterItem()

        job['url'] = response.url
        job['company'] = 'Intel'
        job['job_id'] = response.xpath(
            '//section[@class="jobs-detail"]//div[@class="detail-header row"]/div[1]/div[1]/text()').extract_first()
        job['category'] = response.xpath(
            '//section[@class="jobs-detail"]//div[@class="detail-header row"]/div[1]/div[2]/text()').extract_first()
        job['location'] = response.xpath(
            '//section[@class="jobs-detail"]//div[@class="detail-header row"]/div[1]/div[3]/text()').extract_first()
        job['experience'] = response.xpath(
            '//section[@class="jobs-detail"]//div[@class="detail-header row"]/div[2]/div[2]/text()').extract_first()
        job['title'] = response.xpath('//section[@class="jobs-detail"]//h3/text()').extract_first()
        job['description'] = "\n".join(response.xpath(
            '//section[@class="jobs-detail"]//div[@class="jobdescriptiontbl"]').extract())
        job['apply_url'] = response.xpath(
            '//section[@class="jobs-detail"]//div[@class="applyBtnBottomDiv"]//a/@href').extract_first()
        yield job
