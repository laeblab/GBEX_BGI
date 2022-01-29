from django.http import JsonResponse
from GBEX_app.helpers import field_to_string
from .helpers import create_location_tree
from .models import Vial


def get_locs_and_boxes(request):
	return JsonResponse({
		'tree': create_location_tree(),
		'vial_models': [{
			'model': x.related_model.__name__,
			'field': x.get_accessor_name()} for x in Vial._meta.get_fields() if x.many_to_many]
	})


def get_vial_and_maybe_parent(request, id):
	# 1 : Get vial object
	# 2 : Get content list (many_to_many fields). -> dict with querysets
	# 3 : For each item in the content list, convert to display object
	# 4 : Check if a Parent field exists on content item and if so, replace its value with a display object for the parent
	# 5 : If parent exists, then find potential reverse field on parent and hide that

	# 1
	vial_obj = Vial.objects.get(id=id)
	# 2
	content_list = {x.get_accessor_name(): getattr(vial_obj, x.get_accessor_name()).all() for x in vial_obj._meta.get_fields() if x.many_to_many}
	# 3
	content_object = {}
	nono_names = ["id", "url", "created", "edited", "archived", "Location"]  # dont want to display these
	for content_type, content_set in content_list.items():
		if content_set:
			content_object[content_type] = []
			for content_item in content_set:
				# 3
				con = {}
				for field in content_item._meta.get_fields():
					if not hasattr(field, "get_accessor_name"):
						if field.name not in nono_names:
							if field.name == "Parent":
								parent_con = {}
								for parent_field in content_item.Parent._meta.get_fields():
									if not hasattr(parent_field, "get_accessor_name"):
										if parent_field.name not in nono_names:
											value = field_to_string(content_item.Parent, parent_field.name)
											if value:
												parent_con[parent_field.name] = value
								con[field.name] = parent_con
							else:
								value = field_to_string(content_item, field.name)
								if value:
									con[field.name] = value
				content_object[content_type].append(con)

	return JsonResponse({
		"label": vial_obj.label,
		"description": vial_obj.description,
		"content": content_object
	})
