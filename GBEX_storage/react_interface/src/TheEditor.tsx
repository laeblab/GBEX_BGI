import React, {useEffect, useState} from 'react'
import {Vials} from './App'
import InnerHTML from 'dangerously-set-html-content'
import {getCookie} from "./index";
import {Button} from "primereact/button";

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

export default function MyEditor(props: {selected_wells: Set<string>, vials: Vials}) {
	//const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
	//	event.preventDefault();
	//	fetch(url, {method: 'post', credentials: 'include',	body: new FormData(event.currentTarget)})
	//		.then(res => res.json())
    //        .then(json => {
    //        })
	//		.catch(error => console.log(error));
	//}
	const [vial_content, setVialContent] = useState<{content_object: {[key: string]: string | object | undefined}, name: string, description: string}>();
	//const [vial_ids, setVialIds] = useState<Set<string>>(() => new Set())

    useEffect(() => {
		// identify any non empty vials and see if they all target 1 ID.
		const real_vial_pos = new Set(Array.from(props.selected_wells).filter(pos => props.vials.hasOwnProperty(pos)))
		let vial_ids = []

		let vial_id = -1
		if (real_vials.size === 1) {
			vial_id = props.vials[real_vials.values().next().value].id
		}

		if (vial_id !== -1) {
			fetch("http://127.0.0.1:8000/api/Vial/"+vial_id+"/")
				.then(res => res.json())
				.then(json => setVialContent(json))
		} else {
			setVialContent(undefined)
		}}, [props])
	//return (
	//	<form onSubmit={handleSubmit} style={form_style}>
	//		<InnerHTML html={formtext} />
	//		<button type="submit">Update</button>
	//	</form>
	//)

	// generate right pane output

	const nono_names = ["id", "url","created","edited","archived"]
	let vial_html = null
	if (vial_content !== undefined) {
		vial_html = <ul><li>name:{vial_content.name}</li><li>description:{vial_content.description}</li>
			{ vial_content.content_object ? object2ul(vial_content.content_object, nono_names) : null}
		</ul>
	}
	return <ul>
		<li>Selected {props.selected_wells.size} position{props.selected_wells.size !== 1 ? "s": ""}.</li>
		{vial_html ? <li>{vial_html}</li>: <li>To see vial content, select 1 vial or multiple vials with same content.</li>}
		<Button>Set content of vial{props.selected_wells.size !== 1 ? "s": ""}</Button><Button>Delete selected vial{props.selected_wells.size !== 1 ? "s": ""}</Button>

	</ul>
}