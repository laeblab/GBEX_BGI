import React from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		box_root: {
			height: "100%"
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
	const { columns, rows } = props
	const classes = useStyles();

	return (
		<Box className={classes.box_root} display="flex" flexGrow={1} flexDirection="column">
			{[...Array(columns)].map((e, i) => {
				return (
					<Box display="flex" flexGrow={1} key={i}>
						{[...Array(rows)].map((ee, ii) => {
							return <Box className={classes.wells} flexGrow={1} key={ii}>{i}, {ii}</Box>})
						}
					</Box>)
			})}
		</Box>
	);
}
