import React, {useState} from 'react';
import TreeView from '@mui/lab/TreeView';
import { TransitionProps } from '@mui/material/transitions';
import { useSpring, animated } from 'react-spring'
import Collapse from '@mui/material/Collapse';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import GridOnIcon from '@mui/icons-material/GridOn';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import Typography from '@mui/material/Typography';
import TreeItem, { useTreeItem, TreeItemContentProps,} from '@mui/lab/TreeItem';
import clsx from 'clsx';
import TextField from '@mui/material/TextField';
import Input from '@mui/material/Input';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

function TransitionComponent(props: TransitionProps) {
  const style = useSpring({
    from: {
      opacity: 0,
      transform: 'translate3d(20px,0,0)',
    },
    to: {
      opacity: props.in ? 1 : 0,
      transform: `translate3d(${props.in ? 0 : 20}px,0,0)`,
    },
  });

  return (
    <animated.div style={style}>
      <Collapse {...props} />
    </animated.div>
  );
}

const EditTreeItem = React.forwardRef(
	function EditTreeItem(props: TreeItemContentProps, ref,) {
		const { classes, className, label, nodeId, icon: iconProp, expansionIcon, displayIcon, } = props;
		const { disabled, expanded, selected, focused, handleExpansion, handleSelection, preventSelection, } = useTreeItem(nodeId);
		const icon = iconProp || expansionIcon || displayIcon;
		const handleMouseDown = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {preventSelection(event);};
		const handleExpansionClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>,) => {handleExpansion(event);};
		const handleSelectionClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>,) => {handleSelection(event);};
		const [editActive, setEditActive] = useState(false)

		return (
			<div
				className={clsx(className, classes.root, {[classes.expanded]: expanded, [classes.selected]: selected, [classes.focused]: focused, [classes.disabled]: disabled, })}
				onMouseDown={handleMouseDown}
				ref={ref as React.Ref<HTMLDivElement>}
			>
				<div onClick={handleExpansionClick} className={classes.iconContainer}>{icon}</div>
				{editActive ?
					<div>
						<Input defaultValue={label} />
						<CheckCircleIcon/><CancelIcon/>
					</div> :
					<Typography variant='h6' onClick={handleSelectionClick} component="div" className={classes.label}>{label}
						<EditIcon onClick={(e) => {setEditActive(true)}} />
					</Typography>
				}
			</div>
		);
});

export default function TheTree(props: { NodeSelectFunc: (nodeIds: string) => void, tree_data: { id: string, name: string, children: any }[] }) {
	const {NodeSelectFunc, tree_data} = props
	const [expanded, setExpanded] = React.useState<string[]>([]);
  	const [selected, setSelected] = React.useState<string[]>([]);
  	const handleToggle = (event: React.SyntheticEvent, nodeIds: string[]) => {setExpanded(nodeIds);};
	const handleSelect = (event: React.SyntheticEvent, nodeIds: string[]) => {
		setSelected(nodeIds);
		// TreeView supports multi-select and can return an array of string
		// But its not activated right now, so this should just return a single string
		if (Array.isArray(nodeIds)) {
			console.log("Hmm. tree select gave an array? " + nodeIds)
		} else {
			NodeSelectFunc(nodeIds);
		}
	};

	const renderTree = (nodes: { id: string, name: string, children: any }[]) => (
		nodes.map((node) => (
			<TreeItem key={node.id} nodeId={node.id} label={node.name} TransitionComponent={TransitionComponent} ContentComponent={EditTreeItem}>
				{Array.isArray(node.children) ? [
					renderTree(node.children),
					<TreeItem nodeId={node.id + "_newBox"} label={"New Box"} endIcon={<AddIcon/>}/>,
					<TreeItem nodeId={node.id + "_newLocation"} label={"New Location"} endIcon={<AddIcon/>}/>
				] : null}
			</TreeItem>))
	)

	return (
		<TreeView
			defaultCollapseIcon={<ExpandMoreIcon/>}
			defaultExpandIcon={<ChevronRightIcon/>}
			defaultEndIcon={<GridOnIcon/>}
			sx={{height: "100%", flexGrow: 1, maxWidth: 400, overflowY: 'auto'}}
			expanded={expanded}
        	selected={selected}
        	onNodeToggle={handleToggle}
        	onNodeSelect={handleSelect}
		>
			{renderTree(tree_data)}
			<TreeItem nodeId={"root_newLocation"} label={"New Location"} endIcon={<AddIcon/>}/>
		</TreeView>
	);
}
