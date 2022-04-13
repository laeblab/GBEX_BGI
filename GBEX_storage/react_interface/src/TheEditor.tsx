import React, {Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react'
import { Button } from "primereact/button";
import { confirmDialog } from "primereact/confirmdialog";
import { Dropdown } from 'primereact/dropdown';
import { AutoComplete, AutoCompleteCompleteMethodParams } from 'primereact/autocomplete';
import { InputText } from 'primereact/inputtext';
import { Card } from "primereact/card";
import { Box, vial_model } from './App'
import { doApiCall, deepEqual } from "./helpers";
import { useForm, Controller } from 'react-hook-form';
import { classNames } from 'primereact/utils';


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


interface ModelInstance  {
	url: number,
	name: string
}

interface VialDisplay {'Vial label': string, 'Vial description': string, 'Vial content': object}


export default function MyEditor(props: {selected_wells: Set<string>, box: Box, link_models: vial_model[], setStale: Dispatch<SetStateAction<boolean>>}) {
	const {selected_wells, box, link_models, setStale} = props
	const [vial_content, setVialContent] = useState<VialDisplay>()
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

	const defaultValues = {
		label: '',
		description: '',
		model: '',
		instance: '',
	}
	const { control, formState: { errors }, handleSubmit, reset } = useForm({ defaultValues });

	const [formData, setFormData] = useState({});
	const [showMessage, setShowMessage] = useState(false);

	const onSubmit = (data: string) => {
		setFormData(data);
		setShowMessage(true);

		reset();
	};

	useEffect(() => {
		if (vial_ids.length === 1) {
			const show_id = vial_ids[0].id
			doApiCall("http://127.0.0.1:8000/storage/displayVial/"+show_id, "", "get", {})
				.then(json => {
					if (vial_content === undefined || !deepEqual(json, vial_content)) {
						setVialContent(json as VialDisplay)
					}
				})
		} else {
			setVialContent(undefined)
	}}, [vial_ids, vial_content])

	useEffect(() => {
		if (editModel !== undefined) {
			doApiCall("", editModel, "get", {}).then(r => {
				setEditModelInstances(r as ModelInstance[])
				if (vial_content !== undefined) {
					const model_instance = Object.keys(vial_content['Vial content'])[0].split(" - ")[1]
					setEditModelInstance(r.filter((v:ModelInstance) => v.name === model_instance)[0])
				}
			})
		}
	}, [editModel, vial_content])

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
			message: <span>You are about to assign {editModel}-{">"}{editModelInstance?.name} to {selected_wells.size} position{plural}{vial_ids.length !== 0 ? ", " + vial_ids.length + " of which "+ (vial_ids.length === 1 ? "has":"have") +" EXISTING content which will be DELETED!":null}.<br />Are you sure you want to proceed?</span>,
			header: 'Assign vials?',
			icon: 'pi pi-exclamation-triangle',
			position: 'left',
			accept: () => {
				// delete the existing vials
				Promise.all(vial_ids.map(e => doApiCall(String(e.id), "Vial", "delete", {}))).then(e => {
					// create new vials for all positions
					// step 1: determine if a model is being linked or if this is a custom vial
					const content_field = link_models.filter(v => v.model === editModel)[0]?.field
					Promise.all(Array.from(selected_wells).map(e => doApiCall("", "Vial", "post", {
						label: labelText,
						description: descriptionText,
						parent: "http://127.0.0.1:8000/api/Box/" + box.id.split("_").at(-1) + "/",
						box_row: e.split("+")[0],
						box_column: e.split("+")[1],
						[content_field]: [editModelInstance ? editModelInstance.url : null]
					}))).then(e => {
						setMode("view")
						setStale(c => !c)
					})
				})
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

	const setEditMode = () => {
		if (vial_content !== undefined) {
			setLabelText(vial_content['Vial label'])
			setDescriptionText(vial_content['Vial description'])
			const model_kind = Object.keys(vial_content['Vial content'])[0]?.split(" - ")[0]
			setEditModel(model_kind)
		}
		setMode("edit")
	}

	if (mode === 'view') {
		let vial_html = null
		if (vial_content !== undefined) {
			vial_html = object2ul(vial_content)
		}
		return <>
			<ul>
				<li>Selected {selected_wells.size} position{plural}.</li>
				{vial_html ? <>{vial_html}</>: <li>To see vial content, select only 1 vial with content.</li>}
			</ul>
			<Button onClick={setEditMode}>Set content of vial{plural}</Button>
			<Button onClick={delete_vials}>Delete selected vial{plural}</Button>
		</>
	} else if (mode === 'edit') {
		return <Card>
			<div className="field">
				Selected {selected_wells.size} position{plural}.
			</div>
			<div className="field">
				<span className="p-float-label">
					<Controller name="label" control={control} rules={{}} render={({ field, fieldState }) => (
						<InputText id={field.name} {...field} autoFocus className={classNames({ 'p-invalid': fieldState.invalid })} />
					)}/>
					<label htmlFor="label">Label</label>
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
