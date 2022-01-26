from django.http import JsonResponse
from .helpers import create_location_tree
from .models import Vial


def get_locs_and_boxes(request):
	return JsonResponse({
		'tree': create_location_tree(),
		'vial_models': [{
			'model': x.related_model.__name__,
			'field': x.get_accessor_name()} for x in Vial._meta.get_fields() if x.many_to_many]
	})
