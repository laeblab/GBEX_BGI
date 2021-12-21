import React, {Dispatch, SetStateAction, SyntheticEvent, useEffect, useState} from 'react';
import {Tree, TreeDragDropParams, TreeNodeTemplateOptions, TreeSelectionKeys} from 'primereact/tree';
import TreeNode from "primereact/treenode";
import {InputText} from 'primereact/inputtext';
import {Button} from 'primereact/button';
import {Dropdown} from 'primereact/dropdown';
import {confirmDialog} from 'primereact/confirmdialog';
import {getCookie} from "./index";


export default function TheTree(props:{setBox: Dispatch<SetStateAction<{ vials: { name: string; id: number; }[]; rows: number; columns: number;}>>}) {
    const [nodes, setNodes] = useState<TreeNode[]>([])
	const [selectedKey, setSelectedKey] = useState<TreeSelectionKeys>("")
	//const [selectedNode, setSelectedNode] = useState<TreeNode>()
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

	const doApiCall = (key: string, body: {}, method='patch' ) => {
		let kind = 'Box'
		if (key.startsWith('loc')) { // we got a location
			kind = 'Location'
		}
		key = key.split('_').splice(1).join('_') // Location keys are written loc_key or box_key
		const requestHeaders: HeadersInit = new Headers();
		console.log("Find this line and revert it for production. Fantastic system I got here...")
		const csrftoken = "DEVELOPMENT" //getCookie('csrftoken')

		if (typeof csrftoken === 'string') {
			requestHeaders.set('X-CSRFToken', csrftoken)
			requestHeaders.set('Content-Type', 'application/json')
			let url = "http://127.0.0.1:8000/api/" + kind + "/"
			if (['patch', 'delete'].includes(method)) { url += key + "/" }
			fetch(url, {
				//mode: 'same-origin',
				method: method,
				body: JSON.stringify(body),
				headers: requestHeaders})
				.then(json => setStale(true)).catch(error => console.log(error))
		}
	}

	const doNewLocBox = () => {
		setNewChild(false)
		let body = {name: nameinput, parent: String(selectedKey).split('_').splice(1).join('_'), rows: 10, columns: 10}
		if (nameinput) { doApiCall(selectedNewType.code, body, "post")}
	}

	const doNameChange = () => {
		setEditing(false)
		if (nameinput) { doApiCall(String(selectedKey), {name: nameinput})}
	}

	const test = () : (number| string)[] => {
		return [1, 2, "3"]
	}

	const gather_the_children = (parent: TreeNode) : (TreeNode)[] => {
		if (parent.hasOwnProperty("children") && Array.isArray(parent.children) && parent.children.length > 0) {
			return parent.children.flatMap(c => {
				return [c, ...gather_the_children(c)]
			})
		} else return []
	}

	const order66 = (e: TreeNode) => {
		let hit_list = [e, ...gather_the_children(e)]
		console.log(hit_list)

		confirmDialog({
			message: (<span>{"You are about to delete " + hit_list.length + " items:"}<br />{hit_list.map(c => c.label).join(", ")}<br />{"Are you sure you want to proceed?"}</span>),
			header: 'Execute order 66?',
			icon: 'pi pi-exclamation-triangle',
			position: 'left',
			accept: () => doApiCall(String(selectedKey), {}, 'delete'),
		});
	}

	const doParentChange = (e: TreeDragDropParams) => {
		if (e.dropNode || String(e.dragNode.key).startsWith("loc_")) { // check if we have a parent and if we DONT then only allow locations to be dropped there
			setNodes(e.value) // optimistic update of gui
			let body = {parent: ""}
			if (e.dropNode) { body = {parent: String(e.dropNode.key).split('_').splice(1).join('_')}}
			confirmDialog({
				message: 'You are about to move ' + e.dragNode.label + ' into ' + e.dropNode.label + '. Are you sure you want to proceed?',
				header: 'Change location?',
				icon: 'pi pi-exclamation-triangle',
				position: 'left',
				accept: () => doApiCall(String(e.dragNode.key), body),
			});
		}
	}

    const nodeTemplate = (node: TreeNode, options: TreeNodeTemplateOptions) => {
		if (node.key === selectedKey) {
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
					<div style={{display: "flex", alignItems: 'center', justifyContent: "space-between", width: "100%"}}>
						<span className={options.className} style={{flexGrow: 2}}><b>{node.label}</b></span>
						<div style={{flexGrow: 2, display: "flex", justifyContent: "space-evenly"}}>
							<Button tooltip="Edit name" tooltipOptions={{position: 'top'}} onClick={e => {setNameInput(node.label); setEditing(true)}} icon={"pi pi-pencil"} className={"p-button-rounded p-button-text"} />
							<Button tooltip="Delete this...and all its children :(" tooltipOptions={{position: 'top'}} onClick={e => order66(node)} icon={"pi pi-times"} className={"p-button-rounded p-button-text"} />
							{String(selectedKey).startsWith("loc_") ? <Button tooltip="Add new box/location" tooltipOptions={{position: 'top'}} onClick={e => setNewChild(true)} icon={"pi pi-plus"} className={"p-button-rounded p-button-text"}/>: null}
						</div>
					</div>)
			}
		} else {return (<span className={options.className}><b>{node.label}</b></span>)}
    }

	return (
		<Tree
			style={{maxWidth: 400, overflowY: 'auto'}}
			dragdropScope="treedrop"
			selectionMode="single"
			value={nodes}
            nodeTemplate={nodeTemplate}
			filter={true}
			filterPlaceholder="Search for box or location"
			selectionKeys={selectedKey}
			onSelectionChange={e => {
				if (e.value !== selectedKey) {
					setEditing(false);
					setNewChild(false);
					setSelectedKey(e.value)
				}
			}}
			onSelect={e => {
				//setSelectedNode(e.node)
				if (e.node.hasOwnProperty('data')) {
					props.setBox(e.node.data)
				}
			}}
			onDragDrop={e => {doParentChange(e)}}
		/>
	);
}
