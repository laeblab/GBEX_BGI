from django.http import JsonResponse
from .models import Location, Box, Vial
from GBEX_app.helpers import model_to_list_list


def create_location_tree(parent_loc=None):
	# first get all boxes
	box_info = {}
	# Her skal du ændre ændre content til at vise koordinat (A1, H6, etc) + navne på linkede vial objects
	for box in Box.objects.prefetch_related("vial_set").all():
		# take a moment here to unlink vials that no longer fit in the box after a box resize
		Vial.objects.filter(parent=box, pos_index__gt=box.rows * box.columns).update(parent=None)
		vials = {x["pos_index"]: {'name': x["name"], 'id': x["id"]} for x in box.vial_set.all().values("id", "name", "pos_index")}
		content = [vials[x] if x in vials else {'name': x + 1, 'id': -1} for x in range(box.rows * box.columns)]
		box_info[box.id] = content

	tree = []
	for loc in Location.objects.filter(parent=parent_loc):
		children = [
			*[{"key": box.id, "label": box.name, "icon": "pi pi-table", "droppable": False, "leaf": True, "data": {'rows': box.rows, 'columns': box.columns, 'vials': box_info[box.id]}} for box in Box.objects.filter(parent=loc)],
			*create_location_tree(loc)
		]
		tree.append({"key": f"loc_{loc.id}", "label": loc.name, "icon": "pi pi-building", "children": children})
	return tree


#def vial_info(request, box_index, vial_index):
#	v = Vial.objects.filter(box=box_index, pos_index=vial_index)
#	if v:
#		p = v[0].content_object
#		return JsonResponse({a: b for (a, b) in zip(p.order, model_to_list_list(p._meta.model.objects.filter(id=p.id))[0])})
#	else:
#		return JsonResponse({'No vial': ""})


def get_locs_and_boxes(request):
	return JsonResponse({'tree': create_location_tree()})
