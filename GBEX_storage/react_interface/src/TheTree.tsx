import React, { useState, useEffect } from 'react';
import { Tree, TreeNodeTemplateOptions } from 'primereact/tree';
import TreeNode from "primereact/treenode";
import { InputText } from 'primereact/inputtext';


const data = [
    {
        "key": "0",
        "label": "Documents",
        "data": "Documents Folder",
        "icon": "pi pi-fw pi-inbox",
        "children": [{
            "key": "0-0",
            "label": "Work",
            "data": "Work Folder",
            "icon": "pi pi-fw pi-cog",
            "children": [{ "key": "0-0-0", "label": "Expenses.doc", "icon": "pi pi-fw pi-file", "data": "Expenses Document" }, { "key": "0-0-1", "label": "Resume.doc", "icon": "pi pi-fw pi-file", "data": "Resume Document" }]
        },
        {
            "key": "0-1",
            "label": "Home",
            "data": "Home Folder",
            "icon": "pi pi-fw pi-home",
            "children": [{ "key": "0-1-0", "label": "Invoices.txt", "icon": "pi pi-fw pi-file", "data": "Invoices for this month" }]
        }]
    },
    {
        "key": "1",
        "label": "Events",
        "data": "Events Folder",
        "icon": "pi pi-fw pi-calendar",
        "children": [
            { "key": "1-0", "label": "Meeting", "icon": "pi pi-fw pi-calendar-plus", "data": "Meeting" },
            { "key": "1-1", "label": "Product Launch", "icon": "pi pi-fw pi-calendar-plus", "data": "Product Launch" },
            { "key": "1-2", "label": "Report Review", "icon": "pi pi-fw pi-calendar-plus", "data": "Report Review" }]
    },
    {
        "key": "2",
        "label": "Movies",
        "data": "Movies Folder",
        "icon": "pi pi-fw pi-star-fill",
        "children": [{
            "key": "2-0",
            "icon": "pi pi-fw pi-star-fill",
            "label": "Al Pacino",
            "data": "Pacino Movies",
            "children": [{ "key": "2-0-0", "label": "Scarface", "icon": "pi pi-fw pi-video", "data": "Scarface Movie" }, { "key": "2-0-1", "label": "Serpico", "icon": "pi pi-fw pi-video", "data": "Serpico Movie" }]
        },
        {
            "key": "2-1",
            "label": "Robert De Niro",
            "icon": "pi pi-fw pi-star-fill",
            "data": "De Niro Movies",
            "children": [{ "key": "2-1-0", "label": "Goodfellas", "icon": "pi pi-fw pi-video", "data": "Goodfellas Movie" }, { "key": "2-1-1", "label": "Untouchables", "icon": "pi pi-fw pi-video", "data": "Untouchables Movie" }]
        }]
    }
]


export default function TheTree(props: { tree_data: TreeNode[] }) {
	/*const renderTree = (nodes: { id: string, name: string, children: any }[]) => (
		nodes.map((node) => (
			<TreeItem key={node.id} nodeId={node.id} label={node.name} TransitionComponent={TransitionComponent} ContentComponent={EditTreeItem}>
				{Array.isArray(node.children) ? [
					renderTree(node.children),
					<TreeItem nodeId={node.id + "_newBox"} label={"New Box"} endIcon={<AddIcon/>}/>,
					<TreeItem nodeId={node.id + "_newLocation"} label={"New Location"} endIcon={<AddIcon/>}/>
				] : null}
			</TreeItem>))
	){renderTree(props.tree_data)}<TreeItem nodeId={"root_newLocation"} label={"New Location"} endIcon={<AddIcon/>}/>*/
    const [nodes, setNodes] = useState<TreeNode[]>(props.tree_data);
    const [editing, setEditing] = useState<string|number|undefined>("");

    const nodeTemplate = (node: TreeNode, options: TreeNodeTemplateOptions) => {
        if (node.key === editing) {
            return (
                <span className={options.className}>
                    <InputText defaultValue={node.label} />
                    <i onClick={(e) => setEditing("")} className={"pi pi-check"}
                       style={{fontSize: '1.5em', position: 'relative', left: '20px'}}/>
                </span>
            )
        } else {
            return (
                <span className={options.className}>
                    <b>{node.label}</b>
                    <i onClick={(e) => setEditing(node.key)} className={"pi pi-pencil"}
                       style={{fontSize: '1.5em', position: 'relative', left: '20px'}}/>
                </span>
            )
        }
    }

	return (
		<Tree
			style={{maxWidth: 400, overflowY: 'auto'}}
			dragdropScope="main_tree"
			value={props.tree_data}
            nodeTemplate={nodeTemplate}
            onDragDrop={event => {console.log(event); setNodes(event.value)}}
		/>
	);
}
