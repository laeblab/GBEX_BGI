from django.views.generic import TemplateView
from .models import Location, Box, Vial


class StorageIndex(TemplateView):
	template_name = 'GBEX_storage/index.html'

	def get_context_data(self, **kwargs):
		context = super().get_context_data(**kwargs)

		# 1. Lav et "tree of locations".
		# 2. Gennemgå disse locations 1 by 1 og tilføj Box'es til deres children.
		# 3. Lav en liste af boxes (kaldet box_info) som er en liste af boxes med id, deres dimensions og internt til hvre box, en liste af labels på de vials der er der i.
		locs = Location.objects.all()

		context['stuff'] = "stuff stuff"
		return context

"""
{
    id: 'root',
    name: 'Rum931',
    children: [
    	{id: '1', name: 'løs box',},
        {id: 'fre4', name: 'Fryser -80', children: [
                { id: '2', name: 'Box 1',},
                { id: '3', name: 'Box CHO',},],},
    ],
}"""