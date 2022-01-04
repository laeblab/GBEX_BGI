import React, { Dispatch, SetStateAction } from 'react';
import {Vial, Box} from "./App"

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

export default function TheBox(props: {selected_well: Vial, set_selected_well: Dispatch<SetStateAction<Vial>>, box_info: Box, height: number, width: number}) {
	const {box_info, height, width} = props
	let limw = width/box_info.columns
	let limh = height/box_info.rows
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
			{[...Array(box_info.rows)].map((e, i) => {
				return (
					<div style={{display: "flex", flexGrow: 1}} key={i}>
						{[...Array(box_info.columns)].map((ee, ii) => {
							let well_style = {backgroundColor: "white"}
							if (i*box_info.columns+ii === props.selected_well.pos) {
								well_style = {backgroundColor: "red"}
							}
							return <div
								onClick={() => props.set_selected_well({pos: i*box_info.columns+ii, ...box_info.vials[i*box_info.columns+ii]})}
								style={Object.assign({}, classes.wells, square_size, well_style)}
								key={ii}>
								{box_info.vials[i*box_info.columns+ii].name}
							</div>})
						}
					</div>)
			})}
		</div>
	);
}
