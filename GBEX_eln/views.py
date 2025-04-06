from django.http import JsonResponse
from GBEX_eln.models import Folder, ELNPage

def get_file_tree(parent_folder=None):
	tree = []
	for folder in Folder.objects.filter(parent=parent_folder):
		children = [
			*[# first add all the eln pages that are direct children of this folder
				{
					"key": f"elnpage_{elnpage.id}",
					"label": str(elnpage.name),
					"icon": "pi pi-table",
					"droppable": False,
					"leaf": True,
					"data": {}
				} for elnpage in ELNPage.objects.filter(parent=folder)],
			# then add any folders that may be children of this folder
			*get_file_tree(folder)
			]
		# finally add the roots to the tree
		tree.append({"key": f"folder_{folder.id}", "label": str(folder.name), "icon": "pi pi-building", "children": children, "leaf": False})
	return tree


def get_filetree_json(request):
	return JsonResponse({
		'tree': get_file_tree(),
	})
