import mongoose from 'mongoose';
import { meiliClient } from '../config/meilisearch.config.js';

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { 
        type: String, 
        required: function() { return this.authType === 'normal'; } 
    },
    fullname: { type: String, required: true },
    phone: { 
        type: String, 
        match: [/^\d{10,11}$/, 'phone number just 10 num'], 
        required: function() { return this.authType === 'normal'; },
        unique: true 
    },
    dob: { type: Date },
    avatarUrl: { type: String, default: '' },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    authType: { type: String, enum: ['normal', 'google'], default: 'normal' },
    isActive: { type: Boolean, default: true },
    vip: {
        isActive: { type: Boolean, default: false },
        endDate: { type: Date, default: null },
        type: { type: String, enum: ['basic','advanced','premium'], default: null }
    }
}, { timestamps: true });

userSchema.post("save", async function (doc) {
    try {
        if (!doc || doc.role === "admin") return;
        const index = meiliClient.index("users");
        await index.addDocuments([{
        id: doc._id.toString(),
        fullname: doc.fullname,
        email: doc.email,
        phone: doc.phone,
        role: doc.role,
        isActive: doc.isActive,
        authType: doc.authType
        }]);
        console.log("[Meili] Added:", doc.fullname);
    } catch (err) {
        console.error("[Meili] Add error:", err.message);
    }
});

userSchema.post("findOneAndUpdate", async function (doc) {
    if (!doc || doc.role === "admin") return;
    try {
        const index = meiliClient.index("users");
        await index.updateDocuments([{
            id: doc._id.toString(),
            fullname: doc.fullname,
            email: doc.email,
            phone: doc.phone,
            role: doc.role,
            isActive: doc.isActive,
            authType: doc.authType
        }]);
        console.log("[Meili] Updated:", doc.fullname);
    } catch (err) {
        console.error("[Meili] Update error:", err.message);
    }
});

userSchema.post("findOneAndDelete", async function (doc) {
    if (!doc || doc.role === "admin") return;
    try {
        const index = meiliClient.index("users");
        await index.deleteDocument(doc._id.toString());
        console.log("[Meili] Deleted:", doc.fullname);
    } catch (err) {
        console.error("[Meili] Delete error:", err.message);
    }
});

export default mongoose.model('User', userSchema);
