import { promisify } from "util";
import { randomBytes as cryptoRandomBytes } from "crypto";

export const randomBytes = promisify(cryptoRandomBytes);
