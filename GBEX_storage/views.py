from django.views.generic import TemplateView
from .models import Location, Box, Vial


def create_location_tree(parent_loc=None):
	tree = []
	for loc in Location.objects.filter(parent_loc=parent_loc):
		children = [
			*[{"id": box.id, "name": box.name} for box in Box.objects.filter(location=loc)],
			*create_location_tree(loc)
		]
		tree.append({"id": loc.id, "name": loc.name, "children": children})
	return tree


class StorageIndex(TemplateView):
	template_name = 'GBEX_storage/index.html'

	def get_context_data(self, **kwargs):
		context = super().get_context_data(**kwargs)

		# 1. Lav et "tree of locations".
		# 2. Gennemgå disse locations 1 by 1 og tilføj Box'es til deres children.
		# 3. Lav en liste af boxes (kaldet box_info) som er en liste af boxes med id, deres dimensions og internt til hvre box, en liste af labels på de vials der er der i.

		context['my_tree'] = create_location_tree()
		context['box_info'] = {box.id: {"content": [x for x in range(box.rows*box.columns)], "size": {"rows": box.rows, "columns": box.columns}} for box in Box.objects.all()}
		return context

"""
    id: 'root',
    name: 'Rum931',
    children: [
    	{id: '1', name: 'løs box',},
        {id: 'fre4', name: 'Fryser -80', children: [
                { id: '2', name: 'Box 1',},
                { id: '3', name: 'Box CHO',},],},
    ],
    
    const box_info: {[key: string]: {content: number[], size: {rows: number, columns: number}}} = {
    '1': {content: [...Array(3*3).keys()], size: {rows: 3, columns: 3}},
    '2': {content: [...Array(9*9).keys()], size: {rows: 9, columns: 9}},
    '3': {content: [...Array(8*12).keys()], size: {rows: 8, columns: 12}},
"""