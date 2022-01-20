import React, {useEffect, useState} from 'react'
import TheTree from './TheTree'
import TheBox from './TheBox'
import TheEditor from './TheEditor'
import useDimensions from "react-cool-dimensions"
import TreeNode from "primereact/treenode";
import {getCookie} from "./index";

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
    const [box, setBox] = useState<Box>()
    const [selected_wells, setSelectedWells] = useState<Set<string>>(() => new Set())
    const [nodes, setNodes] = useState<TreeNode[]>([])
    const [stale, setStale] = useState(true)

    // Primary data get. All other data should be directly derived from this to ensure components update correctly
    useEffect(() => {
        console.log("refreshing locsNboxs")
        fetch("http://127.0.0.1:8000/storage/locsNboxs", {credentials: 'include'})
            .then(res => res.json())
            .then(json => setNodes(json.tree))
            .catch(error => console.log(error))
        setTimeout(() => setStale(!stale), 5000)
    }, [stale]);

    // if nodes have changed, check if box should be updated
    useEffect(() => {
        if (box !== undefined) {
            console.log("setting box in refresh", )
            setBox(climb_tree(nodes, box.id)?.data)
        }
    }, [nodes])

    const setBoxFromId = (box_id: string) => {
        if (box===undefined || box_id !== box.id) {
            setBox(climb_tree(nodes, box_id)?.data)
            setSelectedWells(() => new Set())
        }
    }

    const doApiCall = (key: string, body: {}, method='patch', kind="Box" ) => {
        if (key.startsWith('loc')) { // we got a location
            kind = 'Location'
        }
        key = key.split('_').splice(1).join('_') // Location keys are written loc_key or box_key
        const requestHeaders: HeadersInit = new Headers();
        console.log("Find this line and revert it for production. Fantastic system I got here...")
        const csrftoken = "DEVELOPMENT" //getCookie('csrftoken')

        if (typeof csrftoken === 'string') {
            requestHeaders.set('X-CSRFToken', csrftoken)
            requestHeaders.set('Content-Type', 'application/json')
            let url = "http://127.0.0.1:8000/api/" + kind + "/"
            if (['patch', 'delete'].includes(method)) { url += key + "/" }
            fetch(url, {
                //mode: 'same-origin',
                method: method,
                body: JSON.stringify(body),
                headers: requestHeaders})
                .then(res => res.json())
                .then(json => {
                    //optimistic update box size+name
                    if (kind==='Box' && box !== undefined) {
                        setBox({...json, id: "box_"+json.id, vials: box.vials})
                    }
                    setStale(c => !c)
                }).catch(error => console.log(error))
        }
    }

    return (
        <div id="storage_root">
            <div id="storage_top">header</div>
            <div id="storage_bottom">
                <div id="storage_left">
                    <TheTree nodes={nodes} setNodes={setNodes} setBox={setBoxFromId} apiCall={doApiCall} />
                </div>
                <div id="storage_middle" ref={observe}>
                    {box===undefined ? null:<TheBox selected_wells={selected_wells} setSelectedWells={setSelectedWells} box_info={box} height={height} width={width}/>}
                </div>
                <div id="storage_right">
                    {(selected_wells.size===0 || box===undefined) ? <ul><li>No vial selected</li></ul>: <TheEditor selected_wells={selected_wells} vials={box.vials} apiCall={doApiCall}/>}
                </div>
            </div>
        </div>
    )
}
