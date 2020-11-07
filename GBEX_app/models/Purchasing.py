from django.db import models
from .models import GBEXModelBase

menu_label = "Purchasing"


class Transaction(GBEXModelBase):
	what = models.TextField()
	price = models.PositiveIntegerField()
	menu_label = menu_label
	symbol = "TRA"
