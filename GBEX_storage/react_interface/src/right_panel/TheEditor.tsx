import React, {Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react'
import { Button } from "primereact/button";
import { confirmDialog } from "primereact/confirmdialog";
import { Box, vial_model } from '../App'
import { doApiCall, deepEqual } from "../helpers";
import UpdateForm from "./UpdateForm";

function object2ul(obj: object) {
	return Object.entries(obj).map((([i,s], n) => {
		if (typeof s === 'object' && s !== null) {
			return <li key={i+n}>{i}:<ul>{object2ul(s)}</ul></li>
		} else {
			if (/<\/?[a-z][\s\S]*>/i.test(s)) { // check if s looks like html
				return <li key={i}>{i}: <div style={{display: "inline"}} dangerouslySetInnerHTML={{ __html: s }} /></li>
			} else { return <li key={i}>{i}: {s}</li> }
		}
	}))
}

export interface VialDisplay {'Vial label': string, 'Vial description': string, 'Vial content': object}

export default function MyEditor(props: {selected_wells: Set<string>, box: Box, link_models: vial_model[], setStale: Dispatch<SetStateAction<boolean>>}) {
	const {selected_wells, box, link_models, setStale} = props
	const [vial_content, setVialContent] = useState<VialDisplay>()
	const [mode, setMode] = useState<"view"|"edit">("view")

	// edit mode states
	const plural = selected_wells.size !== 1 ? "s": ""
	const vial_ids = useMemo(() => box.vials.filter(v => selected_wells.has(v.box_row+"+"+v.box_column)), [box, selected_wells])

	// if a single vial has been selected, then fetch the content from server
	useEffect(() => {
		if (vial_ids.length === 1) {
			const show_id = vial_ids[0].id
			doApiCall("displayVial/"+show_id, null, "GET", {})
				.then(json => {
					if (vial_content === undefined || !deepEqual(json, vial_content)) {
						setVialContent(json as VialDisplay)
					}
				})
		} else {
			setVialContent(undefined)
	}}, [vial_ids, vial_content])

	useEffect(() => {
		setMode("view")
	}, [selected_wells])

	const delete_vials = () => {
		confirmDialog({
			message: <span>You are about to delete {vial_ids.length} vial{plural}<br />Are you sure you want to proceed?</span>,
			header: 'Delete vials?',
			icon: 'pi pi-exclamation-triangle',
			position: 'right',
			accept: () => { vial_ids.map(e => doApiCall(String(e.id), "Vial", "DELETE", {}).then(e => setStale(c => !c)))},
		});
	}

	if (mode === 'view') {
		let vial_html = null
		if (vial_content !== undefined) {
			vial_html = object2ul(vial_content)
		}
		return <>
			<ul>
				<li>Selected {selected_wells.size} position{plural}. {vial_ids.length} already ha{vial_ids.length===1 ? "s":"ve"} content.</li>
				{vial_html ? <>{vial_html}</>: <li>To see vial content, select only 1 vial with content.</li>}
			</ul>
			<Button onClick={() => setMode("edit")}>Set content of vial{plural}</Button>
			<Button onClick={delete_vials} disabled={vial_ids.length===0}>Delete selected vial{plural}</Button>
		</>
	} else if (mode === 'edit') {
		return <UpdateForm selected_wells={selected_wells} link_models={link_models} vial_content={vial_content} vial_ids={vial_ids} box={box} setStale={setStale} setMode={setMode}/>
	} else {
		return <>An unimplemented third option?</>
	}
}
