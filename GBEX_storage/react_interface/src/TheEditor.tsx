import React, {useEffect, useState} from 'react'
import {Vial} from './App'
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

export default function MyEditor(props: {selected_well: Vial}) {
	//const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
	//	event.preventDefault();
	//	fetch(url, {method: 'post', credentials: 'include',	body: new FormData(event.currentTarget)})
	//		.then(res => res.json())
    //        .then(json => {
    //        })
	//		.catch(error => console.log(error));
	//}
	const [vial_content, setVialContent] = useState<{content_object: {[key: string]: string | object}}>({content_object: {a:'a'}});

    useEffect(() => {
		if (props.selected_well.id !== -1) {
			fetch("http://127.0.0.1:8000/api/Vial/"+props.selected_well.id)
				.then(res => res.json())
				.then(json => setVialContent(json))
		} else {
			setVialContent({content_object: {a:'a'}})
		}}, [props.selected_well.id])
	//return (
	//	<form onSubmit={handleSubmit} style={form_style}>
	//		<InnerHTML html={formtext} />
	//		<button type="submit">Update</button>
	//	</form>
	//)
	const nono_names = ["id", "url","created","edited","archived"]
	return (
		<div>
			{props.selected_well.name}
			<ul> { object2ul(vial_content.content_object, nono_names) }	</ul>
		</div>
	)
}
