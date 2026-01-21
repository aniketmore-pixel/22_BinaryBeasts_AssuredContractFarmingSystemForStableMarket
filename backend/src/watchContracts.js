import mongoose from "mongoose";
import Contract from "../models/Contract.js";
import ContractAudit from "../models/ContractAudit.js";
import { hashObject } from "./utils/hash.js";

export const watchContracts = async () => {
  const changeStream = Contract.watch([], {
    fullDocument: "updateLookup"
  });

  console.log("👀 Watching contracts collection...");

  changeStream.on("change", async (change) => {
    try {
      const { operationType, fullDocument, updateDescription } = change;

      const lastAudit = await ContractAudit
        .findOne({ contract_id: fullDocument.contract_id })
        .sort({ timestamp: -1 });

      const prevHash = lastAudit?.new_hash || "GENESIS";
      const newHash = hashObject(fullDocument);

      await ContractAudit.create({
        contract_id: fullDocument.contract_id,
        operation: operationType,
        changed_fields: updateDescription?.updatedFields || {},
        full_document: fullDocument,
        prev_hash: prevHash,
        new_hash: newHash,
        timestamp: new Date()
      });

    } catch (err) {
      console.error("❌ Audit log error:", err);
    }
  });
};
