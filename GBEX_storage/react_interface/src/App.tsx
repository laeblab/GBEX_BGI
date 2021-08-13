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

const box_info: {[key: string]: {content: number[], size: {rows: number, columns: number}}} = {
    '1': {content: [...Array(3*3).keys()], size: {rows: 3, columns: 3}},
    '2': {content: [...Array(9*9).keys()], size: {rows: 9, columns: 9}},
    '3': {content: [...Array(8*12).keys()], size: {rows: 8, columns: 12}},
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
    const [box, setBox] = useState({content: [0], size: {rows: 1, columns: 1}});
    const [well, setWell] = useState(0)

    const handleTreeSelect = (event: React.ChangeEvent<{}>, nodeIds: string) => {
        if (nodeIds in box_info) {
            setBox(box_info[nodeIds])
        }
    };
    const handleWellSelect = (well_id: number) => {
        setWell(well_id)
    }
    return (
        <Box display="flex" flexDirection="column" style={classes.root}>
            <div id="storage_top" style={classes.top}>
                header
            </div>
            <Box display="flex" flexGrow={1} id="storage_bottom">
                <div id="storage_tree">
                    <TheTree BoxSelectFunc={handleTreeSelect} tree_data={mytree}/>
                </div>
                <div id="storage_box" ref={observe}>
                    <TheBox selected_well={well} WellSelectFunc={handleWellSelect} box_info={box} height={height} width={width}/>
                </div>
                <Box id="storage_well" flexGrow={1} style={classes.well}>
                    {well+1}
                </Box>
            </Box>
        </Box>
    )
}
