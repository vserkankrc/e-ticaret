import mongoose from 'mongoose';

const CouponSchema = new mongoose.Schema({
    code: {type:String,required: true, unique: true},
    discount: {type:Number,required: true},
    expirationDate:{type:String,required:true}
},{
    timestamps: true
})

 const Coupon = mongoose.model('Coupon', CouponSchema);

 export default Coupon;