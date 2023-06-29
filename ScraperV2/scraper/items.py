
# clase con title, brand, price, best_price, sub_category, content, alcoholic_grade, package, image_url
class ProductItem:
  def __init__(self):
    self.title = None
    self.brand = None
    self.price = None
    self.best_price = None
    self.sub_category = None
    self.content = None
    self.alcoholic_grade = None
    self.package = None
    self.image_url = None

  def is_values_none(self):
    attributes = [self.title, self.brand, self.price, self.best_price, self.content, self.alcoholic_grade, self.package, self.image_url]
    for attribute in attributes:
      if attribute is None:
        return True
    return False
