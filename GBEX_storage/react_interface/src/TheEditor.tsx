import React, {useEffect, useState} from 'react'
import InnerHTML from 'dangerously-set-html-content'
import {TreeType, BoxInfoType} from "./App";

const form_style = {display: "inline-flex"};

export default function MyEditor(props: {target_type: string, target_pk: string, setBoxInfo: React.Dispatch<React.SetStateAction<BoxInfoType>>, setMyTree: React.Dispatch<React.SetStateAction<TreeType[]>>;}) {
	let url = ""
	switch(props.target_type) {
		case 'loc':
			url = "editLocation/" + props.target_pk
			break
		case 'box':
			url = "editBox/" + props.target_pk
			break
		case 'vial':
			url = "editVial/" + props.target_pk
			break
		default:
			console.log("Error in TheEditor. Received unrecognized target type: '" + props.target_type + "'")
	}

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		fetch(url, {method: 'post', credentials: 'include',	body: new FormData(event.currentTarget)})
			.then(res => res.json())
            .then(json => {
                props.setBoxInfo(json.box_info)
                props.setMyTree(json.my_tree)
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
	)
}