from GBEX_storage.models import Box, Vial, Location


def pos_to_coord(box_row: int, box_columns: int) -> str:
	return f"{chr(ord('A')+box_row)}{box_columns+1}"


def create_location_tree(parent_loc=None):
	# first get all boxes
	box_info = {}
	# Her skal du ændre ændre content til at vise koordinat (A1, H6, etc) + navne på linkede vial objects
	for box in Box.objects.prefetch_related("vial_set").all():
		# take a moment here to unlink vials that no longer fit in the box after a box resize
		Vial.objects.filter(parent=box, box_column__gte=box.columns).delete()
		Vial.objects.filter(parent=box, box_row__gte=box.rows).delete()
		box_info[box.id] = [
			{
				'label': x["label"],
				'id': x["id"],
				'description': x['description'],
				'box_row': x['box_row'],
				'box_column': x['box_column'],
			} for x in box.vial_set.all().values("id", "label", "box_row", "box_column", "description")
		]

	tree = []
	for loc in Location.objects.filter(parent=parent_loc):
		children = [*[{"key": f"box_{box.id}", "label": str(box.name), "icon": "pi pi-table", "droppable": False,
					   "leaf": True, "data": {'id': f"box_{box.id}", 'rows': box.rows, 'columns': box.columns,
						'vials': box_info[box.id]}} for box in Box.objects.filter(parent=loc)],
			*create_location_tree(loc)
		]
		tree.append({"key": f"loc_{loc.id}", "label": str(loc.name), "icon": "pi pi-building", "children": children})
	return tree


def location_labeling(item):
	location_dict = {}
	for vial in item.Location.all():
		loc = vial.parent.parent
		box = vial.parent
		coord = (vial.box_row, vial.box_column)
		if str(loc) in location_dict:
			if str(box) in location_dict[str(loc)]:
				location_dict[str(loc)][str(box)].append(coord)
			else:
				location_dict[str(loc)] = {str(box): [coord]}
		else:
			location_dict[str(loc)] = {str(box): [coord]}
	return ", ".join([f"{loc}: {box}: {', '.join([pos_to_coord(*pos) for pos in poss])}" for loc, boxes in location_dict.items() for box, poss in boxes.items()])
