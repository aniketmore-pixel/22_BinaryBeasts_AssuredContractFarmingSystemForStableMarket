import mongoose from "mongoose";

const ContractSchema = new mongoose.Schema(
  {
    contract_id: { type: String, required: true, unique: true },

    buyer_profile_id: { type: String, required: true },
    farmer_profile_id: { type: String, required: true },

    farmer_name: { type: String },

    /* ===== Buyer org info ===== */
    organization_name: { type: String },
    buyer_type: {
      type: String,
      enum: ["HOTEL", "PROCESSOR", "WHOLESALER", "EXPORTER", "RETAILER", "COOPERATIVE", "GOVERNMENT"]
    },
    registered_address: { type: String },

    /* ===== Contract flow ===== */
    contract_status: {
      type: String,
      enum: [
        "PENDING_BUYER_APPROVAL",
        "REJECTED",
        "IN_PROGRESS",
        "DELIVERED",
        "CANCELLED"
      ],
      default: "PENDING_BUYER_APPROVAL"
    },

    farmer_action: {
      type: String,
      enum: ["APPROVE", "COUNTER_OFFER"],
      required: true
    },

    /* ===== Contract terms ===== */
    crop_name: String,
    price_per_quintal: Number,
    quantity: Number,
    location: String,
    duration_months: Number,
    quality_badges: [String],

    delivery_start_date: Date,
    delivery_end_date: Date,

    notes: String,

    /* ===== Delivery tracking ===== */
    delivery_tracking: {
      type: String,
      enum: ["LAND", "SOWING", "IRRIGATION", "GROWTH", "HARVEST", "PACKING"],
      default: "LAND"
    },

    /* ===== Dispute notes ===== */
    farmer_dispute_note: { type: String, default: "" },
    buyer_dispute_note: { type: String, default: "" }
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "last_updated_at"
    }
  }
);

export default mongoose.model("Contract", ContractSchema);
