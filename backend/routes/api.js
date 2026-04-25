import express from 'express';
import axios from 'axios';
import Recommendation from '../models/Recommendation.js';

const router = express.Router();

// Static Expected Profit Mapping (Mock per acre based on market average)
const expectedProfitMap = {
    'rice': 35000,
    'maize': 25000,
    'cotton': 45000,
    'soybean': 30000,
    'tur': 32000,
    'chickpea': 28000,
    'sugarcane': 60000,
    'wheat': 35000
};

// Static Fertilizer Roadmap
const getFertilizerRoadmap = (crop) => {
    return {
        pre_sowing: 'Apply organic compost and basal dose of NPK.',
        growth_stage: 'Apply urea as top dressing. Maintain soil moisture.',
        harvest_stage: 'Stop watering 10 days before harvest. Ensure dry conditions.'
    };
};

// Regional Crop Boosting
const regionalBoosts = {
    'maharashtra': ['cotton', 'soybean', 'tur', 'sugarcane', 'pomegranate', 'grapes'],
    'punjab': ['wheat', 'rice', 'cotton', 'maize'],
    'haryana': ['wheat', 'rice', 'mustard'],
    'karnataka': ['coffee', 'ragi', 'tur', 'sunflower'],
    'kerala': ['coconut', 'rubber', 'coffee', 'tea', 'spices'],
    'gujarat': ['cotton', 'groundnut', 'castor'],
    'uttar pradesh': ['sugarcane', 'wheat', 'rice', 'potato', 'mango'],
    'west bengal': ['jute', 'rice', 'tea'],
    'assam': ['tea', 'jute', 'rice'],
    'madhya pradesh': ['soybean', 'wheat', 'chickpea'],
    'andhra pradesh': ['rice', 'cotton', 'chilli', 'tobacco'],
    'telangana': ['cotton', 'rice', 'maize', 'tur'],
    'tamil nadu': ['rice', 'groundnut', 'sugarcane', 'cotton'],
    'rajasthan': ['mustard', 'bajra', 'chickpea', 'guar'],
    'bihar': ['rice', 'maize', 'makhana', 'litchi'],
    'odisha': ['rice', 'jute'],
    'chhattisgarh': ['rice', 'soybean']
};

router.post('/recommend', async (req, res) => {
    try {
        const { soil, weather, water, season, location } = req.body;

        // Prepare data for ML Service
        // Map missing parameters or use defaults if required by the ML model
        const mlPayload = {
            N: soil.N || 0,
            P: soil.P || 0,
            K: soil.K || 0,
            temperature: weather.temperature || 25,
            humidity: weather.humidity || 70,
            ph: soil.pH || 6.5,
            rainfall: weather.rainfall || 100
        };

        const ML_URL = process.env.ML_API_URL || 'http://127.0.0.1:8000';

        // Call ML Microservice
        const mlResponse = await axios.post(`${ML_URL}/predict`, mlPayload);

        if (!mlResponse.data || !mlResponse.data.recommendations) {
            return res.status(500).json({ error: 'Failed to get predictions from ML Service.' });
        }

        const recommendations = mlResponse.data.recommendations;

        const stateName = (location && location.state) ? location.state.toLowerCase() : '';
        const boostedCrops = regionalBoosts[stateName] || [];

        // Enrich the recommendations with Profit, Fertilizer Data, and Regional Logic
        let enrichedRecommendations = recommendations.map(rec => {
            let conf = rec.confidence;
            let reasonSuffix = '';

            if (boostedCrops.length > 0) {
                if (boostedCrops.includes(rec.crop.toLowerCase())) {
                    conf = Math.min(99, conf + 15); // Boost confidence
                    reasonSuffix = ` This crop is highly suitable for the ${location.state} region.`;
                } else {
                    conf = Math.max(10, conf - 15); // Penalize confidence
                    reasonSuffix = ` Note: This crop is less common in ${location.state}.`;
                }
            }

            return {
                crop: rec.crop,
                confidence: conf,
                expectedProfit: expectedProfitMap[rec.crop.toLowerCase()] || 20000,
                reason: `Based on soil NPK levels (${soil.N}, ${soil.P}, ${soil.K}), pH of ${soil.pH}, and local weather suitability.${reasonSuffix}`,
                fertilizerRoadmap: getFertilizerRoadmap(rec.crop)
            };
        });

        // Re-sort by modified confidence
        enrichedRecommendations.sort((a, b) => b.confidence - a.confidence);

        // Simple text format for Future WhatsApp bot
        const topCropsText = enrichedRecommendations.map(r => r.crop.charAt(0).toUpperCase() + r.crop.slice(1)).join(', ');
        const mainProfit = enrichedRecommendations[0]?.expectedProfit;
        const textResponse = `Best crops: ${topCropsText}. Expected profit: ₹${mainProfit} per acre.`;

        // Save to Database
        const newRecord = new Recommendation({
            soil,
            weather,
            water,
            season,
            location, // save location info
            recommendedCrops: enrichedRecommendations
        });

        await newRecord.save();

        res.json({
            success: true,
            recommendations: enrichedRecommendations,
            textResponse
        });

    } catch (error) {
        console.error('Error in /recommend:', error.message);
        res.status(500).json({ error: 'Internal Server Error while generating recommendation.', details: error.message, stack: error.stack });
    }
});

router.get('/weather', async (req, res) => {
    try {
        // Here you would integrate with OpenWeatherMap or similar API using process.env.WEATHER_API_KEY
        // For demonstration, we will return simulated weather data.
        const simulatedWeather = {
            temperature: 28 + Math.floor(Math.random() * 5),
            humidity: 60 + Math.floor(Math.random() * 20),
            rainfall: 100 + Math.floor(Math.random() * 50)
        };

        res.json({ success: true, weather: simulatedWeather });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch weather data.' });
    }
});

export default router;
