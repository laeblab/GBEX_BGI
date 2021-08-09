import React, {useState} from 'react';
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

const box_sizes: {[key: string]: {rows: number, columns: number}} = {
    '1': {rows: 3, columns: 3},
    '2': {rows: 9, columns: 9},
    '3': {rows: 8, columns: 12},
}

const mytree = {
    id: 'root',
    name: 'Rum931',
    children: [
        {
            id: '1',
            name: 'løs box',
        },
        {
            id: 'fre4',
            name: 'Fryser -80',
            children: [
                {
                    id: '2',
                    name: 'Box 1',
                },
                {
                    id: '3',
                    name: 'Box CHO',
                },
            ],
        },
    ],
}

export default function App() {
    const { observe, width, height } = useDimensions()
    const [boxsize, setBoxsize] = useState({columns: 9, rows: 9});

    const handleSelect = (event: React.ChangeEvent<{}>, nodeIds: string) => {
        console.log(event)
        if (nodeIds in box_sizes) {
            setBoxsize(box_sizes[nodeIds])
        }
    };
    return (
        <Box display="flex" flexDirection="column" style={classes.root}>
            <div id="storage_top" style={classes.top}>
                header
            </div>
            <Box display="flex" flexGrow={1} id="storage_bottom">
                <div id="storage_tree">
                    <TheTree a_func={handleSelect} tree_data={mytree}/>
                </div>
                <div id="storage_box" ref={observe}>
                    <TheBox columns={boxsize.columns} rows={boxsize.rows} height={height} width={width}/>
                </div>
                <Box id="storage_well" flexGrow={1} style={classes.well}>
                    Some content
                </Box>
            </Box>
        </Box>
    )
}
