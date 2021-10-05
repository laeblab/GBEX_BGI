from django.http import JsonResponse
from django.views.generic import TemplateView
from .models import Location, Box, Vial
from GBEX_app.helpers import model_to_list_list


def create_location_tree(parent_loc=None):
	tree = []
	for loc in Location.objects.filter(parent_loc=parent_loc):
		children = [
			*[{"id": box.id, "name": box.name} for box in Box.objects.filter(location=loc)],
			*create_location_tree(loc)
		]
		tree.append({"id": f"loc{loc.id}", "name": loc.name, "children": children})
	return tree


def vial_info(request, box_index, vial_index):
	v = Vial.objects.filter(box=box_index, pos_index=vial_index)
	if v:
		p = v[0].content_object
		return JsonResponse({a:b for (a,b) in zip(p.order, model_to_list_list(p._meta.model.objects.filter(id=p.id))[0])})
	else:
		return JsonResponse({'No vial': ""})


class StorageIndex(TemplateView):
	template_name = 'GBEX_storage/index.html'

	def get_context_data(self, **kwargs):
		context = super().get_context_data(**kwargs)

		# 1. Lav et "tree of locations".
		# 2. Gennemgå disse locations 1 by 1 og tilføj Box'es til deres children.
		# 3. Lav en liste af boxes (kaldet box_info) som er en liste af boxes med id, deres dimensions og internt til hvre box, en liste af labels på de vials der er der i.

		context['my_tree'] = create_location_tree()

		# Her skal du ændre ændre content til at vise koordinat (A1, H6, etc) + navne på linkede vial objects
		context['box_info'] = {}
		for box in Box.objects.prefetch_related("vial_set").all():
			size = {"rows": box.rows, "columns": box.columns}
			vials = {x["pos_index"]: x["name"] for x in box.vial_set.all().values("name", "pos_index")}
			content = [vials[x] if x in vials else x+1 for x in range(box.rows * box.columns)]
			context['box_info'][box.id] = {"size": size, "content": content}
		return context
