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

export interface Box {
    id: string,
    vials: Vial[],
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
    const [link_models, setLinkModels] = useState<string[]>([])

    // Primary data get. All other data should be directly derived from this to ensure components update correctly
    useEffect(() => {
        console.log("refreshing locsNboxs")
        fetch("http://127.0.0.1:8000/storage/locsNboxs", {credentials: 'include'})
            .then(res => res.json())
            .then(json => {
                setNodes(json.tree)
                setLinkModels(json.vial_models)
            })
            .catch(error => console.log(error))
        setTimeout(() => setStale(!stale), 5000)
    }, [stale]);

    // if nodes have changed, just update the box as well
    useEffect(() => {
        if (box !== undefined) {
            setBox(climb_tree(nodes, box.id)?.data)
        }
    }, [nodes])

    const setBoxFromId = (box_id: string) => {
        if (box===undefined || box_id !== box.id) {
            setBox(climb_tree(nodes, box_id)?.data)
            setSelectedWells(() => new Set()) // reset selected wells on new box
        }
    }

    const doApiCall = (id: string|number, kind: string, method: "get"|"post"|"patch"|"delete", body: object) : Promise<object> => {
        /* doApiCall
            id: id of target object, if there is no target, then just pass an empty string
            kind: one of Location, Box or Vial
            method: HTML get, post, patch or delete
            body: patch and post requires a body
         */
        const requestHeaders: HeadersInit = new Headers();
        const csrftoken = "DEVELOPMENT" //getCookie('csrftoken')
        const str_id = String(id)

        if (typeof csrftoken === 'string') {
            requestHeaders.set('X-CSRFToken', csrftoken)
            requestHeaders.set('Content-Type', 'application/json')

            let url = "http://127.0.0.1:8000/api/" + kind + "/"
            if (['patch', 'delete'].includes(method) || (method==="get" && str_id !== "")) {
                url += id + "/"
            }

            return fetch(url, {
                mode: 'cors',
                method: method,
                body: Object.keys(body).length === 0 ? null: JSON.stringify(body),
                headers: requestHeaders
            }).then(res => {
                if (method !== 'delete') { // no return on delete
                    return res.json()
                }
            }).then(json => {
                if (method !== 'get') {
                    setStale(c => !c)
                }
                if (method !== 'delete') { // no return on delete
                    return json
                }
            }).catch(error => console.log(error))
        }
        return new Promise(() => {})
    }

    return (
        <div id="storage_root">
            <div id="storage_top">header</div>
            <div id="storage_bottom">
                <div id="storage_left">
                    <TheTree nodes={nodes} setNodes={setNodes} setBox={setBoxFromId} apiCall={doApiCall} />
                </div>
                <div id="storage_middle" ref={observe}>
                    {box===undefined ? null:<TheBox selected_wells={selected_wells} setSelectedWells={setSelectedWells} box={box} height={height} width={width}/>}
                </div>
                <div id="storage_right">
                    {(selected_wells.size===0 || box===undefined) ? <ul><li>No vial selected</li></ul>: <TheEditor selected_wells={selected_wells} box={box} apiCall={doApiCall} link_models={link_models}/>}
                </div>
            </div>
        </div>
    )
}
