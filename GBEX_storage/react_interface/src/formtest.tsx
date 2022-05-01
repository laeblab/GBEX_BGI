import React, { useEffect, useState } from "react"
import { useForm, SubmitHandler, Controller } from "react-hook-form"
import { InputText } from 'primereact/inputtext'
import {classNames} from "primereact/utils";

type Inputs = {
	example: string,
	exampleRequired: string,
}

export const FormTest = () => {
	const defaultValues = {
		example: 'test1',
		exampleRequired: 'test2'
	}

	const { control, register, handleSubmit, formState: { errors }, reset} = useForm<Inputs>({defaultValues})
	const onSubmit: SubmitHandler<Inputs> = data => console.log(data)

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<div className="field">
				<span className="p-float-label">
					<Controller name="example" control={control} render={({ field, fieldState }) => (
						<InputText id={field.name} {...field} />
					)} />
					<label htmlFor="example" className={classNames({'p-error': errors.example})}>Example</label>
				</span>
			</div>
			<div className="field">
				<span className="p-float-label">
					<Controller name="exampleRequired" control={control} rules={{ required: 'This is required.' }} render={({ field, fieldState }) => (
						<InputText id={field.name} {...field} className={classNames({ 'p-invalid': fieldState.error })} />
					)} />
					<label htmlFor="exampleRequired" className={classNames({'p-error': errors.exampleRequired})}>Example</label>
				</span>
			</div>
			{errors.exampleRequired && <small className="p-error">{errors.exampleRequired.message}</small>}
			<input type="submit"/>
		</form>
	)
}
