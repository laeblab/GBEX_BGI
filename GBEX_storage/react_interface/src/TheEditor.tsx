import React, {useEffect, useState} from 'react'
import InnerHTML from 'dangerously-set-html-content'
import {getCookie} from "./index";

const form_style = {display: "inline-flex"};

export default function MyEditor(props: {selected_well: {id: number, name: string, pos: number}}) {
	//const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
	//	event.preventDefault();
	//	fetch(url, {method: 'post', credentials: 'include',	body: new FormData(event.currentTarget)})
	//		.then(res => res.json())
    //        .then(json => {
    //        })
	//		.catch(error => console.log(error));
	//}
	const [vial_content, setVialContent] = useState({content_object: {a:'a'}});

    useEffect(() => {
		if (props.selected_well.id !== -1) {
			fetch("/api/Vial/"+props.selected_well.id)
				.then(res => res.json())
				.then(json => setVialContent(json))
    }}, [props.selected_well.id])
	//return (
	//	<form onSubmit={handleSubmit} style={form_style}>
	//		<InnerHTML html={formtext} />
	//		<button type="submit">Update</button>
	//	</form>
	//)
	return (
		<div>
			{props.selected_well.name}
			<ul>
				{Object.entries(vial_content.content_object).map((([i,s]) => (<li>{i}:{s}</li>)))}
			</ul>
		</div>
	)
}