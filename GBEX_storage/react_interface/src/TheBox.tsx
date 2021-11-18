import React from 'react';

const classes = {
		wells: {
			TextAlign: 'center',
			backgroundColor: 'white',
			borderStyle: 'solid',
			borderColor: 'black',
			borderWidth: '1px',
			minWidth: '50px',
			minHeight: '50px'
		},
}

export default function TheBox(props: {selected_well: number, WellSelectFunc: (well_id: number) => void, box_info: {content: { name:string, id:number }[], size: {rows: number, columns: number}}, height: number, width: number}) {
	const {box_info, height, width} = props
	const {rows, columns} = box_info['size']

	let limw = width/columns
	let limh = height/rows

	let square_size = {
		height: width / columns,
		width: width / columns
	}
	if (limh < limw) {
		square_size = {
			height: height / rows,
			width: height / rows
		}
	}

	return (
		<div>
			{[...Array(rows)].map((e, i) => {
				return (
					<div style={{display: "flex", flexGrow: 1}} key={i}>
						{[...Array(columns)].map((ee, ii) => {
							let well_style = {backgroundColor: "white"}
							if (i*columns+ii === props.selected_well) {
								well_style = {backgroundColor: "red"}
							}
							return <div
								onClick={() => props.WellSelectFunc(i*columns+ii)}
								style={Object.assign({}, classes.wells, square_size, well_style)}
								key={ii}>
								{box_info['content'][i*columns+ii].name}
							</div>})
						}
					</div>)
			})}
		</div>
	);
}
