from django.contrib import admin
from reversion_compare.admin import CompareVersionAdmin
from rest_framework.authtoken.admin import TokenAdmin
from django.apps import apps
from glob import glob
from importlib import import_module

model_files = glob("GBEX_app/models/*.py")
model_files.remove("GBEX_app/models/__init__.py")
model_modules = [import_module(x.replace("/", ".")[:-3]) for x in model_files]


TokenAdmin.raw_id_fields = ['user']


for model in apps.get_app_config('GBEX_app').get_models():
	if model.__name__ != "PlasmidBatch":
		modeladmin = type(f"{model.__name__}Admin", (CompareVersionAdmin,), {})
		admin.site.register(model, modeladmin)


from .models.Inventory import PlasmidBatch
from django.contrib.contenttypes.admin import GenericTabularInline
from GBEX_storage.models import Vial
from django import forms

class GIMPform(forms.ModelForm):
	class Meta:
		model = Vial
		fields = '__all__'

class GIMP(GenericTabularInline):
	model = Vial

@admin.register(PlasmidBatch)
class Test(CompareVersionAdmin):
	inlines = [GIMP]
	form = GIMPform
