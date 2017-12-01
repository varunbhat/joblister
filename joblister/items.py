# -*- coding: utf-8 -*-

# Define here the models for your scraped items
#
# See documentation in:
# http://doc.scrapy.org/en/latest/topics/items.html

import scrapy


class JoblisterItem(scrapy.Item):
    # define the fields for your item here like:
    job_id = scrapy.Field()
    company = scrapy.Field()
    title = scrapy.Field()
    description = scrapy.Field()
    location = scrapy.Field()
    experience = scrapy.Field()
    url = scrapy.Field()
    category = scrapy.Field()
    apply_url = scrapy.Field()
