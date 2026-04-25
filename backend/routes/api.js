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

// ==========================================
// 🛡️ AGRONOMY SAFETY VETO ENGINE
// Real agriculture relies on hard rules to 
// prevent dangerous ML hallucinations.
// ==========================================
const passesAgronomySafety = (cropName, soil, water, season) => {
    const crop = cropName.toLowerCase();
    const waterAvail = water.availability.toLowerCase();
    const soilType = soil.type.toLowerCase();
    const currentSeason = season.toLowerCase();

    // Veto 1: High-water crops in low-water areas
    if (waterAvail === 'low' && ['sugarcane', 'rice', 'turmeric', 'banana'].includes(crop)) return false;

    // Veto 2: Dry crops in waterlogged areas
    if (waterAvail === 'high' && ['bajra', 'jowar', 'cotton'].includes(crop)) return false;

    // Veto 3: Strict soil preferences
    if (soilType === 'red' && ['cotton'].includes(crop)) return false; // Cotton needs black/alluvial

    // Veto 4: Strict season mapping (Simplified)
    if (currentSeason === 'rabi' && ['cotton', 'rice'].includes(crop)) return false;

    return true; // Crop passes all safety checks
};

// Removed regional boosts logic - relying purely on the custom ML model

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
            rainfall: weather.rainfall || 100,
            soil_type: soil.type || 'black',
            soil_moisture: soil.moisture || 'medium',
            season: season || 'kharif',
            water_availability: water.availability || 'medium',
            water_ph: water.pH || 7.0,
            location: location && location.region ? location.region : 'Maharashtra'
        };

        const ML_URL = process.env.ML_API_URL || 'http://127.0.0.1:8000';

        // Call ML Microservice
        const mlResponse = await axios.post(`${ML_URL}/predict`, mlPayload);

        if (!mlResponse.data || !mlResponse.data.recommendations) {
            return res.status(500).json({ error: 'Failed to get predictions from ML Service.' });
        }

        const rawRecommendations = mlResponse.data.recommendations;

        // Apply Safety Veto Engine
        const safeRecommendations = rawRecommendations.filter(rec => 
            passesAgronomySafety(rec.crop, soil, water, season)
        );

        // Enrich the safe recommendations with Profit and Fertilizer Data
        let enrichedRecommendations = safeRecommendations.map(rec => {
            return {
                crop: rec.crop,
                confidence: Math.round(rec.confidence * 100), // Format as percentage
                expectedProfit: expectedProfitMap[rec.crop.toLowerCase()] || 45000,
                reason: `Based on your exact region, soil health, and local weather patterns. Passed all safety vetos.`,
                fertilizerRoadmap: getFertilizerRoadmap(rec.crop)
            };
        });

        // Ensure we always have at least 1 recommendation even if vetos are aggressive
        if (enrichedRecommendations.length === 0 && rawRecommendations.length > 0) {
            enrichedRecommendations.push({
                crop: rawRecommendations[0].crop,
                confidence: Math.round(rawRecommendations[0].confidence * 100),
                expectedProfit: 20000,
                reason: `Warning: This crop violates optimal agronomy rules for your inputs, but mathematically matches the soil chemistry.`,
                fertilizerRoadmap: getFertilizerRoadmap(rawRecommendations[0].crop)
            });
        }

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
