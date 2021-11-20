import React, { useState, useEffect } from 'react';
import { Tree, TreeNodeTemplateOptions, TreeSelectionKeys, TreeDragDropParams } from 'primereact/tree';
import TreeNode from "primereact/treenode";
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';

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

	const [newChild, setNewChild] = useState(false)
	const [selectedNewType, setSelectedNewType] = useState({ name: 'Box', code: 'box' })

	const newChildTypes = [
		{ name: 'Box', code: 'box' },
		{ name: 'Location', code: 'loc' },
	];

    useEffect(() => {
		// edit link
        fetch("http://127.0.0.1:8000/storage/locsNboxs", {credentials: 'include'})
            .then(res => res.json())
            .then(json => { setNodes(json.tree); setStale(false) })
            .catch(error => console.log(error))
    }, [staleTree])

	const doApiPatch = (key: string, body: {}, method='patch' ) => {
		let kind = 'Box'
		if (key.startsWith('loc')) { // we got a location
			kind = 'Location'
			key = key.split('_').splice(1).join('_') // Location keys are written loc_key
		}
		const requestHeaders: HeadersInit = new Headers();
		const csrftoken = getCookie('csrftoken')
		if (typeof csrftoken === 'string') {
			requestHeaders.set('X-CSRFToken', csrftoken)
			requestHeaders.set('Content-Type', 'application/json')
			let url = "http://127.0.0.1:8000/api/" + kind + "/"
			if (method === 'patch') { url += key + "/" }
			fetch(url, {
				mode: 'same-origin',
				method: method,
				body: JSON.stringify(body),
				headers: requestHeaders})
				.then(json => setStale(true)).catch(error => console.log(error))
		}
	}

	const doNewLocBox = () => {
		setNewChild(false)
		let body = {name: nameinput, parent: String(selected).split('_').splice(1).join('_'), rows: 10, columns: 10}
		if (nameinput) { doApiPatch(selectedNewType.code, body, "post")}
	}

	const doNameChange = () => {
		setEditing(false)
		if (nameinput) { doApiPatch(String(selected), {name: nameinput})}
	}

	const doParentChange = (e: TreeDragDropParams) => {
		if (e.dropNode || String(e.dragNode.key).startsWith("loc_")) { // check if we have a parent and if we DONT then only allow locations to be dropped there
			setNodes(e.value) // optimistic update of gui
			let body = {parent: ""}
			if (e.dropNode) {
				body = {parent: String(e.dropNode.key).split('_').splice(1).join('_')}
			}
			doApiPatch(String(e.dragNode.key), body)
		}
	}

    const nodeTemplate = (node: TreeNode, options: TreeNodeTemplateOptions) => {
        if (node.key === selected) {
			if (editing) {
				return (
					<div className="p-inputgroup">
						<InputText value={nameinput} onInput={e => setNameInput(e.currentTarget.value)} />
						<Button onClick={() => {doNameChange(); node.label = nameinput;}} icon="pi pi-check" className="p-button-success"/>
						<Button onClick={e => setEditing(false)} icon="pi pi-times" className="p-button-danger"/>
					</div>)
			} else if (newChild) {
				return (
					<div className="p-formgroup-inline">
						<div className="p-field">
							<Dropdown value={selectedNewType} options={newChildTypes} optionLabel="name" onChange={e => setSelectedNewType(e.value)} />
						</div>
						<div className="p-field">
							<div className="p-inputgroup">
								<InputText value={nameinput} placeholder="Name it!" onInput={e => setNameInput(e.currentTarget.value)} />
								<Button onClick={e => doNewLocBox()} icon="pi pi-check" className="p-button-success"/>
								<Button onClick={e => setNewChild(false)} icon="pi pi-times" className="p-button-danger"/>
							</div>
						</div>
					</div>)
			} else {
				return (
					<div className={options.className} style={{display: "flex", justifyContent: "space-between", width: "100%"}}>
						<span style={{flexGrow: 2}}><b>{node.label}</b></span>
						<div style={{flexGrow: 2, display: "flex", justifyContent: "space-evenly"}}>
							<Button tooltip="Edit name" tooltipOptions={{position: 'top'}} onClick={e => {setNameInput(node.label); setEditing(true)}} icon={"pi pi-pencil"} className={"p-button-rounded p-button-text"} />
							<Button tooltip="Delete this...and all its children :(" tooltipOptions={{position: 'top'}} icon={"pi pi-times"} className={"p-button-rounded p-button-text"} />
							{String(selected).startsWith("loc_") ? <Button tooltip="Add new box/location" tooltipOptions={{position: 'top'}} onClick={e => setNewChild(true)} icon={"pi pi-plus"} className={"p-button-rounded p-button-text"}/>: null}
						</div>
					</div>)
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
			onSelectionChange={e => {if (e.value !== selected) {setEditing(false); setNewChild(false); setSelected(e.value)}}}
			onDragDrop={e => {doParentChange(e)}}
		/>
	);
}
