import React, {useEffect, useState} from 'react'
import TheTree from './TheTree'
import TheBox from './TheBox'
import TheEditor from './right_panel/TheEditor'
import useDimensions from "react-cool-dimensions"
import TreeNode from "primereact/treenode"
import { getCookie, climb_tree, doApiCall, deepEqual } from "./helpers"
import { Splitter, SplitterPanel } from 'primereact/splitter'
import { Card } from 'primereact/card'
import {ConfirmDialog} from "primereact/confirmdialog";

export interface Vial {
    id: number;
    label: string;
    description: string;
    box_row: number;
    box_column: number;
}

export interface Box {
    id: string,
    vials: Vial[],
    rows: number,
    columns: number
}

export interface vial_model {
    'model': string,
    'field': string
}

export default function App() {
    const { observe, width, height } = useDimensions()
    const [box, setBox] = useState<Box>()
    const [selected_wells, setSelectedWells] = useState<Set<string>>(() => new Set())
    const [nodes, setNodes] = useState<TreeNode[]>([])
    const [stale, setStale] = useState(true)
    const [link_models, setLinkModels] = useState<vial_model[]>([])

    // Primary data get. All other data should be directly derived from this to ensure components update correctly
    useEffect(() => {
        doApiCall("http://127.0.0.1:8000/storage/locsNboxs", "", "get", {})
            .then(json => {
                if (!deepEqual(nodes, json.tree)) {
                    setNodes(json.tree)
                }
                if (!deepEqual(link_models, json.vial_models)) {
                    setLinkModels(json.vial_models)
                }
                setTimeout(() => setStale(!stale), 5000)
            })
    }, [stale, nodes, link_models]);

    // if nodes have changed, just update the box as well
    useEffect(() => {
        if (box !== undefined) {
            setBox(climb_tree(nodes, box.id)?.data)
        }
    }, [nodes, box])

    const setBoxFromId = (box_id: string) => {
        if (box===undefined || box_id !== box.id) {
            setBox(climb_tree(nodes, box_id)?.data)
            setSelectedWells(() => new Set()) // reset selected wells on new box
        }
    }

    return <>
        <ConfirmDialog />
        <Splitter id="storage_root" gutterSize={10}>
            <SplitterPanel>
                <TheTree nodes={nodes} setBox={setBoxFromId} setStale={setStale}/>
            </SplitterPanel>
            <SplitterPanel style={{overflowX: "hidden", overflowY: "auto"}}>
                {box===undefined ? <Card style={{margin:"25%", textAlign: "center"}}>No box selected</Card> :
                    <div id="box_observer_root" ref={observe}>
                        <TheBox selected_wells={selected_wells} setSelectedWells={setSelectedWells} box={box} height={height} width={width}/>
                    </div>
                }
            </SplitterPanel>
            <SplitterPanel>
                {(selected_wells.size===0 || box===undefined) ?
                    <Card style={{margin:"25%", textAlign: "center"}}>No vial selected</Card> :
                    <TheEditor selected_wells={selected_wells} box={box} link_models={link_models} setStale={setStale}/>
                }
            </SplitterPanel>
        </Splitter>
    </>
}
