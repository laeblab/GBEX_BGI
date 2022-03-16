import React, { Dispatch, SetStateAction, useMemo } from 'react';
import SelectionArea, { SelectionEvent } from '@viselect/react';
import { Box, Vial } from "./App"


export default function TheBox(props: {selected_wells: Set<string>, setSelectedWells: Dispatch<SetStateAction<Set<string>>>, box: Box, height: number, width: number}) {
	const {box, height, width} = props
	const limw = width/box.columns
	const limh = height/box.rows
	const memoizedVialPos = useMemo<{[key: string]:Vial}>(() => box.vials.reduce((a, v) => ({...a, [String(v.box_row)+"+"+String(v.box_column)]: v}), {}), [box])

	let square_size = {
		height: width / box.columns,
		width: width / box.columns
	}
	if (limh < limw) {
		square_size = {
			height: height / box.rows,
			width: height / box.rows
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

	return <SelectionArea className="container" onStart={onStart} onMove={onMove} selectables=".selectable">
				{[...Array(box.rows)].map((e, row) => {
					return (
						<div style={{display: "flex", flexGrow: 1}} key={row}>
							{[...Array(box.columns)].map((ee, column) => {
								const coord = String.fromCharCode('A'.charCodeAt(0)+row)+(column+1)
								const coord_pos_string = row+"+"+column
								let a = {label:coord}
								let classy = props.selected_wells.has(coord_pos_string) ? 'selected selectable' : 'selectable'
								if (memoizedVialPos.hasOwnProperty(coord_pos_string)) {
									a = memoizedVialPos[coord_pos_string]
								} else {
									classy += " empty_position"
								}

								return <div
									className={classy}
									style={square_size}
									data-key={coord_pos_string}
									key={coord_pos_string}>
									{a.label}
								</div>})
							}
						</div>)
				})}
	</SelectionArea>
}
