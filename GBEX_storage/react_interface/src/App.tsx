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
    const [box, setBox] = useState("")
    const [well, setWell] = useState<Vials>()
    const [nodes, setNodes] = useState<TreeNode[]>([])
    const [stale, setStale] = useState(true)

    // Primary data get. All other data should be directly derived from this to ensure components update correctly
    useEffect(() => {
        console.log("using effect")
        fetch("http://127.0.0.1:8000/storage/locsNboxs", {credentials: 'include'})
            .then(res => res.json())
            .then(json => setNodes(json.tree))
            .catch(error => console.log(error))
        setTimeout(() => setStale(!stale), 5000)
    }, [stale]);

    const climb_tree = (qq: TreeNode[], key: string) : TreeNode|undefined => {
        for (const e of qq) {
            if (e.key === key) {
                return e
            } else if (e.hasOwnProperty("children") && e.children !== undefined) {
                const deep: TreeNode|undefined = climb_tree(e.children, key)
                if (deep) {
                    return deep
                }
            }
        }
    }

    return (
        <div id="storage_root">
            <div id="storage_top">header</div>
            <div id="storage_bottom">
                <div id="storage_left">
                    <TheTree nodes={nodes} setNodes={setNodes} setStale={setStale} setBox={setBox} />
                </div>
                <div id="storage_middle" ref={observe}>
                    {box==="" ? null:<TheBox selected_well={well} set_selected_well={setWell} box_info={climb_tree(nodes, box)?.data} height={height} width={width}/>}
                </div>
                <div id="storage_right">
                    {well===undefined ? null: <TheEditor selected_well={well}/>}
                </div>
            </div>
        </div>
    )
}
