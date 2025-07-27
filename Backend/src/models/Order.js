import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: true,
  },
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
     
      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
      price: {
        type: Number,
        required: true,
        min: 0,
      },
      image: {
        type: String,
        default: "",
      },
      color: {
        type: String,
        default: null, // zorunlu değilse
      },
      size: {
        type: String,
        default: null,
      }
    }
  ],
  cancelRequest: {
    type: Boolean,
    default: false, // kullanıcı iptal talebinde bulunmuş mu?
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0,
  },
  status: {
    type: String,
    enum: ['hazırlanıyor', 'kargoya verildi', 'teslim edildi', 'iptal edildi'],
    default: 'hazırlanıyor',
  },
  address: {
    district: { type: String, required: true },
    province: { type: String, required: true },
    postalCode: { type: String, required: true },
    addressDetail: { type: String, required: true },
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending',
  },
  paymentTransactionId: { type: String },
  paymentMethod: {
    type: String,
    enum: ['iyzico', 'credit_card', 'paypal', 'bank_transfer', 'cash_on_delivery'],
    required: true,
  },
  trackingNumber: {
    type: String,
    default: null,
  },
  agreementAccepted: {
    type: Boolean,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

export default mongoose.model('Order', orderSchema);
