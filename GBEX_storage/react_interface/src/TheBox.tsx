import React, { Dispatch, SetStateAction } from 'react';
import {Vials, Box} from "./App"

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

export default function TheBox(props: {selected_well: Vials|undefined, set_selected_well: Dispatch<SetStateAction<Vials|undefined>>, box_info: Box, height: number, width: number}) {
	const {box_info, height, width} = props
	const limw = width/box_info.columns
	const limh = height/box_info.rows
	let square_size = {
		height: width / box_info.columns,
		width: width / box_info.columns
	}
	if (limh < limw) {
		square_size = {
			height: height / box_info.rows,
			width: height / box_info.rows
		}
	}

	return (
		<div>
			{[...Array(box_info.rows)].map((e, row) => {
				return (
					<div style={{display: "flex", flexGrow: 1}} key={row}>
						{[...Array(box_info.columns)].map((ee, column) => {
							const coord = String.fromCharCode('A'.charCodeAt(0)+row)+(column+1)
							let well_style = {backgroundColor: "white"}
							let a = {id:-1, name:coord}
							if (box_info.vials.hasOwnProperty(coord)) {
								a = box_info.vials[coord]
								well_style = {backgroundColor: "limegreen"}
							}
							if (props.selected_well !== undefined && props.selected_well.hasOwnProperty(coord)) {
								well_style = {backgroundColor: "red"}
							}

							return <div
								onClick={() => props.set_selected_well({[coord]: a})}
								style={Object.assign({}, classes.wells, square_size, well_style)}
								key={column}>
								{a.name}
							</div>})
						}
					</div>)
			})}
		</div>
	);
}
