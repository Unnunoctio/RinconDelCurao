# Define here the models for your scraped items
#
# See documentation in:
# https://docs.scrapy.org/en/latest/topics/items.html

import scrapy


class ScraperItem(scrapy.Item):
    # define the fields for your item here like:
    # name = scrapy.Field()
    pass

class ProductItem(scrapy.Item):
    title = scrapy.Field()
    brand = scrapy.Field()
    price = scrapy.Field()
    best_price = scrapy.Field()
    sub_category = scrapy.Field()
    quantity = scrapy.Field()
    content = scrapy.Field()
    alcoholic_grade = scrapy.Field()
    package = scrapy.Field()
    image_url = scrapy.Field()

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._set_defaults()

    def _set_defaults(self):
        for field in self.fields:
            self[field] = None

    def is_values_none(self):
        for field in self.fields:
            if field == 'sub_category':
                continue
            if self[field] is None:
                return True
        return False