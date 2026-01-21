// import mongoose from "mongoose";

// const ContractAuditSchema = new mongoose.Schema({
//   contract_id: String,
//   operation: String, // insert | update | delete
//   changed_fields: Object,
//   full_document: Object,
//   prev_hash: String,
//   new_hash: String,
//   timestamp: Date
// });

// export default mongoose.model("ContractAudit", ContractAuditSchema);


// models/ContractAudit.js
import mongoose from "mongoose";

const ContractAuditSchema = new mongoose.Schema({
  contract_id: { type: String, required: true },

  operation: {
    type: String,
    enum: ["insert", "update", "delete"],
    required: true
  },

  changed_fields: { type: Object, default: {} },
  full_document: { type: Object },

  prev_hash: { type: String },
  new_hash: { type: String },

  timestamp: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("ContractAudit", ContractAuditSchema);
