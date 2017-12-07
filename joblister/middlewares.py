# -*- coding: utf-8 -*-

# Define here the models for your spider middleware
#
# See documentation in:
# http://doc.scrapy.org/en/latest/topics/spider-middleware.html

from scrapy import signals
from selenium import webdriver
from scrapy.http import HtmlResponse
import os
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.common.by import By
from selenium.common.exceptions import TimeoutException

class JoblisterSpiderMiddleware(object):
    # Not all methods need to be defined. If a method is not defined,
    # scrapy acts as if the spider middleware does not modify the
    # passed objects.

    @classmethod
    def from_crawler(cls, crawler):
        # This method is used by Scrapy to create your spiders.
        s = cls()
        crawler.signals.connect(s.spider_opened, signal=signals.spider_opened)
        return s

    def process_spider_input(self, response, spider):
        # Called for each response that goes through the spider
        # middleware and into the spider.

        # Should return None or raise an exception.
        return None

    def process_spider_output(self, response, result, spider):
        # Called with the results returned from the Spider, after
        # it has processed the response.

        # Must return an iterable of Request, dict or Item objects.
        for i in result:
            yield i

    def process_spider_exception(self, response, exception, spider):
        # Called when a spider or process_spider_input() method
        # (from other spider middleware) raises an exception.

        # Should return either None or an iterable of Response, dict
        # or Item objects.
        pass

    def process_start_requests(self, start_requests, spider):
        # Called with the start requests of the spider, and works
        # similarly to the process_spider_output() method, except
        # that it doesn’t have a response associated.

        # Must return only requests (not items).
        for r in start_requests:
            yield r

    def spider_opened(self, spider):
        spider.logger.info('Spider opened: %s' % spider.name)


class JSMiddleware(object):
    def __init__(self):
        # fp = webdriver.FirefoxProfile("/home/varunbhat/.mozilla/firefox/mp0kt99x.default")
        # fp.set_preference("browser.download.folderList",2)
        # fp.set_preference("browser.download.dir", os.getcwd()+"/downloads")
        # self.driver = webdriver.Firefox(firefox_profile=fp)
        self.driver = webdriver.PhantomJS()


    def process_request(self, request, spider):
        if request.meta.get('selenium_enable', True) is False:
            return None
        self.driver.get(request.url)
        
        # Wait for Page to load
        if request.meta.get('selenium_condition') is not None:
            try:
                WebDriverWait(self.driver, 10).until(EC.presence_of_element_located((By.ID, request.meta.get('selenium_condition'))))
            except TimeoutException:
                pass 

        return HtmlResponse(url=self.driver.current_url, body=self.driver.page_source, encoding='utf-8')