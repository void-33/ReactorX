import { CompletionEvent, EquipmentType, LabItem, SetColorEvent, SetVisibilityEvent } from "@/lib/types"
/**
 * Initialize a completion state object for a given procedure list.
 * Returns a Map of stepId → StepCompletionState
 */

const residueOffset : Partial<Record<EquipmentType, { x: number, y: number }>> = {
	"flask":  {x: 15, y: 120},
	"beaker": {x: 15, y: 120},
}

export function triggerCompletionEvents(events: CompletionEvent[], setLabItems: Function, labItems?: LabItem[]) : void {
	events.forEach((event) => {
		switch (event.type) {
			case "set_color":
				console.log("Setting Color")
				const colorEvent = event as SetColorEvent;	
				// Find the lab item in your labItems state
				setLabItems((prev : LabItem[]) =>
					prev.map(item => {
						if (item.type === colorEvent.labitem) {
							// Optionally check chemical too
							return {
								...item,
								contents: {
									...item.contents,
									color: colorEvent.color,
								},
							};
						}
						return item;
					})
				);
				break;

			case "set_visibility":
				// TODO: implement visibility change
				console.log("Creating residue")
				const createEvent = event as SetVisibilityEvent;
				if (createEvent.visible) {
					setLabItems((prev: LabItem[]) => {
							const attachedTo: LabItem = prev.find((item) => item.type === createEvent.targetitem)!
							const residue: LabItem = {
								id: `${"residue"}-${Date.now()}`,
								type: createEvent.labitem,
								position: { x: attachedTo.position.x + residueOffset[attachedTo.type]!.x, y: attachedTo.position.y + residueOffset[attachedTo.type]!.y},
								chemicals: [],
								// isSnapped: true,
								// snappedTo: attachedTo.id
							}
							return [residue, ...prev];
					})
				}
				else {
					setLabItems((prev: LabItem[]) => {
						return prev.filter(item => item.type !== createEvent.labitem);
					})
				}
				break;

			case "emit_message":
				// TODO: emit a toast or message
				break;

			default:
				console.warn("Unknown completion event:", event);
		}
	});
}

