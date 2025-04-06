from django.urls import path
from django.views.generic import TemplateView
from GBEX_eln.views import get_filetree_json

urlpatterns = [
    path('', TemplateView.as_view(template_name='GBEX_eln/index.html'), name='ElnIndex'),
    path('filetree', get_filetree_json, name='filetree'),
]