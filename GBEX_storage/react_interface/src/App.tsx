import React from 'react';
import Box from '@material-ui/core/Box';
import TheTree from './TheTree';
import TheBox from './TheBox'
import useDimensions from "react-cool-dimensions";


const classes = {
        root: {
            height: "100%"
        },
        top: {
            height: "100px",
            backgroundColor: 'red'

        },
        well: {
            backgroundColor: 'salmon',
            overflow: "auto",
        },
        paper: {
            padding: 5,
            height: "100%"
        },
}

export default function App() {
    const mytree = {
        rum1: {
            fryser1: "hallo",
            fryser2: {
                rack1: "ra1",
                rack2: "ra2"
            }
        },
        rum2: {
            fryser3: "hihi"
        }
    }
    const { observe, width, height } = useDimensions()

    return (
        <Box display="flex" flexDirection="column" style={classes.root}>
            <div id="storage_top" style={classes.top}>
                header
            </div>
            <Box display="flex" flexGrow={1} id="storage_bottom">
                <div id="storage_tree">
                    <TheTree tree_data={mytree}/>
                </div>
                <div id="storage_box" ref={observe}>
                    <TheBox columns={4} rows={4} height={height} width={width}/>
                </div>
                <Box id="storage_well" flexGrow={1} style={classes.well}>
                    Some content
                </Box>
            </Box>
        </Box>
    )
}
