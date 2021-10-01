import { promisify } from "util";
import { pipeline } from "stream";

export const pump = promisify(pipeline);
