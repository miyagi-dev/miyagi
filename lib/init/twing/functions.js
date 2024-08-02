import { createSynchronousFunction } from "twing";

export const isExpanded = createSynchronousFunction(
	"is_expanded",
	(_context, item, requestedComponent) => {
		if (!requestedComponent) return false;

		return !!(
			item.children?.find(
				({ shortPath }) => shortPath === requestedComponent,
			) ||
			(item.shortPath && item.shortPath === requestedComponent) ||
			requestedComponent.startsWith(item.shortPath)
		);
	},
	[{ name: "item" }, { name: "requestedComponent" }],
);

export const isActiveComponent = createSynchronousFunction(
	"is_active_component",
	(_context, item, requestedComponent, requestedVariation) => {
		if (!requestedComponent) return false;

		if (requestedComponent === "design-tokens") {
			return (
				item.section === "design-tokens" && item.name == requestedVariation
			);
		}

		return (
			item.shortPath &&
			item.shortPath === requestedComponent &&
			!requestedVariation
		);
	},
	["item", "requestedComponent", "requestedVariation"],
);

export const isActiveVariant = createSynchronousFunction(
	"is_active_variant",
	(_context, item, requestedComponent, requestedVariation) => {
		if (!item || !requestedComponent || !requestedVariation) return false;

		return (
			requestedComponent == item.parentShortPath &&
			requestedVariation == item.name
		);
	},
	["item", "requestedComponent", "requestedVariation"],
);
