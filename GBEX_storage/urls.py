from django.urls import path
from django.views.generic import TemplateView
from django.views.generic.edit import UpdateView
from .views import vial_info, get_locs_and_boxes, GBEXStorageUpdateView
from .models import Location, Box, Vial


urlpatterns = [
    path('', TemplateView.as_view(template_name='GBEX_storage/index.html'), name='StorageIndex'),
    path('vial_info/<box_index>/<vial_index>', vial_info, name='vial_info'),
    path('locsNboxs', get_locs_and_boxes, name='loc_box'),

    path('editLocation/<pk>', GBEXStorageUpdateView.as_view(model=Location), name='edit_loc'),
    path('editBox/<pk>', GBEXStorageUpdateView.as_view(model=Box), name='edit_box'),
    path('editVial/<pk>', GBEXStorageUpdateView.as_view(model=Vial), name='edit_vial'),
]
