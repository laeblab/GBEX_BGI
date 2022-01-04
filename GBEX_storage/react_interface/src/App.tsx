import React, {useEffect, useState} from 'react'
import TheTree from './TheTree'
import TheBox from './TheBox'
import TheEditor from './TheEditor'
import useDimensions from "react-cool-dimensions"

export interface Vial {
    name: string,
    id: number,
    box_row?: number,
    box_column?: number
    pos?: number
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
    const [box, setBox] = useState<Box>({vials: {A1: {id: -1, name:"A1"}}, rows: 1, columns: 1}); // box contain information about the currently selected box
    const [selectedWell, setSelectedWell] = useState<Vial>({id: -1, name: "A1", pos: -1})
    useEffect(() => { setSelectedWell({id: -1, name: "A1", pos: -1}) }, [box]);

    return (
        <div id="storage_root">
            <div id="storage_top">header</div>
            <div id="storage_bottom">
                <div id="storage_left">
                    <TheTree setBox={setBox} />
                </div>
                <div id="storage_middle" ref={observe}>
                    <TheBox selected_well={selectedWell} set_selected_well={setSelectedWell} box_info={box} height={height} width={width}/>
                </div>
                <div id="storage_right">
                    <TheEditor selected_well={selectedWell}/>
                </div>
            </div>
        </div>
    )
}
