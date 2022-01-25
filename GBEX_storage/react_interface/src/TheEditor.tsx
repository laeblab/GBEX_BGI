import React, {useEffect, useMemo, useState} from 'react'
import {Box, Vial} from './App'
import { Button } from "primereact/button";
import { confirmDialog } from "primereact/confirmdialog";
import { Dropdown } from 'primereact/dropdown';
import {AutoComplete, AutoCompleteCompleteMethodParams} from 'primereact/autocomplete';
import { InputText } from 'primereact/inputtext';
import {Card} from "primereact/card";


function object2ul(obj: object, no_no_words: string[]) {
	return Object.entries(obj).map((([i,s]) => {
		if (no_no_words.includes(i)) {
			return null
		} else if (typeof s === 'object' && s !== null) {
			return <li key={i}>{i}:<ul>{object2ul(s, no_no_words)}</ul></li>
		} else { return <li key={i}>{i}:{s}</li>}
	}))
}

interface ModelInstance  {
	id: number,
	name: string
}
export default function MyEditor(props: {selected_wells: Set<string>, box: Box, apiCall: (id: string|number, kind: string, method: "get"|"post"|"patch"|"delete", body: object) => Promise<object>, link_models: string[]}) {
	const {selected_wells, box, apiCall, link_models} = props
	const [vial_content, setVialContent] = useState<{content_object: {[key: string]: string | object | undefined}, name: string, description: string}>()
	const [mode, setMode] = useState<"view"|"edit">("view")

	// edit mode states
	const [descriptionText, setDescriptionText] = useState('')
	const [editModel, setEditModel] = useState<string>()
	const [editModelInstance, setEditModelInstance] = useState<ModelInstance>()
	const [editModelInstances, setEditModelInstances] = useState<ModelInstance[]>()
	const [filteredModelInstances, setFilteredModelInstances] = useState<ModelInstance[]>()

	const plural = selected_wells.size !== 1 ? "s": ""

	const vial_ids = useMemo(() => box.vials.filter(v => selected_wells.has(v.box_row+"+"+v.box_column)), [box, selected_wells])

	let show_id = -1 // if theres just 1 selected vial and its not undefined, then show it
	if (vial_ids.length === 1) {
		show_id = vial_ids[0].id
	}

	useEffect(() => {
		if (show_id !== -1) {
			fetch("http://127.0.0.1:8000/api/Vial/"+show_id+"/")
				.then(res => res.json())
				.then(json => setVialContent(json))
		} else {
			setVialContent(undefined)
		}}, [show_id])

	useEffect(() => {
		if (editModel !== undefined) {
			apiCall("", editModel, "get", {}).then(r => {setEditModelInstances(r as ModelInstance[]); console.log(r)})
		}
	}, [editModel, apiCall])

	const delete_vials = () => {
		confirmDialog({
			message: <span>You are about to delete {vial_ids.length} vial{plural}<br />Are you sure you want to proceed?</span>,
			header: 'Delete vials?',
			icon: 'pi pi-exclamation-triangle',
			position: 'left',
			accept: () => { vial_ids.map(e => apiCall(String(e.id), "Vial", "delete", {}))},
		});
	}

	const assign_vials = () => {
		confirmDialog({
			message: <span>You are about to assign {editModel}-{">"}{editModelInstance?.name} to {selected_wells.size} position{plural}{vial_ids.length !== 0 ? ", " + vial_ids.length + " of which "+ (vial_ids.length === 1 ? "has":"have") +" EXISTING content and will be DELETED!":null}.<br />Are you sure you want to proceed?</span>,
			header: 'Assign vials?',
			icon: 'pi pi-exclamation-triangle',
			position: 'left',
			accept: () => {
				// delete the existing vials
				vial_ids.map(e => apiCall(String(e.id), "Vial", "delete", {}))
				// create new vials for all positions
				//...
			},
		})
	}

	const search_model_instance = (event: AutoCompleteCompleteMethodParams) => {
		let _filteredIds: ModelInstance[];
		if (editModelInstances !== undefined) {
			_filteredIds = editModelInstances.filter((i) => i.name.toLowerCase().includes(event.query.toLowerCase()))
			setFilteredModelInstances(_filteredIds);
		}
	}

	if (mode === 'view') {
		const nono_names = ["id", "url","created","edited","archived"]
		let vial_html = null
		if (vial_content !== undefined) {
			vial_html = <ul><li>name:{vial_content.name}</li><li>description:{vial_content.description}</li>
				{ vial_content.content_object ? object2ul(vial_content.content_object, nono_names) : null}
			</ul>
		}
		return <ul>
			<li>Selected {selected_wells.size} position{plural}.</li>
			{vial_html ? <li>{vial_html}</li>: <li>To see vial content, select only 1 vial.</li>}
			<Button onClick={() => setMode("edit")}>Set content of vial{plural}</Button>
			<Button onClick={delete_vials}>Delete selected vial{plural}</Button>
		</ul>
	} else if (mode === 'edit') {
		return <Card>
			<div className="field">
				Selected {selected_wells.size} position{plural}.
			</div>
			<div className="field">
				<span className="p-float-label">
					<InputText className={"vial_editors"} id="description_text" value={descriptionText} onChange={(e) => setDescriptionText(e.target.value)} />
					<label htmlFor="description_text">Description</label>
				</span>
			</div>
			<div className="field">
				<span className="p-float-label">
					<Dropdown className={"vial_editors"} id="pickmodel" value={editModel} onChange={e=>setEditModel(e.value)} options={link_models.map((v) => {return {name: v, value: v}})} optionLabel="name" />
					<label htmlFor="pickmodel">Type of item</label>
				</span>
			</div>
			<div className="field">
				<span className="p-float-label">
					<AutoComplete className={"vial_editors"} id="specific_item" dropdown forceSelection value={editModelInstance}
								  suggestions={filteredModelInstances} completeMethod={search_model_instance}
								  field="name" disabled={editModel === undefined}
								  onChange={(e) => setEditModelInstance(e.value)} />
					<label htmlFor="specific_item">Specific item</label>
				</span>
			</div>
			<div className="field">
				<Button onClick={assign_vials}>Apply</Button>
				<Button onClick={() => setMode("view")}>Cancel</Button>
			</div>
		</Card>
	} else {
		return <>What?</>
	}
}
