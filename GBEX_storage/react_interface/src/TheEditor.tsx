import React, {useEffect, useState} from 'react'
import InnerHTML from 'dangerously-set-html-content'

const form_style = {display: "inline-flex"};

export default function MyEditor(props: {selected_well: {id: number, name: string, pos: number}}) {
	/*const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		fetch(url, {method: 'post', credentials: 'include',	body: new FormData(event.currentTarget)})
			.then(res => res.json())
            .then(json => {
            })
			.catch(error => console.log(error));
	}
	const [formtext, setformtext] = useState("");
    useEffect(() => {
		fetch(url, {credentials: 'include'})
			.then(res => res.text())
			.then(res => setformtext(res))
    }, [url])
	return (
		<form onSubmit={handleSubmit} style={form_style}>
			<InnerHTML html={formtext} />
			<button type="submit">Update</button>
		</form>
	)*/
	return (
		<div>
			{props.selected_well.name}
		</div>
	)
}