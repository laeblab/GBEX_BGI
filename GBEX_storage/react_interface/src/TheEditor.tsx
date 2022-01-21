import React, {useEffect, useState} from 'react'
import {Vials} from './App'
import InnerHTML from 'dangerously-set-html-content'
import {Button} from "primereact/button";
import {confirmDialog} from "primereact/confirmdialog";

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

export default function MyEditor(props: {selected_wells: Set<string>, vials: Vials, apiCall: (id: string|number, kind: "Location"|"Box"|"Vial", method: "get"|"post"|"patch"|"delete", body: object) => object}) {
	//const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
	//	event.preventDefault();
	//	fetch(url, {method: 'post', credentials: 'include',	body: new FormData(event.currentTarget)})
	//		.then(res => res.json())
    //        .then(json => {
    //        })
	//		.catch(error => console.log(error));
	//}
	const [vial_content, setVialContent] = useState<{content_object: {[key: string]: string | object | undefined}, name: string, description: string}>();
	const plural = props.selected_wells.size !== 1 ? "s": ""
	let vial_ids: Set<number|undefined> = new Set(Array.from(props.selected_wells).map(pos => props.vials[pos]?.id))
	vial_ids.delete(undefined)
	let show_id = -1 // if theres just 1 selected vial and its not undefined, then show it
	if (vial_ids.size === 1) {
		show_id = vial_ids.values().next().value
	}

	useEffect(() => {
		if (show_id !== -1) {
			fetch("http://127.0.0.1:8000/api/Vial/"+show_id+"/")
				.then(res => res.json())
				.then(json => setVialContent(json))
		} else {
			setVialContent(undefined)
		}}, [show_id])
	//return (
	//	<form onSubmit={handleSubmit} style={form_style}>
	//		<InnerHTML html={formtext} />
	//		<button type="submit">Update</button>
	//	</form>
	//)

	// generate right pane output
	const delete_vials = () => {
		confirmDialog({
			message: (<span>You are about to delete {vial_ids.size} vial{plural}<br />Are you sure you want to proceed?</span>),
			header: 'Delete vials?',
			icon: 'pi pi-exclamation-triangle',
			position: 'left',
			accept: () => {
				Array.from(vial_ids).map((e) => {
					props.apiCall(String(e), "Vial", "delete", {})
				})
			},
		});
	}

	const nono_names = ["id", "url","created","edited","archived"]
	let vial_html = null
	if (vial_content !== undefined) {
		vial_html = <ul><li>name:{vial_content.name}</li><li>description:{vial_content.description}</li>
			{ vial_content.content_object ? object2ul(vial_content.content_object, nono_names) : null}
		</ul>
	}

	return <ul>
		<li>Selected {props.selected_wells.size} position{plural}.</li>
		{vial_html ? <li>{vial_html}</li>: <li>To see vial content, select only 1 vial.</li>}
		<Button>Set content of vial{plural}</Button>
		<Button onClick={delete_vials}>Delete selected vial{plural}</Button>
	</ul>
}
