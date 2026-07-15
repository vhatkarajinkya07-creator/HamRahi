const mongoose = require('mongoose');

const diarySchema = new mongoose.Schema({
  date: { type: String, required: true },
  text: { type: String, required: true },
  photo: { type: String, default: "" }
});

const activitySchema = new mongoose.Schema({
  time: { type: String, required: true },
  activity: { type: String, required: true },
  description: { type: String, default: "" }
});

const daySchema = new mongoose.Schema({
  day: { type: Number, required: true },
  title: { type: String, default: "" },
  activities: [activitySchema]
});

const tripSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  placeId: { type: String, required: true },
  name: { type: String, required: true },
  destination: { type: String, required: true },
  country: { type: String, default: "" },
  heroImage: { type: String, default: "" },
  status: {
    type: String,
    enum: ["upcoming", "active", "completed"],
    default: "upcoming"
  },
  startDate: { type: String, required: true },
  endDate: { type: String, required: true },
  daysCount: { type: Number, required: true },
  budget: { type: String, default: "Medium" },
  travelStyle: { type: String, default: "Friends" },
  itinerarySummary: { type: String, default: "" },
  packingEssentials: { type: [String], default: [] },
  localTips: { type: [String], default: [] },
  days: [daySchema],
  diary: {
    type: [diarySchema],
    default: []
  }
}, { timestamps: true });

const Trip = mongoose.model('Trip', tripSchema);
module.exports = Trip;
