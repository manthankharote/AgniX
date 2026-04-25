import mongoose from 'mongoose';

const recommendationSchema = new mongoose.Schema({
    soil: {
        N: Number,
        P: Number,
        K: Number,
        type: { type: String }, // Fix Mongoose reserved keyword clash
        pH: Number,
        moisture: String
    },
    weather: {
        temperature: Number,
        humidity: Number,
        rainfall: Number
    },
    water: {
        availability: String,
        pH: Number
    },
    location: {
        address: String,
        state: String,
        lat: Number,
        lon: Number
    },
    season: String,
    recommendedCrops: [
        {
            crop: String,
            confidence: Number
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Recommendation = mongoose.model('Recommendation', recommendationSchema);

export default Recommendation;
