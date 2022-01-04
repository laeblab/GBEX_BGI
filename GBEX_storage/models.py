from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.db import models
from GBEX_app.models.Inventory import AntiGenBodyBatch, CellLineBatch, CultureMediaBatch, PlasmidBatch, StrainBatch, gRNA, Primers, Toxins
from functools import reduce
from operator import or_


class Location(models.Model):
	name = models.CharField(max_length=255)
	parent = models.ForeignKey("self", on_delete=models.CASCADE, null=True, blank=True)

	def __str__(self):
		return self.name

	class Meta:
		ordering = ('id', )


class Box(models.Model):
	name = models.CharField(max_length=255)
	parent = models.ForeignKey(Location, on_delete=models.CASCADE)
	rows = models.PositiveIntegerField()
	columns = models.PositiveIntegerField()

	def __str__(self):
		return self.name

	class Meta:
		ordering = ('id', )


class Vial(models.Model):
	name = models.CharField(max_length=255)  # copy the name from content_object
	parent = models.ForeignKey(Box, on_delete=models.CASCADE)
	box_row = models.PositiveIntegerField()
	box_column = models.PositiveIntegerField()

	linkable_models = [AntiGenBodyBatch, CellLineBatch, CultureMediaBatch, PlasmidBatch, StrainBatch, gRNA, Primers, Toxins]
	limit = reduce(or_, [models.Q(model=m) for m in linkable_models])
	content_type = models.ForeignKey(ContentType, on_delete=models.PROTECT, null=True, limit_choices_to=limit)
	object_id = models.PositiveIntegerField(null=True)
	content_object = GenericForeignKey('content_type', 'object_id')

	def __str__(self):
		return self.name

	# try to save some db lookups
	def save(self, *args, **kwargs):
		self.name = self.content_object.name
		super().save(*args, **kwargs)

	class Meta:
		ordering = ('id', )
		constraints = [models.UniqueConstraint(fields=['parent', 'box_row', 'box_column'], name='unique_vial_box'), ]
