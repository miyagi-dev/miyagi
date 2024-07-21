import fs from "node:fs";
import { createEnvironment, createFilesystemLoader } from "twing";

const loader = createFilesystemLoader(fs);
const twing = createEnvironment(loader);

export default {
	components: {
		folder: "tests/_setup/components",
	},
	docs: null,
	engine: {
		name: "twing",
		instance: twing,
	},
	files: {
		templates: {
			name: "<component>",
			extension: "twig",
		},
	},
	schema: {
		strict: false,
	},
};
