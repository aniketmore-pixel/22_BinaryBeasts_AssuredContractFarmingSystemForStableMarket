import crypto from "crypto";

export const hashObject = (obj) =>
  crypto.createHash("sha256").update(JSON.stringify(obj)).digest("hex");
