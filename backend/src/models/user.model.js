import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: {
    type: String,
    required: function () { return this.authType === 'normal'; }
  },
  fullname: { type: String, required: true },
  phone: {
    type: String,
    match: [/^\d{10,11}$/, 'phone number just 10 num'],
    required: function () { return this.authType === 'normal'; },
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
    type: { type: String, enum: ['basic', 'pro', 'premium'], default: null }
  },

  statistics: {
    totalTests: { type: Number, default: 0 },
    avgScore: { type: Number, default: 0 },
    bestScore: { type: Number, default: 0 },
  }
}, { timestamps: true });


userSchema.methods.updateStatistics = async function(results) {
  try {
    const score = results.totalScore || 0;

    // cập nhật tổng số bài test
    this.totalTests = (this.totalTests || 0) + 1;

    // tính điểm trung bình
    this.avgScore = Math.round(((this.avgScore || 0) * (this.totalTests - 1) + score) / this.totalTests);

    // cập nhật điểm cao nhất
    if (score > (this.bestScore || 0)) {
      this.bestScore = score;
    }

    await this.save();
    console.log('✅ [User] Updated statistics for user:', this.email);
  } catch (err) {
    console.error('❌ [User] Error updating statistics:', err);
  }
};

export default mongoose.model('User', userSchema);
