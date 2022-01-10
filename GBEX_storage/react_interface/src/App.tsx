import React, {useEffect, useState} from 'react'
import TheTree from './TheTree'
import TheBox from './TheBox'
import TheEditor from './TheEditor'
import useDimensions from "react-cool-dimensions"
import TreeNode from "primereact/treenode";

export interface Vial {
    name: string,
    id: number,
    box_row?: number,
    box_column?: number
}

export interface Vials {
    [key: string]: Vial
}

export interface Box {
    vials: Vials,
    rows: number,
    columns: number
}

export default function App() {
    const { observe, width, height } = useDimensions()
    const [box, setBox] = useState<Box|undefined>()
    const [selectedWell, setSelectedWell] = useState<Vials|undefined>()
    useEffect(() => { setSelectedWell(undefined) }, [box])

    const [nodes, setNodes] = useState<TreeNode[]>([])
    const [staleTree, setStale] = useState(true)
    useEffect(() => {
        console.log("using effect")
        fetch("http://127.0.0.1:8000/storage/locsNboxs", {credentials: 'include'})
            .then(res => res.json())
            .then(json => setNodes(json.tree))
            .catch(error => console.log(error))
        setTimeout(() => setStale(!staleTree), 5000)
    }, [staleTree]);

    return (
        <div id="storage_root">
            <div id="storage_top">header</div>
            <div id="storage_bottom">
                <div id="storage_left">
                    <TheTree setNodes={setNodes} nodes={nodes} setStale={setStale} setBox={setBox} />
                </div>
                <div id="storage_middle" ref={observe}>
                    {box===undefined ? null:<TheBox selected_well={selectedWell} set_selected_well={setSelectedWell} box_info={box} height={height} width={width}/>}
                </div>
                <div id="storage_right">
                    {selectedWell===undefined ? null: <TheEditor selected_well={selectedWell}/>}
                </div>
            </div>
        </div>
    )
}
