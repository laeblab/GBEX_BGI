from django.db import models
from django.contrib.auth.models import User


class Folder(models.Model):
	name = models.CharField(max_length=255)
	parent = models.ForeignKey("self", on_delete=models.CASCADE, null=True, blank=True)
	restricted_to = models.ManyToManyField(User, blank=True)

	def __str__(self):
		return self.name

	class Meta:
		ordering = ('id', )
		constraints = [models.UniqueConstraint(fields=['name', 'parent'], name='eln_unique_folder_name_in_folder'), ]


class ELNPage(models.Model):
	name = models.CharField(max_length=255)
	parent = models.ForeignKey(Folder, on_delete=models.CASCADE)

	def __str__(self):
		return self.name

	class Meta:
		ordering = ('id', )
		constraints = [models.UniqueConstraint(fields=['name', 'parent'], name='eln_unique_file_name_in_folder'), ]