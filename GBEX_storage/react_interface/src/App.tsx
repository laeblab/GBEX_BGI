import React, {useState} from 'react';
import Box from '@material-ui/core/Box';
import TheTree from './TheTree';
import TheBox from './TheBox'
import useDimensions from "react-cool-dimensions";


declare global {
    interface Window {
        box_info: {[key: string]: {content: number[], size: {rows: number, columns: number}}},
        my_tree: {id: string, name: string, children: any}[],
    }
}


const classes = {
    root: { height: "100%" },
    top: { height: "100px", backgroundColor: 'red' },
    well: { backgroundColor: 'salmon', overflow: "auto", },
    paper: { padding: 5, height: "100%" },
}


export default function App() {
    const { observe, width, height } = useDimensions()
    const [box, setBox] = useState({id: "", content: [0], size: {rows: 1, columns: 1}});
    const [well, setWell] = useState(-1)
    const [wellText, setWellText] = useState("Select a well to see info")

    const handleTreeSelect = (event: React.ChangeEvent<{}>, nodeIds: string) => {
        if (nodeIds in window.box_info) {
            setBox({id: nodeIds, ...window.box_info[nodeIds]})
            setWell(-1)
        }
    }

    const handleWellSelect = (well_id: number) => {
        setWell(well_id)

        fetch("vial_info/"+box.id+"/"+well_id, { credentials: 'include' })
            .then(response => response.json())
            .then(res => setWellText(res.data))
            .catch(error => console.log(error))
    }

    return (
        <Box display="flex" flexDirection="column" style={classes.root}>
            <div id="storage_top" style={classes.top}>
                header
            </div>
            <Box display="flex" flexGrow={1} id="storage_bottom">
                <div id="storage_tree">
                    <TheTree BoxSelectFunc={handleTreeSelect} tree_data={window.my_tree}/>
                </div>
                <div id="storage_box" ref={observe}>
                    <TheBox selected_well={well} WellSelectFunc={handleWellSelect} box_info={box} height={height} width={width}/>
                </div>
                <Box id="storage_well" flexGrow={1} style={classes.well}>
                    {wellText}{well+1}
                </Box>
            </Box>
        </Box>
    )
}
