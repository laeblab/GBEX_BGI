import React, {Dispatch, SetStateAction, useEffect, useMemo, useState} from 'react'
import { Button } from "primereact/button";
import { confirmDialog } from "primereact/confirmdialog";
import { Dropdown } from 'primereact/dropdown';
import { AutoComplete, AutoCompleteCompleteMethodParams } from 'primereact/autocomplete';
import { InputText } from 'primereact/inputtext';
import { Card } from "primereact/card";
import { Box, Vial, vial_model } from './App'
import { doApiCall, deepEqual, isValidHttpUrl } from "./helpers";


function object2ul(obj: object, no_no_words: string[]) {
	return Object.entries(obj).map((([i,s], n) => {
		if (no_no_words.includes(i)) {
			return null
		} else if (typeof s === 'object' && s !== null) {
			return <li key={i+n}>{i}:<ul>{object2ul(s, no_no_words)}</ul></li>
		} else { return <li key={i}>{i}:{s}</li>}
	}))
}

interface ModelInstance  {
	id: number,
	name: string
}


export default function MyEditor(props: {selected_wells: Set<string>, box: Box, link_models: vial_model[], setStale: Dispatch<SetStateAction<boolean>>}) {
	const {selected_wells, box, link_models, setStale} = props
	const [vial_content, setVialContent] = useState<Vial>()
	const [vial_links, setVialLinks] = useState<{[key:string]:any}[]>([])
	const [mode, setMode] = useState<"view"|"edit">("view")

	// edit mode states
	const [descriptionText, setDescriptionText] = useState('')
	const [labelText, setLabelText] = useState('')
	const [editModel, setEditModel] = useState<string>()
	const [editModelInstance, setEditModelInstance] = useState<ModelInstance>()
	const [editModelInstances, setEditModelInstances] = useState<ModelInstance[]>()
	const [filteredModelInstances, setFilteredModelInstances] = useState<ModelInstance[]>()
	const plural = selected_wells.size !== 1 ? "s": ""
	const vial_ids = useMemo(() => box.vials.filter(v => selected_wells.has(v.box_row+"+"+v.box_column)), [box, selected_wells])

	useEffect(() => {
		if (vial_ids.length === 1) {
			const show_id = vial_ids[0].id
			doApiCall(show_id, "Vial", "get", {})
				.then(json => {
					if (vial_content === undefined || !deepEqual(json, vial_content)) {
						setVialContent(json as Vial)
					}
				})
		} else {
			setVialContent(undefined)
	}}, [vial_ids, vial_content])

	// obtain deep linked vial info
	useEffect(() => {
		if (vial_content !== undefined) {
			// OK NEW PLAN. SO WE ITERATE THE link_models, and doApiCall, and update the setVialLinks on the "then" function
			for (const model of link_models) {
				// @ts-ignore because I can't figure out how to typescript an object with fixed AND dynamic keys
				for (const url of vial_content[model.field]) {
					doApiCall(url, "", "get", {}).then(api_return => {
						const urled_entries = Object.entries(api_return).filter(([key, value]) => isValidHttpUrl(value))
						Promise.all(urled_entries.map(([key, url]) => doApiCall(url, "", "get", {}))).then(res => {
							if (api_return.hasOwnProperty("Parent") && isValidHttpUrl(api_return.Parent)) {
								// If there is a parent, we want to show it in its entirety, but with urls replaced with "name"
								// find the Parent position in the returned array
								const parent_index = urled_entries.findIndex(([key, url]) => key === "Parent")
								const urled_parent_entries = Object.entries(res[parent_index]).filter(([key, value]) => isValidHttpUrl(value))
								Promise.all(urled_parent_entries.map(([key, url]) => doApiCall(url, "", "get", {}))).then(parent_res => {
									const parent_object = {...res[parent_index], ...Object.fromEntries(parent_res.map((e, i) => [urled_parent_entries[i][0],e.name]))}
									setVialLinks([{...api_return, ...Object.fromEntries(res.map((e, i) => {return [urled_entries[i][0],e.name]})), Parent: parent_object}])
								})
							} else {
								setVialLinks([{...api_return, ...Object.fromEntries(res.map((e, i) => [urled_entries[i][0],e.name]))}])
							}
						})
					})
				}
			}
		}
	}, [vial_content, link_models])

	useEffect(() => {
		if (editModel !== undefined) {
			doApiCall("", editModel, "get", {}).then(r => setEditModelInstances(r as ModelInstance[]))
		}
	}, [editModel])

	const delete_vials = () => {
		confirmDialog({
			message: <span>You are about to delete {vial_ids.length} vial{plural}<br />Are you sure you want to proceed?</span>,
			header: 'Delete vials?',
			icon: 'pi pi-exclamation-triangle',
			position: 'left',
			accept: () => { vial_ids.map(e => doApiCall(String(e.id), "Vial", "delete", {}).then(e => setStale(c => !c)))},
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
				vial_ids.map(e => doApiCall(String(e.id), "Vial", "delete", {}))
				// create new vials for all positions
				Array.from(selected_wells).map(e => doApiCall("", "Vial", "post", {
					parent: box.id,
					box_row: e.split("+")[0],
					box_column: e.split("+")[1],
					description: descriptionText,
					content_object: null // link object to vials
				}))
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
		let vial_html = null
		const nono_names = ["id", "url","created","edited","archived","Location"]

		if (vial_content !== undefined) {
			vial_html = <ul>
				<li>Label:{vial_content.label}</li>
				<li>description:{vial_content.description}</li>
				<li>Vial content:</li>
				<ul>
					{ vial_links.map(vl => object2ul(vl, nono_names))}
				</ul>
			</ul>
		}
		return <><ul><li>Selected {selected_wells.size} position{plural}.</li></ul>
			{vial_html ? <li>{vial_html}</li>: <li>To see vial content, select only 1 vial.</li>}
			<Button onClick={() => {
				if (vial_content !== undefined) {
					setLabelText(vial_content.label)
					setDescriptionText(vial_content.description)
					console.log("figure out linked model and set that")
					console.log("and model instance")
				}
				setMode("edit")
			}}>Set content of vial{plural}</Button>
			<Button onClick={delete_vials}>Delete selected vial{plural}</Button>
		</>
	} else if (mode === 'edit') {
		return <Card>
			<div className="field">
				Selected {selected_wells.size} position{plural}.
			</div>
			<div className="field">
				<span className="p-float-label">
					<InputText className={"vial_editors"} id="label_text" value={labelText} onChange={(e) => setLabelText(e.target.value)} />
					<label htmlFor="label_text">Label</label>
				</span>
			</div>
			<div className="field">
				<span className="p-float-label">
					<InputText className={"vial_editors"} id="description_text" value={descriptionText} onChange={(e) => setDescriptionText(e.target.value)} />
					<label htmlFor="description_text">Description</label>
				</span>
			</div>
			<div className="field">
				<span className="p-float-label">
					<Dropdown className={"vial_editors"} id="pickmodel" value={editModel} onChange={e=>setEditModel(e.value)} options={link_models.map((v) => {return {name: v.model, value: v.model}})} optionLabel="name" />
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
