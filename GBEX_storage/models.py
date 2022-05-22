from django.db import models


class Location(models.Model):
	name = models.CharField(max_length=255)
	parent = models.ForeignKey("self", on_delete=models.CASCADE, null=True, blank=True)

	def __str__(self):
		return self.name

	class Meta:
		ordering = ('id', )
		constraints = [models.UniqueConstraint(fields=['name', 'parent'], name='unique_loc_name_in_loc'), ]


class Box(models.Model):
	name = models.CharField(max_length=255)
	parent = models.ForeignKey(Location, on_delete=models.CASCADE)
	rows = models.PositiveIntegerField()
	columns = models.PositiveIntegerField()

	def __str__(self):
		return self.name

	class Meta:
		ordering = ('id', )
		constraints = [models.UniqueConstraint(fields=['name', 'parent'], name='unique_box_name_in_loc'), ]


class Vial(models.Model):
	label = models.CharField(max_length=255)
	description = models.TextField(blank=True)

	parent = models.ForeignKey(Box, on_delete=models.CASCADE)
	box_row = models.PositiveIntegerField()
	box_column = models.PositiveIntegerField()

	def __str__(self):
		return self.label

	class Meta:
		ordering = ('id', )
		constraints = [models.UniqueConstraint(fields=['parent', 'box_row', 'box_column'], name='unique_vial_box'), ]
