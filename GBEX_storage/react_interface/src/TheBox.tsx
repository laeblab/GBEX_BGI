import React from 'react';
import Box from '@material-ui/core/Box';

const classes = {
		box_root: {
		},
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

export default function TheBox(props: {columns: number, rows: number, height: number, width: number}) {
	const {columns, rows, height, width} = props
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
		<div style={classes.box_root}>
			{[...Array(rows)].map((e, i) => {
				return (
					<Box display="flex" flexGrow={1} key={i}>
						{[...Array(columns)].map((ee, ii) => {
							return <div style={Object.assign({}, classes.wells, square_size)} key={ii}>{i}, {ii} {square_size.width} {width}</div>})
						}
					</Box>)
			})}
		</div>
	);
}
