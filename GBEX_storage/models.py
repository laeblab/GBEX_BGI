from django.db import models


class Location(models.Model):
	name = models.TextField()


class Box(models.Model):
	location = models.ForeignKey(Location, on_delete=models.PROTECT)
	rows = models.PositiveIntegerField()
	columns = models.PositiveIntegerField()


class Vial(models.Model):
	box = models.ForeignKey(Box, on_delete=models.PROTECT)
	pos_index = models.PositiveIntegerField()  # consider row+column instead of index
