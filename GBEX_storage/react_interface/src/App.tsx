import React, {useEffect, useState} from 'react'
import TheTree from './TheTree'
import TheBox from './TheBox'
import TheEditor from './TheEditor'
import useDimensions from "react-cool-dimensions"

export default function App() {
    const { observe, width, height } = useDimensions()
    const [box, setBox] = useState({vials: [{id: -1, name:"A1"}], rows: 1, columns: 1}); // box contain information about the currently selected box
    const [selectedWell, setSelectedWell] = useState({id: -1, name: "A1", pos: -1})
    useEffect(() => { setSelectedWell({id: -1, name: "A1", pos: -1}) }, [box]);

    // wellText contains the information from a well that is currently selected
    //const [wellText, setWellText] = useState({})
    //useEffect(() => {
    //    if (box.id) {
    //        fetch("vial_info/"+box.id+"/"+well, { credentials: 'include' })
    //            .then(response => response.json())
    //            .then(json => setWellText(json))
    //            .catch(error => console.log(error))
    //    }
    //}, [well, box.id]);

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
