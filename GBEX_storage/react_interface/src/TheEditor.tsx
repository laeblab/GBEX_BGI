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

export default function MyEditor(props: {selected_wells: Set<string>, vials: Vials, apiCall: (key: string, body: {}, method?:string, kind?: string ) => void}) {
	//const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
	//	event.preventDefault();
	//	fetch(url, {method: 'post', credentials: 'include',	body: new FormData(event.currentTarget)})
	//		.then(res => res.json())
    //        .then(json => {
    //        })
	//		.catch(error => console.log(error));
	//}
	const [vial_content, setVialContent] = useState<{content_object: {[key: string]: string | object | undefined}, name: string, description: string}>();
	const [vial_id, setVialId] = useState(-1)

	useEffect(() => {
		const vial_ids = new Set(Array.from(props.selected_wells).map(pos => props.vials[pos]?.id))
		if (vial_ids.size === 1 && vial_ids.values().next().value !== undefined) {
			if (vial_ids.values().next().value !== vial_id) {
				setVialId(vial_ids.values().next().value)
			}
		}
	}, [props.selected_wells, props.vials])

	useEffect(() => {
		if (vial_id !== -1) {
			fetch("http://127.0.0.1:8000/api/Vial/"+vial_id+"/")
				.then(res => res.json())
				.then(json => setVialContent(json))
		} else {
			setVialContent(undefined)
		}}, [vial_id])
	//return (
	//	<form onSubmit={handleSubmit} style={form_style}>
	//		<InnerHTML html={formtext} />
	//		<button type="submit">Update</button>
	//	</form>
	//)

	// generate right pane output
	const delete_vials = () => {
		props.apiCall()
	}
	const nono_names = ["id", "url","created","edited","archived"]
	let vial_html = null
	if (vial_content !== undefined) {
		vial_html = <ul><li>name:{vial_content.name}</li><li>description:{vial_content.description}</li>
			{ vial_content.content_object ? object2ul(vial_content.content_object, nono_names) : null}
		</ul>
	}
	const plural = props.selected_wells.size !== 1 ? "s": ""
	return <ul>
		<li>Selected {props.selected_wells.size} position{plural}.</li>
		{vial_html ? <li>{vial_html}</li>: <li>To see vial content, select only 1 vial.</li>}
		<Button>Set content of vial{plural}</Button>
		<Button>Delete selected vial{plural}</Button>

	</ul>
}
