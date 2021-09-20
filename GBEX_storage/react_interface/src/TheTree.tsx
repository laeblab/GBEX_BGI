import React from 'react';
import TreeView from '@material-ui/lab/TreeView';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import TreeItem from '@material-ui/lab/TreeItem';

const classes = {
	root: {
		height: 240,
		flexGrow: 1,
		maxWidth: 400,
	},
}

export default function TheTree(props: {BoxSelectFunc: (event: React.ChangeEvent<{}>, nodeIds: string) => void, tree_data: [id: string, name:string, children: any]}) {
	const { BoxSelectFunc, tree_data } = props
	const renderTree = (nodes: [ id: string, name: string, children: any ]) => (
		<TreeItem key={"root"} nodeId={"root"} label={"root"}>
			{
				nodes.map((node) => (
					<TreeItem key={node.id} nodeId={node.id} label={node.name}>
						{Array.isArray(node.children) ? node.children.map((snode: [ id: string, name: string, children: any ]) => renderTree(snode)) : null}
					</TreeItem>
				))
			}
		</TreeItem>
	);
	/*
	const renderTree = (nodes: [ id: string, name: string, children: any ]) => (
		<TreeItem key={nodes.id} nodeId={nodes.id} label={nodes.name}>
			{Array.isArray(nodes.children)
				? nodes.children.map((node) => renderTree(node))
				: null}
		</TreeItem>
	);
	*/
	return (
		<TreeView
			style={classes.root}
			defaultCollapseIcon={<ExpandMoreIcon />}
			defaultExpandIcon={<ChevronRightIcon />}
			sx={{ height: 110, flexGrow: 1, maxWidth: 400, overflowY: 'auto' }}
			onNodeSelect={BoxSelectFunc}
		>
			{renderTree(tree_data)}
		</TreeView>
	);
}
