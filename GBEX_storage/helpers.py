def pos_to_coord(box_row: int, box_columns: int) -> str:
	return f"{chr(ord('A')+box_row)}{box_columns+1}"
