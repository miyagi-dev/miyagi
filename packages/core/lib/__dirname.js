import { dirname } from "path";
import { fileURLToPath } from "url";

export default typeof __dirname !== "undefined"
  ? __dirname
  : dirname(fileURLToPath(import.meta.url));
