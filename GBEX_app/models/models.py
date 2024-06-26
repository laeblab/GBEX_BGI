from django.contrib.auth.models import User
from django.db import models
from django.urls import reverse_lazy

from dal import autocomplete


# Profile model for storing user settings in a JSON field
class Profile(models.Model):
	user = models.OneToOneField(User, on_delete=models.CASCADE)
	table_settings = models.JSONField()


# some defaults for quickly making GBEXModels
default_order = ['id', 'name', 'responsible']
default_widgets = {'Responsible': autocomplete.ModelSelect2(url=reverse_lazy('User-autocomplete')), }
default_readonly = ['id', 'name']


# Base model to capture shared fields
class GBEXModelBase(models.Model):
	name = models.TextField(unique=True)  # All instances need a name. This is typically automatically generated
	responsible = models.ForeignKey(User, on_delete=models.PROTECT, null=True, blank=True)  # A user is associated with each object
	# 3 hidden fields that store info on creation/edit date and info on whether this object is archived (not send to frontend)
	created = models.DateTimeField(auto_now_add=True)
	edited = models.DateTimeField(auto_now=True)
	archived = models.BooleanField(default=False)
	order = default_order  # which order should the fields be displayed in
	symbol = ""  # string for generating name  "symbol" + number
	col_display_func_dict = {}  # custom display functions. Used e.g. for many2many links
	widgets = default_widgets  # custom widgets Used e.g. for autocompletes for foreignkeys
	model_kind = "GBEX_Page"  # indicate that this is a frontend item
	col_html_string = []  # a list of columns that will be showed as html instead of string
	col_read_only = [*default_readonly]  # a list of columns where the GUI will not show an editor

	def __str__(self):
		return self.name

	class Meta:
		abstract = True
		ordering = ['id']


# model for controlled dictionaries. Attached via foreign key
class BaseOption(models.Model):
	name = models.TextField(unique=True)
	created = models.DateTimeField(auto_now_add=True)

	model_kind = "GBEX_Option"  # indicate that this is a frontend item

	def __str__(self):
		return self.name

	class Meta:
		abstract = True
		ordering = ['name']
