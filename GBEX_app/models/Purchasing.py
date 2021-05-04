from django.core.validators import MinValueValidator
from django.db import models
from django.forms import DateInput
import datetime
from .models import GBEXModelBase, default_order, default_widgets


menu_label = "Purchasing"


class Transaction(GBEXModelBase):
	what = models.TextField()
	price = models.DecimalField(decimal_places=2, max_digits=9, validators=[MinValueValidator(0)])
	budget = models.PositiveIntegerField()
	order_date = models.DateField(default=datetime.date.today)
	quartzy_import = models.BooleanField(default=False)
	menu_label = menu_label
	symbol = "TRA"
	order = [*default_order, 'what', 'price', 'budget', 'order_date',  'quartzy_import']
	widgets = {
		**default_widgets,
		"order_date": DateInput(attrs={'data-isdate': "yes"})
	}
