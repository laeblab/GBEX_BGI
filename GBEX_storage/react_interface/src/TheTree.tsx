import React, { useState, useEffect } from 'react';
import { Tree, TreeNodeTemplateOptions, TreeSelectionKeys, TreeDragDropParams } from 'primereact/tree';
import TreeNode from "primereact/treenode";
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';

function getCookie(name: string){
	let cookieValue = null;
	if (document.cookie && document.cookie !== '') {
		const cookies = document.cookie.split(';');
		for (let i = 0; i < cookies.length; i++) {
			const cookie = cookies[i].trim();
			// Does this cookie string begin with the name we want?
			if (cookie.substring(0, name.length + 1) === (name + '=')) {
				cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
				break;
			}
		}
	}
	return cookieValue;
}


export default function TheTree() {
    const [nodes, setNodes] = useState<TreeNode[]>([])
	const [selected, setSelected] = useState<TreeSelectionKeys>("")
	const [editing, setEditing] = useState(false)
	const [nameinput, setNameInput] = useState<string|undefined>('')
	const [staleTree, setStale] = useState(false)

    useEffect(() => {
		// edit link
        fetch("http://127.0.0.1:8000/storage/locsNboxs", {credentials: 'include'})
            .then(res => res.json())
            .then(json => { setNodes(json.tree); setStale(false) })
            .catch(error => console.log(error))
    }, [staleTree])

	const doNameChange = () => {
		let kind = 'Box'
		let key = selected
		if (typeof selected === 'string' && selected.startsWith('loc')) {
			// we got a location
			kind = 'Location'
			key = selected.split('_').splice(1).join('_') // Location keys are written loc_key
		}
		const requestHeaders: HeadersInit = new Headers();
		const csrftoken = getCookie('csrftoken')
		if (typeof csrftoken === 'string') {
			requestHeaders.set('X-CSRFToken', csrftoken)
			requestHeaders.set('Content-Type', 'application/json')
			fetch("http://127.0.0.1:8000/api/" + kind + "/" + key + "/", {
				mode: 'same-origin',
				method: 'patch',
				body: JSON.stringify({name: nameinput}),
				headers: requestHeaders})
				.then(json => setStale(true)).catch(error => console.log(error))
		}
		setEditing(false)
	}

	const doParentChange = (e: TreeDragDropParams) => {
		console.log(e);
		setNodes(e.value) // optimistic update of gui
		let child = e.dragNode.key
		let new_parent = e.dropNode.key

		let kind = 'Box'
		let key = child
		if (typeof key === 'string' && key.startsWith('loc')) {
			// we got a location
			kind = 'Location'
			key = key.split('_').splice(1).join('_') // Location keys are written loc_key
		}

		const requestHeaders: HeadersInit = new Headers();
		const csrftoken = getCookie('csrftoken')
		if (typeof csrftoken === 'string') {
			requestHeaders.set('X-CSRFToken', csrftoken)
			requestHeaders.set('Content-Type', 'application/json')
			fetch("http://127.0.0.1:8000/api/" + kind + "/" + key + "/", {
				mode: 'same-origin',
				method: 'patch',
				body: JSON.stringify({name: nameinput}),
				headers: requestHeaders})
				.then(json => setStale(true)).catch(error => console.log(error))
		}
		setEditing(false)

	}

    const nodeTemplate = (node: TreeNode, options: TreeNodeTemplateOptions) => {
        if (node.key === selected) {
			if (editing) {
				return (
					<div className="p-inputgroup">
						<InputText value={nameinput} onInput={e => setNameInput(e.currentTarget.value)} />
						<Button onClick={() => {doNameChange(); node.label = nameinput;}} icon="pi pi-check" className="p-button-success"/>
						<Button onClick={e => setEditing(false)} icon="pi pi-times" className="p-button-danger"/>
					</div>
					)
			} else {
				return (
					<span className={options.className}>
						<b>{node.label}</b>
						<i onClick={e => {setNameInput(node.label); setEditing(true)}} className={"pi pi-pencil"} style={{fontSize: '1.5em', position: 'relative', left: '20px'}}/>
						<i className={"pi pi-times p-button-dange"} style={{fontSize: '1.5em', position: 'relative', left: '20px'}}/>
					</span>)
			}
		} else {return (<span className={options.className}><b>{node.label}</b></span>)}
    }

	return (
		<Tree
			style={{maxWidth: 400, overflowY: 'auto'}}
			dragdropScope="treedrop"
			selectionMode={"single"}
			value={nodes}
            nodeTemplate={nodeTemplate}
			filter={true}
			selectionKeys={selected}
			onSelectionChange={e => {if (e.value !== selected) {setEditing(false); setSelected(e.value)}}}
			onDragDrop={e => {doParentChange(e)}}
		/>
	);
}
