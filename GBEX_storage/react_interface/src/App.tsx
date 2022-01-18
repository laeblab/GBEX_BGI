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
    box_column?: number,
    description?: string
}

export interface Vials {
    [key: string]: Vial
}

export interface Box {
    id: string,
    vials: Vials,
    rows: number,
    columns: number
}

export function climb_tree(qq: TreeNode[], key: string) : TreeNode|undefined {
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

export default function App() {
    const { observe, width, height } = useDimensions()
    //const [box_id, setBoxId] = useState("")
    const [box, setBox] = useState<Box>()
    const [selected_wells, setSelectedWells] = useState<Set<string>>(() => new Set())
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

    const setBoxFromId = (box_id: string) => {
        if (box===undefined || box_id !== box.id) {
            setBox(climb_tree(nodes, box_id)?.data)
            setSelectedWells(() => new Set())
        }
    }

    return (
        <div id="storage_root">
            <div id="storage_top">header</div>
            <div id="storage_bottom">
                <div id="storage_left">
                    <TheTree nodes={nodes} setNodes={setNodes} setStale={setStale} setBox={setBoxFromId} />
                </div>
                <div id="storage_middle" ref={observe}>
                    {box===undefined ? null:<TheBox selected_wells={selected_wells} setSelectedWells={setSelectedWells} box_info={box} height={height} width={width}/>}
                </div>
                <div id="storage_right">
                    {(selected_wells.size===0 || box===undefined) ? null: <TheEditor selected_wells={box.vials}/>}
                </div>
            </div>
        </div>
    )
}
