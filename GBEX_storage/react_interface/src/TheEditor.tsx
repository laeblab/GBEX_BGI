import React, {useEffect, useState} from 'react'
import InnerHTML from 'dangerously-set-html-content'

const form_style = {display: "inline-flex"};

function handleSubmit(event: any) {
	fetch("http://127.0.0.1:8000/storage/editLocation/3", {
		method: 'post',
		credentials: 'include',
		body: new FormData(event.currentTarget)})
		.then(res => console.log(res))
		.catch(error => console.log(error));
	event.preventDefault();
}

export default function MyEditor() {
	const [formtext, setformtext] = useState("");
    useEffect(() => {
		fetch("http://127.0.0.1:8000/storage/editLocation/3", {credentials: 'include'})
			.then(res => res.text())
			.then(res => setformtext(res))
    }, [])
	return (
		<form onSubmit={handleSubmit} style={form_style}>
			<InnerHTML html={formtext} />
			<button type="submit">Update</button>
		</form>
	)
}