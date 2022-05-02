import React, {useEffect, useState} from "react"
import {useForm, SubmitHandler, Controller} from "react-hook-form"
import { InputText } from 'primereact/inputtext'
import { Button } from 'primereact/button';
import { Dropdown } from "primereact/dropdown";
import { Card } from "primereact/card";
import {AutoComplete, AutoCompleteCompleteMethodParams} from "primereact/autocomplete";
import {classNames} from "primereact/utils";
import {doApiCall} from "../helpers";

interface ModelInstance  {
	url: number,
	name: string
}

type Inputs = {
	label: string,
	description_text: string,
	pickmodel: {name: string, code: string}|null,
	specific_item: string
}

const defaultValues = {
	label: 'test1',
	description_text: 'test2',
	pickmodel: null,
	specific_item: ""
}

export const UpdateForm = () => {
	const [editModelInstance, setEditModelInstance] = useState<ModelInstance>()
	const [editModelInstances, setEditModelInstances] = useState<ModelInstance[]>()
	const [filteredModelInstances, setFilteredModelInstances] = useState<ModelInstance[]>()
	const [editModel, setEditModel] = useState<string>()

	const search_model_instance = (event: AutoCompleteCompleteMethodParams) => {
		/*let _filteredIds: ModelInstance[];
		if (editModelInstances !== undefined) {
			_filteredIds = editModelInstances.filter((i) => i.name.toLowerCase().includes(event.query.toLowerCase()))
			setFilteredModelInstances(_filteredIds);
		}*/
	}

	const {control, handleSubmit, formState: {errors}} = useForm<Inputs>({defaultValues})
	const onSubmit: SubmitHandler<Inputs> = data => console.log(data)
	const setMode = (mode:string) => {}
	//replace with inputs
	const selected_wells = {size: 4}
	const plural = "s"
	const link_models = [{name: 'amodel', code: 'amodel'}, {name: 'another', code: 'another'}]
	const vial_content = {'Vial content': 8}

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
	}, [editModel, /*vial_content*/])

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
						<Controller name="pickmodel" control={control} render={({field}) => (
							<Dropdown id={field.name} value={field.value} onChange={(e) => field.onChange(e.value)} options={link_models} optionLabel="name" />
						)}/>
						<label htmlFor="pickmodel">Type of item</label>
					</span>
				</div>
				<div className="field">
					<span className="p-float-label">
						<Controller name="specific_item" control={control} render={({field}) => (
							<AutoComplete id={field.name} dropdown forceSelection field="name" completeMethod={search_model_instance}
										  suggestions={filteredModelInstances} onChange={(e) => setEditModelInstance(e.value)}
										  disabled={editModel === undefined}
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
