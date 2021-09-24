from django.urls import path

from .views import StorageIndex, vial_info

urlpatterns = [
    path('', StorageIndex.as_view(), name='StorageIndex'),
    path('vial_info/<box_index>/<vial_index>', vial_info, name='vial_info'),
]
