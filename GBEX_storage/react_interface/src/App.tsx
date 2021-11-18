import React, {useEffect, useState} from 'react'
import TheTree from './TheTree'
import TheBox from './TheBox'
import TheEditor from './TheEditor'
import useDimensions from "react-cool-dimensions"
import TreeNode from "primereact/treenode";


//export type TreeType = {id: string, name: string, children: any}
//export type BoxInfoType = {[key: string]: {content: { name:string, id:number }[], size: {rows: number, columns: number}}}

export default function App() {
    const { observe, width, height } = useDimensions()
    //const [box, setBox] = useState({id: "", content: [{name:"A1", id:-1}], size: {rows: 1, columns: 1}}); // box contain information about the currently selected box
    //const [selectedItem, setSelectedItem] = useState({type:'loc', pk:"1"}) // the right panel shows an update form based on this
    // box_info is a dict that contains all box names + size + names of vials
    //const [box_info, setBoxInfo] = useState<BoxInfoType>({"box1": {content: [{name:"A1", id:-1}], size: {rows: 1, columns: 1}}, "box2": {content: [{name:"A1", id:-1}], size: {rows: 1, columns: 1}}})
    // my_tree contains a hierarchy of locations and boxes
    const [my_tree, setMyTree] = useState<TreeNode[]>([{key: "root_loc", label: "root loc", children: []}]);

    useEffect(() => {
        console.log("fethcing")
        fetch("locsNboxs", {credentials: 'include'})
            .then(res => res.json())
            .then(json => {
                console.log("fetched")
                console.log(json.tree)
                setMyTree(json.tree)
            })
            .catch(error => console.log(error))
    }, [])
    /*
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
    */

    /*
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
    }*/

    return (
        <div id="storage_root">
            <div id="storage_top">header</div>
            <div id="storage_bottom">
                <div id="storage_left">
                    <TheTree tree_data={my_tree}/>
                </div>
                <div id="storage_middle" ref={observe}>
                    {/*<TheBox selected_well={well} WellSelectFunc={changeWell} box_info={box} height={height} width={width}/>*/}
                </div>
                <div id="storage_right">
                    {/*<TheEditor target_type={selectedItem.type} target_pk={selectedItem.pk} setBoxInfo={setBoxInfo} setMyTree={setMyTree}/>*/}
                </div>
            </div>
        </div>
    )
}
