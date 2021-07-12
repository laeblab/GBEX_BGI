import React, { useState, createRef, useEffect } from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		box_root: {
		},
		wells: {
			textAlign: 'center',
			backgroundColor: 'white',
			borderStyle: 'solid',
			borderColor: 'black',
			borderWidth: '1px',
		},
	}),
);

export default function TheBox(props: {columns: number, rows: number}) {
	const {columns, rows} = props
	const classes = useStyles();
	const divRef: React.RefObject<HTMLDivElement> = createRef()
	const [dimensions, setDimensions] = useState({width: 1, height: 2})
	useEffect(() => {
		if (divRef.current) {
			const {current} = divRef
			const boundingRect = current.getBoundingClientRect()
			const {width, height} = boundingRect
			setDimensions({width: Math.round(width), height: Math.round(height)})
		}
	}, [divRef])

	const square_size = {
		height: dimensions.width / columns,
		width: dimensions.width / columns
	}

	return (
		<div ref={divRef} className={classes.box_root}>
			{[...Array(rows)].map((e, i) => {
				return (
					<Box display="flex" flexGrow={1} key={i}>
						{[...Array(columns)].map((ee, ii) => {
							return <Box className={classes.wells} style={square_size} key={ii}>{i}, {ii} {dimensions.width}</Box>})
						}
					</Box>)
			})}
		</div>
	);
}
