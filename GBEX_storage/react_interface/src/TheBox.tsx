import React, { Dispatch, SetStateAction } from 'react';
import {Box} from "./App"
import SelectionArea, {SelectionEvent} from '@viselect/react';


export default function TheBox(props: {selected_wells: Set<string>, setSelectedWells: Dispatch<SetStateAction<Set<string>>>, box_info: Box, height: number, width: number}) {
	const {box_info, height, width} = props
	const limw = width/box_info.columns
	const limh = height/box_info.rows

	let square_size = {
		height: width / box_info.columns,
		width: width / box_info.columns
	}
	if (limh < limw) {
		square_size = {
			height: height / box_info.rows,
			width: height / box_info.rows
		}
	}

	const extractIds = (els: Element[]): string[] => els.map(v => v.getAttribute('data-key')).filter(Boolean).map(String);

	const onStart = ({event, selection}: SelectionEvent) => {
		if (!event?.ctrlKey && !event?.metaKey) {
			selection.clearSelection();
			props.setSelectedWells(() => new Set());
		}
	};

	const onMove = ({store: {changed: {added, removed}}}: SelectionEvent) => {
		props.setSelectedWells(prev => {
			const next = new Set(prev);
			extractIds(added).forEach(id => next.add(id));
			extractIds(removed).forEach(id => next.delete(id));
			return next;
		});
	};

	return (
			<SelectionArea className="container" onStart={onStart} onMove={onMove} selectables=".selectable">
				{[...Array(box_info.rows)].map((e, row) => {
					return (
						<div style={{display: "flex", flexGrow: 1}} key={row}>
							{[...Array(box_info.columns)].map((ee, column) => {
								const coord = String.fromCharCode('A'.charCodeAt(0)+row)+(column+1)
								let a = {id:-1, name:coord}
								if (box_info.vials.hasOwnProperty(coord)) {
									a = box_info.vials[coord]
								}

								return <div
									className={props.selected_wells.has(coord) ? 'selected selectable' : 'selectable'}
									style={square_size}
									data-key={coord}
									key={coord}>
									{a.name}
								</div>})
							}
						</div>)
				})}
			</SelectionArea>
	);
}
