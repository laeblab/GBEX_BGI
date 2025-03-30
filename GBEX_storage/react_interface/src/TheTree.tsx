import React, { Dispatch, SetStateAction, useState } from 'react';
import { Tree, TreeDragDropEvent, TreeNodeTemplateOptions } from 'primereact/tree';
import { TreeNode } from "primereact/treenode";
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { confirmDialog } from 'primereact/confirmdialog';
import { Vial } from "./App"
import { climb_tree, doApiCall } from "./helpers"


export default function TheTree(props:{nodes: TreeNode[], setBox: (box_id: string) => void, setStale: Dispatch<SetStateAction<boolean>>}) {
	const { nodes, setBox, setStale } = props
	const [treeKey, setTreeKey] = useState("")
	const [editing, setEditing] = useState("")
	const [nameInput, setNameInput] = useState<string|undefined>('')
	const [newBoxSize, setNewBoxSize] = useState([1,1]) // rows, columns
	const [newChild, setNewChild] = useState(false)
	const [selectedNewType, setSelectedNewType] = useState<"Box"|"Location">("Box")

	const treeKey2kindNid = () : [string, "Box"|"Location"] => {
		let [kind, id] = treeKey.split('_')  // tree keys are "Box_id" or "Loc_id"
		const actual_kind = kind === 'box' ? "Box" : "Location"
		return [id, actual_kind]
	}

	const doNewLocBox = () => {
		setNewChild(false)
		if (nameInput) {
			const body = {name: nameInput, parent: treeKey.split('_').splice(1).join('_'), rows: 10, columns: 10}
			doApiCall("", selectedNewType, "POST", body).then(() => setStale(c => !c))
		}
	}

	const doNameChange = () => {
		setEditing("")
		const [id, kind] = treeKey2kindNid()
		if (nameInput) { doApiCall(id, kind, "PATCH", {name: nameInput}).then(() => setStale(c => !c))}
	}

	const doBoxResize = () => {
		// check if this will delete any vials
		let vials = climb_tree(nodes, treeKey)
		let lost_vials: Vial[] = []
		if (vials && vials.hasOwnProperty("data") && vials.data.hasOwnProperty("vials")) {
			lost_vials = Object.values(vials.data.vials).filter((v ): v is Vial => {
					return Number((v as Vial).box_column) >= newBoxSize[1] || Number((v as Vial).box_row) >= newBoxSize[0]
			})
		}
		const [id, kind] = treeKey2kindNid()
		if (lost_vials.length !== 0) {
			confirmDialog({
				message: (
					<span>
						{"This resize will delete " + lost_vials.length + " vial"+(lost_vials.length !== 1?"s":"")+":"}<br />
						{lost_vials.map(c => String.fromCharCode('A'.charCodeAt(0)+Number((c as Vial).box_row))+(Number((c as Vial).box_column)+1)+":"+(c as Vial).label).join(", ")}<br />
						{"Are you sure you want to proceed?"}</span>),
				header: 'Execute order 66?',
				icon: 'pi pi-exclamation-triangle',
				position: 'left',
				accept: () => doApiCall(id, "Box", "PATCH", {rows: newBoxSize[0], columns: newBoxSize[1]}).then(() => setStale(c => !c)),
			});
		} else {
			doApiCall(id, "Box", "PATCH", {rows: newBoxSize[0], columns: newBoxSize[1]}).then(() => setStale(c => !c))
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

		const [id, kind] = treeKey2kindNid()
		confirmDialog({
			message: <span>You are about to delete {hit_list.length} item{hit_list.length !== 1?"s":""}:<br />{hit_list.map(c => c.label).join(", ")}<br />Are you sure you want to proceed?</span>,
			header: 'Execute order 66?',
			icon: 'pi pi-exclamation-triangle',
			position: 'left',
			accept: () => {setBox(""); doApiCall(id, kind, "DELETE", {}).then(() => setStale(c => !c))},
		});
	}

	const doParentChange = (e: TreeDragDropEvent) => {
		let [kind, id] = String(e.dragNode.key).split('_')  // tree keys are "Box_id" or "Loc_id"
		const actual_kind = kind === 'box' ? "Box" : "Location"
		if (e.dropNode || kind === 'loc') { // check if we have a parent and if we DONT then only allow locations to be dropped there
			let body = {parent: ""}
			if (e.dropNode) { body = {parent: String(e.dropNode.key).split('_').splice(1).join('_')}}
			let edropnodelabel = "the root"
			if (e.dropNode !== null) {
				edropnodelabel = String(e.dropNode.label)
			}
			confirmDialog({
				message: 'You are about to move ' + e.dragNode.label + ' into ' + edropnodelabel + '. Are you sure you want to proceed?',
				header: 'Change location?',
				icon: 'pi pi-exclamation-triangle',
				position: 'left',
				accept: () => doApiCall(id, actual_kind, "PATCH", body).then(() => setStale(c => !c)),
			});
		}
	}

    const nodeTemplate = (node: TreeNode, options: TreeNodeTemplateOptions) => {
		if (node.key === treeKey) {
			if (editing === "edit_name") {
				return (
					<div className="p-inputgroup">
						<InputText value={nameInput} onInput={e => setNameInput(e.currentTarget.value)} />
						<Button onClick={() => doNameChange()} icon="pi pi-check" className="p-button-success"/>
						<Button onClick={() => setEditing("")} icon="pi pi-times" className="p-button-danger"/>
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
								<Button onClick={() => setEditing("")} icon="pi pi-times" className="p-button-danger"/>
							</div>
						</div>
					</div>)
			} else if (newChild) {
				return (
					<div onClick={(e) => e.stopPropagation()}>
					<div className="p-formgroup-inline">
						<div className="p-field">
							<Dropdown
								value={{name: selectedNewType, code: selectedNewType}}
								options={[{name: "Box", code: "Box"}, {name: "Location", code: "Location"}]} optionLabel="name"
								onChange={e => setSelectedNewType(e.value.name)}
							/>
						</div>
						<div className="p-field">
							<div className="p-inputgroup">
								<InputText value={nameInput} placeholder="Name it!" onInput={e => setNameInput(e.currentTarget.value)} />
								<Button onClick={doNewLocBox} icon="pi pi-check" className="p-button-success"/>
								<Button onClick={() => setNewChild(false)} icon="pi pi-times" className="p-button-danger"/>
							</div>
						</div>
					</div>
					</div>)
			} else {
				return (
					<div style={{display: "flex", alignItems: 'center', justifyContent: "space-between", width: "100%"}}>
						<span className={options.className} style={{flexGrow: 2}}><b>{node.label} {node?.data?.usage ? node.data.usage : null}</b></span>
						<div style={{flexGrow: 2, display: "flex", justifyContent: "space-evenly"}}>
							<Button tooltip="Edit name" tooltipOptions={{position: 'top'}} onClick={() => {setNameInput(node.label); setEditing("edit_name")}} icon={"pi pi-pencil"} className={"p-button-rounded p-button-text"} />
							<Button tooltip="Delete this...and all its children :(" tooltipOptions={{position: 'top'}} onClick={() => order66(node)} icon={"pi pi-times"} className={"p-button-rounded p-button-text"} />
							{treeKey.startsWith("loc_") ?
								<Button tooltip="Add new box/location" tooltipOptions={{position: 'top'}} onClick={() => setNewChild(true)} icon={"pi pi-plus"} className={"p-button-rounded p-button-text"}/>:
								<Button tooltip="Resize box" tooltipOptions={{position: 'top'}} onClick={() => {setNewBoxSize([node.data.rows, node.data.columns]); setEditing("edit_box_size")}} icon={"pi pi-plus"} className={"p-button-rounded p-button-text"}/>
							}
						</div>
					</div>)
			}
		} else {return (<span className={options.className}><b>{node.label} {node?.data?.usage ? node.data.usage : null}</b></span>)}
    }

	return <Tree
				dragdropScope="treedrop"
				selectionMode="single"
				value={nodes}
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
					if (String(e.value).startsWith('box')) setBox(String(e.value))
				}}
				onDragDrop={e => {doParentChange(e)}}
			/>
}
