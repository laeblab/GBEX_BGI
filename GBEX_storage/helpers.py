from GBEX_storage.models import Box, Vial, Location


def pos_to_coord(box_row: int, box_columns: int) -> str:
	return f"{chr(ord('A')+box_row)}{box_columns+1}"


def create_location_tree(parent_loc=None):
	# first get all boxes
	box_info = {}
	box_usage = {}
	# Her skal du ændre ændre content til at vise koordinat (A1, H6, etc) + navne på linkede vial objects
	for box in Box.objects.filter(parent__parent=parent_loc).prefetch_related("vial_set").all():
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
		box_usage[box.id] = f"[{box.vial_set.count()}/{box.rows*box.columns}]"

	tree = []
	for loc in Location.objects.filter(parent=parent_loc):
		children = [*[{"key": f"box_{box.id}", "label": str(box.name), "icon": "pi pi-table", "droppable": False,
					   "leaf": True, "data": {'id': f"box_{box.id}", 'rows': box.rows, 'columns': box.columns,
											  'vials': box_info[box.id], "usage": box_usage[box.id]
											  }} for box in Box.objects.filter(parent=loc)],
					*create_location_tree(loc)
		]
		tree.append({"key": f"loc_{loc.id}", "label": str(loc.name), "icon": "pi pi-building", "children": children})
	return tree


def longest_consecutive_streak(arr):
	longest = 0
	i = 0
	arr = sorted(arr)
	while i < len(arr)-1:
		print("i", i)
		if (arr[i] - 1) not in arr:  # first in streak
			streak_start = i
			print("streak start", i)
			while arr[i]+1 in arr:
				i += 1
			i += 1
			print("streak end", i)
			longest = max(longest, i - streak_start)
			print("longest", longest)
			print("i < len", i<len(arr))
	return longest


def location_labeling(item):
	vials = item.Location.all().values_list("box_row", "box_column", "parent")
	boxes = {b_id: [] for b_id in set([vial[2] for vial in vials])}
	labels = []
	for vial in vials:
		boxes[vial[2]].append(vial[:2])
	for box, box_vials in boxes.items():
		# find parent location lineage
		heritage = [Box.objects.get(id=box)]
		while heritage[-1].parent is not None:
			heritage.append(heritage[-1].parent)
		heritage = ">".join([str(x) for x in heritage[::-1]])

		# figure out if its most optimal to group by col (A1-D1) or row (A1-4)
		rows = {r_id: [] for r_id in set([vial[0] for vial in box_vials])}
		columns = {c_id: [] for c_id in set([vial[1] for vial in box_vials])}
		for vial in box_vials:
			rows[vial[0]].append(vial[1])
			columns[vial[1]].append(vial[0])
		# find the longest consecutive streak in rows
		rows_values = sorted(rows.values(), key=len, reverse=True)
		lcs_row = 0
		for row_data in rows_values:
			if len(row_data) > lcs_row:  # any chance of beating previous row?
				lcs_row = longest_consecutive_streak(row_data)
			else:
				break
		# find the longest consecutive streak in columns
		column_values = sorted(columns.values(), key=len, reverse=True)
		lcs_col = 0
		for col_data in column_values:
			if len(col_data) > lcs_col:  # any chance of beating previous col?
				lcs_col = longest_consecutive_streak(col_data)
			else:
				break
		well_labels = []
		if lcs_row >= lcs_col:  # favor row grouping (A1-4) over col grouping (A1-D1)
			for row_i, col_is in rows.items():
				label = pos_to_coord(row_i, col_is[0])
				# figure out how far this streak goes
				well_labels.append(label)
		else:
			for col_i, row_is in columns.items():
				pass
		labels.append(f"{heritage}:{', '.join(well_labels)}")

	"""
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
	"""
	return "<br>".join(labels)
