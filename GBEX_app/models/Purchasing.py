from django.db import models
import datetime
from .models import GBEXModelBase, default_order

menu_label = "Purchasing"


class Transaction(GBEXModelBase):
	what = models.TextField()
	price = models.PositiveIntegerField()
	budget = models.PositiveIntegerField()
	order_date = models.DateField(default=datetime.date.today)
	quartzy_import = models.BooleanField(default=False)
	menu_label = menu_label
	symbol = "TRA"
	order = [*default_order, 'what', 'price', 'budget', 'order_date',  'quartzy_import']
