from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.db import models


class Location(models.Model):
	name = models.TextField()
	parent_loc = models.ForeignKey("self", on_delete=models.PROTECT, null=True)

	def __str__(self):
		return self.name


class Box(models.Model):
	name = models.TextField()
	location = models.ForeignKey(Location, on_delete=models.PROTECT)
	rows = models.PositiveIntegerField()
	columns = models.PositiveIntegerField()

	def __str__(self):
		return self.name


class Vial(models.Model):
	box = models.ForeignKey(Box, on_delete=models.PROTECT)
	####
	# pos_index must be unique with Box
	# https://docs.djangoproject.com/en/3.2/ref/models/constraints/#django.db.models.UniqueConstraint
	####
	pos_index = models.PositiveIntegerField()  # consider row+column instead of index
	content_type = models.ForeignKey(ContentType, on_delete=models.PROTECT, null=True)
	object_id = models.PositiveIntegerField(null=True)
	content_object = GenericForeignKey('content_type', 'object_id')

	def __str__(self):
		return self.content_object.name
