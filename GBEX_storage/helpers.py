def pos_to_coord(pos: int, cols: int) -> str:
	return f"{chr(ord('A')+int(pos/cols))}{pos%cols+1}"
