from django.http import JsonResponse
from .models import Location, Box, Vial
from GBEX_app.helpers import model_to_list_list


def create_location_tree(parent_loc=None):
	tree = []
	for loc in Location.objects.filter(parent_loc=parent_loc):
		children = [
			*[{"id": box.id, "name": box.name} for box in Box.objects.filter(location=loc)],
			*create_location_tree(loc)
		]
		tree.append({"id": f"loc_{loc.id}", "name": loc.name, "children": children})
	return tree


def create_box_info():
	# 2. Gennemgå locations 1 by 1 og tilføj Box'es til deres children.
	# 3. Lav en liste af boxes (kaldet box_info) som er en liste af boxes med id, deres dimensions og internt til hvre box, en liste af labels på de vials der er der i.
	box_info = {}
	# Her skal du ændre ændre content til at vise koordinat (A1, H6, etc) + navne på linkede vial objects
	for box in Box.objects.prefetch_related("vial_set").all():
		size = {"rows": box.rows, "columns": box.columns}
		# take a moment here to unlink vials that no longer fit in the box after a box resize
		Vial.objects.filter(box=box, pos_index__gt=box.rows * box.columns).update(box=None)
		vials = {x["pos_index"]: {'name': x["name"], 'id': x["id"]} for x in box.vial_set.all().values("id", "name", "pos_index")}
		content = [vials[x] if x in vials else {'name': x + 1, 'id': -1} for x in range(box.rows * box.columns)]
		box_info[box.id] = {"size": size, "content": content}
	return box_info


#def vial_info(request, box_index, vial_index):
#	v = Vial.objects.filter(box=box_index, pos_index=vial_index)
#	if v:
#		p = v[0].content_object
#		return JsonResponse({a: b for (a, b) in zip(p.order, model_to_list_list(p._meta.model.objects.filter(id=p.id))[0])})
#	else:
#		return JsonResponse({'No vial': ""})


def get_locs_and_boxes(request):
	if 'Newstuff' in request.headers:
		parts = request.headers['Newstuff'].split("_")  # should be [loc/box, id, NewLocation/NewBox]
		if parts[-1] == 'newLocation':
			parent = parts[-2]
			if parent == 'root':
				parent = None
			Location.objects.create(name="NewLoc", parent_loc_id=parent)
		elif parts[-1] == "newBox":
			Box.objects.create(name="NewBox", location_id=parts[-2], rows=10, columns=10)
	context = {'my_tree': create_location_tree(), 'box_info': create_box_info()}
	return JsonResponse(context)
