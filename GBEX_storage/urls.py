from django.urls import path
from django.views.generic import TemplateView
from .views import get_locs_and_boxes, get_vial_and_maybe_parent


urlpatterns = [
    path('', TemplateView.as_view(template_name='GBEX_storage/index.html'), name='StorageIndex'),
    path('locsNboxs', get_locs_and_boxes, name='loc_box'),
    path('displayVial/<int:id>', get_vial_and_maybe_parent, name='vial_disp'),
]
