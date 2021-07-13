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

const data = {
	id: 'root',
	name: 'Parent',
	children: [
		{
			id: '1',
			name: 'Child - 1',
		},
		{
			id: '3',
			name: 'Child - 3',
			children: [
				{
					id: '4',
					name: 'Child - 4',
				},
			],
		},
	],
};

export default function TheTree(props: {tree_data: object}) {
	const handleSelect = (event: React.ChangeEvent<{}>, nodeIds: string[]) => {
		console.log(nodeIds)
	};
	const renderTree = (nodes: { id: string, name: string, children: any }) => (
		<TreeItem key={nodes.id} nodeId={nodes.id} label={nodes.name}>
			{Array.isArray(nodes.children)
				? nodes.children.map((node) => renderTree(node))
				: null}
		</TreeItem>
	);
	return (
		<TreeView
			style={classes.root}
			defaultCollapseIcon={<ExpandMoreIcon />}
			defaultExpandIcon={<ChevronRightIcon />}
			sx={{ height: 110, flexGrow: 1, maxWidth: 400, overflowY: 'auto' }}
			onNodeSelect={handleSelect}
		>
			{renderTree(data)}
		</TreeView>
	);
}


/*

export default function RichObjectTreeView() {


  return (
    <TreeView
      aria-label="rich object"
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpanded={['root']}
      defaultExpandIcon={<ChevronRightIcon />}
    >
      {renderTree(data)}
    </TreeView>
  );
}
 */
