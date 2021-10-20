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

export default function TheTree(props: { BoxSelectFunc: (event: React.ChangeEvent<{}>, nodeIds: string) => void, tree_data: { id: string, name: string, children: any }[] }) {
	const {BoxSelectFunc, tree_data} = props
	const renderTree = (nodes: { id: string, name: string, children: any }[]) => (
		nodes.map((node) => (
			<TreeItem key={node.id} nodeId={node.id} label={node.name}>
				{Array.isArray(node.children) ? [
					renderTree(node.children),
					<TreeItem nodeId={node.id + "new_box"} label={"New Box"}/>,
					<TreeItem nodeId={node.id + "new_location"} label={"New Location"}/>
				] : null}
			</TreeItem>))
	)

	return (
		<TreeView
			style={classes.root}
			defaultCollapseIcon={<ExpandMoreIcon/>}
			defaultExpandIcon={<ChevronRightIcon/>}
			sx={{height: 110, flexGrow: 1, maxWidth: 400, overflowY: 'auto'}}
			onNodeSelect={BoxSelectFunc}
		>
			{renderTree(tree_data)}
		</TreeView>
	);
}
