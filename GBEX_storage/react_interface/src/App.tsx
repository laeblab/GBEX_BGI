import React from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import TheTree from './TheTree';
import TheBox from './TheBox'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            height: "100%"
        },
        top: {
            height: "100px",
            backgroundColor: 'red'

        },
        bottom: {
        },
        tree: {
            width: "25%",
            backgroundColor: 'green',
            overflow: "auto",
            resize: "horizontal"
        },
        box: {
            width: "50%",
            backgroundColor: 'blue',
            overflow: "auto",
            resize: "horizontal"
        },
        well: {
            backgroundColor: 'salmon',
            overflow: "auto",
        },
        paper: {
            padding: theme.spacing(1),
            textAlign: 'center',
            color: theme.palette.text.secondary,
            height: "100%"
        },
    }),
);

export default function App() {
    const classes = useStyles();
    return (
        <Box display="flex" flexDirection="column" className={classes.root}>
            <Box id="storage_top" className={classes.top}>
                header
            </Box>
            <Box display="flex" flexGrow={1} id="storage_bottom" className={classes.bottom}>
                <Box id="storage_tree" className={classes.tree}>
                    <TheTree/>
                </Box>
                <Box id="storage_box" className={classes.box}>
                    <TheBox columns={4} rows={3}/>
                </Box>
                <Box id="storage_well" flexGrow={1} className={classes.well}>
                    Some content
                </Box>
            </Box>
        </Box>
    )
}
