from django.urls import path
from django.views.generic import TemplateView
from .views import get_locs_and_boxes


urlpatterns = [
    path('', TemplateView.as_view(template_name='GBEX_storage/index.html'), name='StorageIndex'),
    #path('vial_info/<box_index>/<vial_index>', vial_info, name='vial_info'),
    path('locsNboxs', get_locs_and_boxes, name='loc_box'),
]
