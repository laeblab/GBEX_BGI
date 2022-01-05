import React, {useEffect, useState} from 'react'
import {Vials} from './App'
import InnerHTML from 'dangerously-set-html-content'
import {getCookie} from "./index";

const form_style = {display: "inline-flex"};

function object2ul(obj: object, no_no_words: string[]) {
	return Object.entries(obj).map((([i,s]) => {
		if (no_no_words.includes(i)) {
			return null
		} else if (typeof s === 'object' && s !== null) {
			return <li key={i}>{i}:<ul>{object2ul(s, no_no_words)}</ul></li>
		} else { return <li key={i}>{i}:{s}</li>}
	}))
}

export default function MyEditor(props: {selected_well: Vials}) {
	//const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
	//	event.preventDefault();
	//	fetch(url, {method: 'post', credentials: 'include',	body: new FormData(event.currentTarget)})
	//		.then(res => res.json())
    //        .then(json => {
    //        })
	//		.catch(error => console.log(error));
	//}
	const [vial_content, setVialContent] = useState<{content_object: {[key: string]: string | object | undefined}}>();
	const id = props.selected_well[Object.keys(props.selected_well)[0]].id

    useEffect(() => {
		if (id !== -1) {
			fetch("http://127.0.0.1:8000/api/Vial/"+id)
				.then(res => res.json())
				.then(json => setVialContent(json))
		} else {
			setVialContent(undefined)
		}}, [id])
	//return (
	//	<form onSubmit={handleSubmit} style={form_style}>
	//		<InnerHTML html={formtext} />
	//		<button type="submit">Update</button>
	//	</form>
	//)
	const nono_names = ["id", "url","created","edited","archived"]
	if (vial_content !== undefined) {
		return (
			<div>
				{props.selected_well.name}
				<ul> {object2ul(vial_content.content_object, nono_names)}    </ul>
			</div>
		)
	} else {
		return null
	}
}
