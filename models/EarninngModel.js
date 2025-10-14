import mongoose from "mongoose";

const earningSchema = new mongoose.Schema({
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    // required: true,
    unique: true, // ✅ ensures one doc per seller
  },
  amount: {
    type: Number,
    required: true,
    default: 0,
  },
  fromUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});

export const EarningModel = mongoose.model("Earning", earningSchema);


