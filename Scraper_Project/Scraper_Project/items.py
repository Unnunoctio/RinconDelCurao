# Define here the models for your scraped items
#
# See documentation in:
# https://docs.scrapy.org/en/latest/topics/items.html

import scrapy


class ScraperProjectItem(scrapy.Item):
    # define the fields for your item here like:
    # name = scrapy.Field()
    pass


class ProductItem(scrapy.Item):
    title = scrapy.Field()
    brand = scrapy.Field()
    price = scrapy.Field()
    best_price = scrapy.Field()
    # category = scrapy.Field()
    sub_category = scrapy.Field()
    quantity = scrapy.Field()
    content_unit = scrapy.Field()
    alcoholic_grade = scrapy.Field()
    packaging = scrapy.Field()

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._set_defaults()

    def _set_defaults(self):
        for field in self.fields:
            self[field] = None

