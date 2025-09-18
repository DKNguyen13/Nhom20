import mongoose from 'mongoose';
import slug from "mongoose-slug-updater";

// Add plugin
mongoose.plugin(slug);

const { Schema } = mongoose;

const PartSchema = new mongoose.Schema({
    testId: { type: Schema.Types.ObjectId, ref: "Test", required: true },
    title: { type: String, require: true, trim: true },
    slug: { type: String, slug: 'title', required: false, unique: true, lowercase: true, trim: true },
    partNumber: { type: Number, min: 1, max: 7, require: true },
    shortTitle: { type: String },
    description: { type: String },
    instructions: { type: String },
    audioFile: { type: String }, // url audio
    totalQuestions: { type: Number, require: true },
    config: {
        hasAudio: { type: Boolean, default: false },
        allowReplay: { type: Boolean, default: true },
        showQuestionNumber: { type: Boolean, default: true },
        allowBack: {type: Boolean, default: true},
    },

}, {
  timestamps: true
})

// Indexes
PartSchema.index({ testId: 1, partNumber: 1 });

module.exports = mongoose.model('Part', PartSchema);
