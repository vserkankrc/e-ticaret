import mongoose from 'mongoose';
const { Schema } = mongoose;

const SavedCardSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
  cardToken: { type: String, required: true, unique: true }, // İyzico tokeni
  cardUserKey: { type: String, required: true },  
  cardHolderName: { type: String, required: true },
  cardType: { type: String },
  last4Digits: { type: String, required: true },
  expireMonth: { type: String, required: true },
  expireYear: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('SavedCard', SavedCardSchema);
