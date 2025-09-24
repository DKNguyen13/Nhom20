import mongoose from 'mongoose';

const premiumSubscriptionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    packageId: { type: mongoose.Schema.Types.ObjectId, ref: 'PremiumPackage', required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    pricePaid: { type: Number, required: true },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model('PremiumSubscription', premiumSubscriptionSchema);
