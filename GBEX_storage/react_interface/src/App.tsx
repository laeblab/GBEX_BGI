import React, {useEffect, useState} from 'react';
import Box from '@material-ui/core/Box';
import TheTree from './TheTree';
import TheBox from './TheBox'
import useDimensions from "react-cool-dimensions";


declare global {
    interface Window {
        box_info: {[key: string]: {content: string[], size: {rows: number, columns: number}}},
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
    const [box, setBox] = useState({id: "", content: [""], size: {rows: 1, columns: 1}});

    const [well, setWell] = useState(-1)
    const [wellText, setWellText] = useState({})
    useEffect(() => {
        if (box.id) {
            fetch("vial_info/"+box.id+"/"+well, { credentials: 'include' })
                .then(response => response.json())
                .then(json => setWellText(json))
                .catch(error => console.log(error))
        }
    }, [well, box.id]);

    const handleTreeSelect = (event: React.ChangeEvent<{}>, nodeIds: string) => {
        if (nodeIds in window.box_info) {
            setBox({id: nodeIds, ...window.box_info[nodeIds]})
            setWell(-1)
        }
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
                    <TheBox selected_well={well} WellSelectFunc={setWell} box_info={box} height={height} width={width}/>
                </div>
                <Box id="storage_well" flexGrow={1} style={classes.well}>
                    <ul>
                        {
                            Object.entries(wellText).map(
                                ([val_name,value],i) => <li key={i}>{val_name}: {value}</li>
                            )
                        }
                    </ul>
                </Box>
            </Box>
        </Box>
    )
}
