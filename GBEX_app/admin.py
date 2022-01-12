from django.contrib import admin
from django.contrib.contenttypes.fields import GenericRelation
from reversion_compare.admin import CompareVersionAdmin
from rest_framework.authtoken.admin import TokenAdmin
from django.apps import apps
from glob import glob
from importlib import import_module

# needed for integration with GBEX_storage to link Vial
from GBEX_storage.models import Vial
from django.contrib.contenttypes.admin import GenericTabularInline
from django import forms


class VialForm(forms.ModelForm):
	class Meta:
		model = Vial
		fields = '__all__'


class InlineVial(GenericTabularInline):
	model = Vial


TokenAdmin.raw_id_fields = ['user']
model_files = glob("GBEX_app/models/*.py")
model_files.remove("GBEX_app/models/__init__.py")
model_modules = [import_module(x.replace("/", ".")[:-3]) for x in model_files]


for model in apps.get_app_config('GBEX_app').get_models():
	# check for generic relationships to the Vial model from GBEX_storage
	add_vial_inline = {}
	if any([gen for gen in model._meta.get_fields() if isinstance(gen, GenericRelation) and gen.related_model is Vial]):
		add_vial_inline = {"inlines": [InlineVial], "form": VialForm}

	modeladmin = type(f"{model.__name__}Admin", (CompareVersionAdmin,), {**add_vial_inline})
	admin.site.register(model, modeladmin)
