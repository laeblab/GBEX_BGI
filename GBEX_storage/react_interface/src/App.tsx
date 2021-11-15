import React, {useEffect, useState} from 'react'
import Box from '@mui/material/Box';
import TheTree from './TheTree'
import TheBox from './TheBox'
import TheEditor from './TheEditor'
import useDimensions from "react-cool-dimensions"


export type TreeType = {id: string, name: string, children: any}
export type BoxInfoType = {[key: string]: {content: string[], size: {rows: number, columns: number}}}

const classes = {
    root: { height: "100%" },
    top: { height: "100px", backgroundColor: 'red' },
    well: { backgroundColor: 'salmon', overflow: "auto", },
    paper: { padding: 5, height: "100%" },
}


export default function App() {
    const { observe, width, height } = useDimensions()
    const [box, setBox] = useState({id: "", content: [""], size: {rows: 1, columns: 1}}); // box contain information about the currently selected box
    const [selectedItem, setSelectedItem] = useState({type:'loc', pk:"1"}) // the right panel shows an update form based on this
    // box_info is a dict that contains all box names + size + names of vials
    const [box_info, setBoxInfo] = useState<BoxInfoType>({"box1": {content: ["hello", "you"], size: {rows: 1, columns: 1}}, "box2": {content: ["hello", "you"], size: {rows: 1, columns: 1}}})
    // my_tree contains a hierarchy of locations and boxes
    const [my_tree, setMyTree] = useState<TreeType[]>([{id: "root_loc", name: "root loc", children: []}]);
    useEffect(() => {
        fetch("locsNboxs", {credentials: 'include'})
            .then(res => res.json())
            .then(json => {
                setBoxInfo(json.box_info)
                setMyTree(json.my_tree)
            })
            .catch(error => console.log(error))
    }, [])

    //well contains the currently selected well index
    const [well, setWell] = useState(-1)
    // wellText contains the information from a well that is currently selected
    const [wellText, setWellText] = useState({})
    useEffect(() => {
        if (box.id) {
            fetch("vial_info/"+box.id+"/"+well, { credentials: 'include' })
                .then(response => response.json())
                .then(json => setWellText(json))
                .catch(error => console.log(error))
        }
    }, [well, box.id]);
    const changeWell = (wellid: number) => {
        setWell(wellid)
        setSelectedItem({type:'vial', pk:wellid.toString()})
    }

    const handleTreeSelect = (nodeId: string) => {
        //console.log(nodeId)
        if (nodeId in box_info) {
            setBox({id: nodeId, ...box_info[nodeId]})
            setWell(-1)
            setSelectedItem({type:'box', pk: nodeId})
        } else if (nodeId.endsWith("newBox") || nodeId.endsWith("newLocation")) {
            let myHeaders = new Headers();
            myHeaders.append('Newstuff', nodeId);
            fetch("locsNboxs", {credentials: 'include', headers: myHeaders})
            .then(res => res.json())
            .then(json => {
                setBoxInfo(json.box_info)
                setMyTree(json.my_tree)
            })
            .catch(error => console.log(error))
        } else { // ok so its a location
            let pk = nodeId.split("_").at(-1)
            if (pk) {setSelectedItem({type:'loc', pk: pk})}
        }
    }

    return (
        <Box display="flex" flexDirection="column" style={classes.root}>
            <div id="storage_top" style={classes.top}>
                header
            </div>
            <Box display="flex" flexGrow={1} id="storage_bottom">
                <div id="storage_tree">
                    <TheTree NodeSelectFunc={handleTreeSelect} tree_data={my_tree}/>
                </div>
                <div id="storage_box" ref={observe}>
                    <TheBox selected_well={well} WellSelectFunc={changeWell} box_info={box} height={height} width={width}/>
                </div>
                <Box id="storage_well" flexGrow={1} style={classes.well}>
                    <TheEditor target_type={selectedItem.type} target_pk={selectedItem.pk} setBoxInfo={setBoxInfo} setMyTree={setMyTree}/>
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
