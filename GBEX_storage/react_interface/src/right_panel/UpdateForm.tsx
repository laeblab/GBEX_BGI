import React, {Dispatch, SetStateAction, useEffect, useState} from "react"
import {useForm, SubmitHandler, Controller} from "react-hook-form"
import { InputText } from 'primereact/inputtext'
import { Button } from 'primereact/button';
import { Dropdown } from "primereact/dropdown";
import { Card } from "primereact/card";
import {AutoComplete, AutoCompleteCompleteMethodParams} from "primereact/autocomplete";
import {classNames} from "primereact/utils";
import {doApiCall} from "../helpers";
import {VialDisplay} from "./TheEditor"
import {vial_model} from "../App";

interface ModelInstance  {
	url: number,
	name: string
}

type Inputs = {
	label: string|undefined,
	description_text: string|undefined,
	pick_model: string|undefined,
	specific_item: string|undefined
}

export default function UpdateForm(props: {selected_wells: Set<string>, link_models: vial_model[], vial_content: VialDisplay|undefined, setMode: Dispatch<SetStateAction<"view"|"edit">>}) {
	const {selected_wells, link_models, vial_content, setMode} = props
	const plural = selected_wells.size !== 1 ? "s": ""
	// all the instances of the selected model
	const [editModelInstances, setEditModelInstances] = useState<ModelInstance[]>([])
	// When searching the model autocomplete widget this stores the model instances
	const [filteredModelInstances, setFilteredModelInstances] = useState<ModelInstance[]>()

	const defaultValues = {
		label: undefined,
		description_text: undefined,
		pick_model: undefined,
		specific_item: undefined
	}

	const {setValue, control, handleSubmit, formState: {errors}} = useForm<Inputs>({defaultValues})
	const onSubmit: SubmitHandler<Inputs> = data => console.log(data)
	const search_model_instance = (event: AutoCompleteCompleteMethodParams) => {
		let _filteredIds: ModelInstance[];
		if (editModelInstances !== undefined) {
			_filteredIds = editModelInstances.filter((i) => i.name.toLowerCase().includes(event.query.toLowerCase()))
			setFilteredModelInstances(_filteredIds);
		}
	}

	// if a model is selected then fetch model instances
	const fetch_model_instances = (e: string, initial: boolean=false) => {
			doApiCall("", e, "get", {}).then(r => {
				setEditModelInstances(r as ModelInstance[])
				if (initial && vial_content!==undefined) {
					setValue("specific_item", Object.keys(vial_content['Vial content'])[0]?.split(" - ")[1])
				} else {
					if (r.length === 0) {
						setValue("specific_item", "Couldn't find any " + e + " items")
					} else {
						setValue("specific_item", undefined)
					}
				}
			})
	}

	// set defaults
	useEffect(() => {
		if (vial_content!==undefined) {
			setValue("label", vial_content['Vial label'])
			setValue("description_text", vial_content['Vial description'])
			const model = Object.keys(vial_content['Vial content'])[0]?.split(" - ")[0]
			setValue("pick_model", model)
			fetch_model_instances(model, true)
		}
	}, [vial_content, setValue])

	const assign_vials = () => {/*
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
		})*/
	}

	return (
		<Card>
			<h5 className="text-center">Selected {selected_wells.size} position{plural}.</h5>
			<form onSubmit={handleSubmit(onSubmit)} className="p-fluid">
				<div className="field">
					<span className="p-float-label">
						<Controller name="label" rules={{required: 'This is required.'}} control={control} render={({ field , fieldState}) => (
								<InputText id={field.name} {...field} className={classNames({'p-invalid': fieldState.error})} />
						)}/>
						<label htmlFor="label">Label</label>
					</span>
					{errors.label && <small className="p-error">{errors.label.message}</small>}
				</div>
				<div className="field">
					<span className="p-float-label">
						<Controller name="description_text" control={control} render={({field, fieldState}) => (
							<InputText id={field.name} {...field} className={classNames({'p-invalid': fieldState.error})}/>
						)}/>
						<label htmlFor="description_text" className={classNames({'p-error': errors.description_text})}>Description</label>
					</span>
					{errors.description_text && <small className="p-error">{errors.description_text.message}</small>}
				</div>
				<div className="field">
					<span className="p-float-label">
						<Controller name="pick_model" control={control} render={({field}) => (
							<Dropdown id={field.name} value={field.value} onChange={(e) => {fetch_model_instances(e.value); field.onChange(e.value)}} options={link_models.map(lm => lm.model)} />
						)}/>
						<label htmlFor="pick_model">Type of item</label>
					</span>
				</div>
				<div className="field">
					<span className="p-float-label">
						<Controller name="specific_item" control={control} render={({field}) => (
							<AutoComplete id={field.name} value={field.value} dropdown forceSelection field="name"
										  suggestions={filteredModelInstances} onChange={(e) => {field.onChange(e.value);}}
										  disabled={editModelInstances.length === 0} completeMethod={search_model_instance}
							/>
						)}/>
						<label htmlFor="specific_item">Specific item</label>
					</span>
				</div>
				<div className="flex">
					<Button className="m-1 shadow-7 p-button-success" type="submit" label="Apply"/>
					<Button className="m-1 shadow-7 p-button-danger" label="Cancel" onClick={() => setMode("view")}/>
				</div>
			</form>
		</Card>
	)
}
