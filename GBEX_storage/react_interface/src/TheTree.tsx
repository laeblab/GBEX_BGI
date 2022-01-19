import React, {Dispatch, SetStateAction, useState } from 'react';
import {Tree, TreeDragDropParams, TreeNodeTemplateOptions} from 'primereact/tree';
import TreeNode from "primereact/treenode";
import {InputText} from 'primereact/inputtext';
import {Button} from 'primereact/button';
import {Dropdown} from 'primereact/dropdown';
import {confirmDialog} from 'primereact/confirmdialog';
import {getCookie} from "./index";
import { climb_tree, Vial } from "./App"


export default function TheTree(props:{setNodes: Dispatch<SetStateAction<TreeNode[]>>, nodes: TreeNode[], setStale: Dispatch<SetStateAction<boolean>>, setBox: (box_id: string) => void}) {
	const [treeKey, setTreeKey] = useState("")
	const [editing, setEditing] = useState("")
	const [nameinput, setNameInput] = useState<string|undefined>('')
	const [newBoxSize, setNewBoxSize] = useState([1,1]) // rows, columns
	const [newChild, setNewChild] = useState(false)
	const [selectedNewType, setSelectedNewType] = useState({ name: 'Box', code: 'box' })

	const newChildTypes = [
		{ name: 'Box', code: 'box' },
		{ name: 'Location', code: 'loc' },
	];

	const doApiCall = (key: string, body: {}, method='patch', kind="Box" ) => {
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
				.then(json => props.setStale(c => !c)).catch(error => console.log(error))
		}
	}

	const doNewLocBox = () => {
		setNewChild(false)
		if (nameinput) {
			let body = {name: nameinput, parent: treeKey.split('_').splice(1).join('_'), rows: 10, columns: 10}
			doApiCall(selectedNewType.code, body, "post")
		}
	}

	const doNameChange = () => {
		setEditing("")
		if (nameinput) { doApiCall(treeKey, {name: nameinput})}
	}

	const doBoxResize = () => {
		// check if this will delete any vials
		let vials = climb_tree(props.nodes, treeKey)
		let lost_vials: Vial[] = []
		if (vials && vials.hasOwnProperty("data") && vials.data.hasOwnProperty("vials")) {
			lost_vials = Object.values(vials.data.vials).filter((v ): v is Vial => {
					return Number((v as Vial).box_column) >= newBoxSize[1] || Number((v as Vial).box_row) >= newBoxSize[0]
			})
		}
		if (lost_vials) {
			confirmDialog({
				message: (
					<span>
						{"This resize will delete " + lost_vials.length + " vial"+(lost_vials.length !== 1?"s":"")+":"}<br />
						{lost_vials.map(c => String.fromCharCode('A'.charCodeAt(0)+Number((c as Vial).box_row))+(Number((c as Vial).box_column)+1)+":"+(c as Vial).name).join(", ")}<br />
						{"Are you sure you want to proceed?"}</span>),
				header: 'Execute order 66?',
				icon: 'pi pi-exclamation-triangle',
				position: 'left',
				accept: () => doApiCall(treeKey, {rows: newBoxSize[0], columns: newBoxSize[1]}),
			});
		} else {
			doApiCall(treeKey, {rows: newBoxSize[0], columns: newBoxSize[1]})
		}
		setEditing("")
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

		confirmDialog({
			message: (<span>{"You are about to delete " + hit_list.length + " item"+(hit_list.length !== 1?"s":"")+":"}<br />{hit_list.map(c => c.label).join(", ")}<br />{"Are you sure you want to proceed?"}</span>),
			header: 'Execute order 66?',
			icon: 'pi pi-exclamation-triangle',
			position: 'left',
			accept: () => {props.setBox(""); doApiCall(treeKey, {}, 'delete')},
		});
	}

	const doParentChange = (e: TreeDragDropParams) => {
		if (e.dropNode || String(e.dragNode.key).startsWith("loc_")) { // check if we have a parent and if we DONT then only allow locations to be dropped there
			props.setNodes(e.value) // optimistic update of gui
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
		if (node.key === treeKey) {
			if (editing === "edit_name") {
				return (
					<div className="p-inputgroup">
						<InputText value={nameinput} onInput={e => setNameInput(e.currentTarget.value)} />
						<Button onClick={() => {doNameChange(); node.label = nameinput;}} icon="pi pi-check" className="p-button-success"/>
						<Button onClick={e => setEditing("")} icon="pi pi-times" className="p-button-danger"/>
					</div>)
			} else if (editing === "edit_box_size") {
				return (
					<div className="p-formgroup-inline">
						<div className="p-field" style={{display:"flex", width:"100%"}}>
							<label htmlFor="nrn">Rows:</label>
							<input style={{width:"100%"}} id="nrn" type="number" value={newBoxSize[0]} min="1" onChange={e => setNewBoxSize([Number(e.currentTarget.value), newBoxSize[1]])}/>
						</div>
						<div className="p-field" style={{display:"flex", width:"100%"}}>
							<label htmlFor="ncn">Columns:</label>
							<input style={{width:"100%"}} id="ncn" type="number" value={newBoxSize[1]} min="1" onChange={e => setNewBoxSize([newBoxSize[0], Number(e.currentTarget.value)])}/>
						</div>
						<div className="p-field">
							<div className="p-inputgroup">
								<Button onClick={doBoxResize} icon="pi pi-check" className="p-button-success"/>
								<Button onClick={e => setEditing("")} icon="pi pi-times" className="p-button-danger"/>
							</div>
						</div>
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
							<Button tooltip="Edit name" tooltipOptions={{position: 'top'}} onClick={e => {setNameInput(node.label); setEditing("edit_name")}} icon={"pi pi-pencil"} className={"p-button-rounded p-button-text"} />
							<Button tooltip="Delete this...and all its children :(" tooltipOptions={{position: 'top'}} onClick={e => order66(node)} icon={"pi pi-times"} className={"p-button-rounded p-button-text"} />
							{treeKey.startsWith("loc_") ?
								<Button tooltip="Add new box/location" tooltipOptions={{position: 'top'}} onClick={e => setNewChild(true)} icon={"pi pi-plus"} className={"p-button-rounded p-button-text"}/>:
								<Button tooltip="Resize box" tooltipOptions={{position: 'top'}} onClick={e => {setNewBoxSize([node.data.rows, node.data.columns]); setEditing("edit_box_size")}} icon={"pi pi-plus"} className={"p-button-rounded p-button-text"}/>
							}
						</div>
					</div>)
			}
		} else {return (<span className={options.className}><b>{node.label}</b></span>)}
    }

	return (<Tree
				style={{maxWidth: 400, overflowY: 'auto'}}
				dragdropScope="treedrop"
				selectionMode="single"
				value={props.nodes}
				nodeTemplate={nodeTemplate}
				filter={true}
				filterPlaceholder="Search for box or location"
				selectionKeys={treeKey}
				onSelectionChange={e => {
					if (e.value !== treeKey) {
						setEditing("");
						setNewChild(false);
					}
					setTreeKey(String(e.value))
					if (String(e.value).startsWith('box')) props.setBox(String(e.value))
				}}
				onDragDrop={e => {doParentChange(e)}}
			/>
	);
}
