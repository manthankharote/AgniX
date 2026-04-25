import pandas as pd
import numpy as np
import random

def generate_maharashtra_dataset(num_rows=10000):
    np.random.seed(42)
    random.seed(42)
    
    crops_profiles = {
        'cotton': {
            'N': (80, 150), 'P': (30, 70), 'K': (15, 45),
            'soil_type': ['black', 'red'], 'soil_moisture': ['low', 'medium'],
            'temperature': (20, 35), 'humidity': (40, 85), 'ph': (5.5, 8.0), 'rainfall': (50, 120),
            'season': ['kharif'], 'water_availability': ['low', 'medium'], 'water_ph': (6.0, 8.0),
            'location': ['Vidarbha', 'Marathwada', 'Khandesh']
        },
        'soybean': {
            'N': (20, 80), 'P': (40, 90), 'K': (25, 60),
            'soil_type': ['black', 'alluvial'], 'soil_moisture': ['medium'],
            'temperature': (18, 32), 'humidity': (50, 80), 'ph': (5.5, 7.8), 'rainfall': (40, 100),
            'season': ['kharif'], 'water_availability': ['medium'], 'water_ph': (6.0, 7.8),
            'location': ['Vidarbha', 'Marathwada', 'Western Maharashtra']
        },
        'tur': {
            'N': (10, 50), 'P': (40, 80), 'K': (15, 40),
            'soil_type': ['black', 'red'], 'soil_moisture': ['low', 'medium'],
            'temperature': (20, 35), 'humidity': (30, 65), 'ph': (5.0, 7.5), 'rainfall': (30, 90),
            'season': ['kharif'], 'water_availability': ['low', 'medium'], 'water_ph': (6.0, 8.0),
            'location': ['Marathwada', 'Vidarbha']
        },
        'sugarcane': {
            'N': (120, 220), 'P': (60, 140), 'K': (70, 150),
            'soil_type': ['black', 'alluvial'], 'soil_moisture': ['high', 'medium'],
            'temperature': (22, 38), 'humidity': (60, 95), 'ph': (6.0, 8.5), 'rainfall': (100, 300),
            'season': ['kharif', 'rabi'], 'water_availability': ['high'], 'water_ph': (6.5, 8.0),
            'location': ['Western Maharashtra', 'Marathwada']
        },
        'wheat': {
            'N': (70, 140), 'P': (30, 80), 'K': (25, 65),
            'soil_type': ['black', 'alluvial'], 'soil_moisture': ['medium'],
            'temperature': (10, 28), 'humidity': (30, 70), 'ph': (5.5, 8.0), 'rainfall': (20, 80),
            'season': ['rabi'], 'water_availability': ['medium'], 'water_ph': (6.0, 8.0),
            'location': ['Western Maharashtra', 'Vidarbha']
        },
        'rice': {
            'N': (70, 140), 'P': (30, 80), 'K': (25, 65),
            'soil_type': ['laterite', 'alluvial', 'black'], 'soil_moisture': ['high'],
            'temperature': (20, 38), 'humidity': (70, 98), 'ph': (4.5, 7.0), 'rainfall': (150, 400),
            'season': ['kharif'], 'water_availability': ['high'], 'water_ph': (5.5, 7.5),
            'location': ['Konkan', 'Vidarbha', 'Western Maharashtra']
        },
        'onion': {
            'N': (80, 160), 'P': (40, 90), 'K': (60, 140),
            'soil_type': ['black', 'alluvial', 'red'], 'soil_moisture': ['medium', 'low'],
            'temperature': (12, 32), 'humidity': (40, 75), 'ph': (6.0, 8.0), 'rainfall': (30, 120),
            'season': ['rabi', 'kharif'], 'water_availability': ['medium'], 'water_ph': (6.0, 8.0),
            'location': ['Western Maharashtra', 'Khandesh']
        },
        'grapes': {
            'N': (80, 180), 'P': (40, 120), 'K': (100, 220),
            'soil_type': ['black', 'red', 'laterite'], 'soil_moisture': ['medium'],
            'temperature': (15, 38), 'humidity': (30, 65), 'ph': (6.0, 8.5), 'rainfall': (20, 100),
            'season': ['rabi'], 'water_availability': ['medium'], 'water_ph': (6.0, 8.0),
            'location': ['Western Maharashtra', 'Marathwada']
        },
        'pomegranate': {
            'N': (80, 160), 'P': (40, 100), 'K': (80, 160),
            'soil_type': ['black', 'red', 'alluvial'], 'soil_moisture': ['low', 'medium'],
            'temperature': (22, 40), 'humidity': (20, 60), 'ph': (6.0, 8.5), 'rainfall': (20, 80),
            'season': ['rabi', 'zaid'], 'water_availability': ['low', 'medium'], 'water_ph': (6.5, 8.0),
            'location': ['Western Maharashtra', 'Marathwada']
        },
        'bajra': {
            'N': (30, 90), 'P': (15, 50), 'K': (10, 40),
            'soil_type': ['black', 'red', 'laterite'], 'soil_moisture': ['low'],
            'temperature': (22, 40), 'humidity': (20, 60), 'ph': (5.5, 8.0), 'rainfall': (20, 80),
            'season': ['kharif'], 'water_availability': ['low'], 'water_ph': (6.0, 8.0),
            'location': ['Western Maharashtra', 'Marathwada', 'Khandesh']
        },
        'watermelon': {
            'N': (70, 130), 'P': (30, 70), 'K': (70, 140),
            'soil_type': ['alluvial', 'red'], 'soil_moisture': ['medium', 'high'],
            'temperature': (22, 38), 'humidity': (30, 70), 'ph': (5.5, 7.5), 'rainfall': (20, 80),
            'season': ['zaid'], 'water_availability': ['medium'], 'water_ph': (6.0, 8.0),
            'location': ['Western Maharashtra', 'Khandesh']
        },
        'maize': {
            'N': (80, 160), 'P': (40, 90), 'K': (40, 100),
            'soil_type': ['black', 'alluvial', 'red'], 'soil_moisture': ['medium'],
            'temperature': (15, 32), 'humidity': (40, 80), 'ph': (5.0, 8.0), 'rainfall': (50, 150),
            'season': ['kharif', 'rabi'], 'water_availability': ['medium'], 'water_ph': (6.0, 8.0),
            'location': ['Marathwada', 'Vidarbha', 'Western Maharashtra']
        },
        'turmeric': {
            'N': (100, 160), 'P': (50, 100), 'K': (80, 140),
            'soil_type': ['black', 'alluvial'], 'soil_moisture': ['medium', 'high'],
            'temperature': (18, 35), 'humidity': (60, 95), 'ph': (5.0, 7.5), 'rainfall': (100, 300),
            'season': ['kharif'], 'water_availability': ['high', 'medium'], 'water_ph': (5.5, 7.5),
            'location': ['Western Maharashtra', 'Marathwada']
        },
        'jowar': {
            'N': (40, 100), 'P': (20, 60), 'K': (15, 50),
            'soil_type': ['black', 'red'], 'soil_moisture': ['low', 'medium'],
            'temperature': (20, 38), 'humidity': (30, 65), 'ph': (5.5, 8.0), 'rainfall': (30, 90),
            'season': ['rabi', 'kharif'], 'water_availability': ['low', 'medium'], 'water_ph': (6.0, 8.0),
            'location': ['Western Maharashtra', 'Marathwada', 'Vidarbha']
        },
        'groundnut': {
            'N': (20, 60), 'P': (40, 90), 'K': (30, 70),
            'soil_type': ['red', 'alluvial'], 'soil_moisture': ['medium'],
            'temperature': (20, 35), 'humidity': (40, 70), 'ph': (6.0, 7.5), 'rainfall': (40, 120),
            'season': ['kharif'], 'water_availability': ['medium'], 'water_ph': (6.0, 8.0),
            'location': ['Western Maharashtra', 'Khandesh']
        },
        'orange': {
            'N': (100, 160), 'P': (40, 90), 'K': (80, 140),
            'soil_type': ['black', 'red'], 'soil_moisture': ['medium'],
            'temperature': (15, 38), 'humidity': (40, 75), 'ph': (5.5, 7.5), 'rainfall': (50, 150),
            'season': ['rabi'], 'water_availability': ['medium'], 'water_ph': (6.0, 7.5),
            'location': ['Vidarbha']
        },
        'mango': {
            'N': (80, 150), 'P': (40, 80), 'K': (60, 120),
            'soil_type': ['laterite', 'red'], 'soil_moisture': ['low', 'medium'],
            'temperature': (20, 40), 'humidity': (50, 90), 'ph': (5.0, 7.5), 'rainfall': (100, 300),
            'season': ['zaid'], 'water_availability': ['medium', 'low'], 'water_ph': (5.5, 7.5),
            'location': ['Konkan', 'Western Maharashtra']
        },
        'cashew': {
            'N': (50, 120), 'P': (20, 60), 'K': (30, 80),
            'soil_type': ['laterite', 'red'], 'soil_moisture': ['low', 'medium'],
            'temperature': (20, 38), 'humidity': (60, 95), 'ph': (4.5, 6.5), 'rainfall': (150, 350),
            'season': ['zaid'], 'water_availability': ['low', 'medium'], 'water_ph': (5.0, 7.0),
            'location': ['Konkan']
        },
        'tomato': {
            'N': (80, 160), 'P': (40, 90), 'K': (80, 150),
            'soil_type': ['black', 'red', 'alluvial'], 'soil_moisture': ['medium'],
            'temperature': (18, 30), 'humidity': (40, 75), 'ph': (6.0, 7.5), 'rainfall': (40, 120),
            'season': ['kharif', 'rabi', 'zaid'], 'water_availability': ['medium'], 'water_ph': (6.0, 7.5),
            'location': ['Western Maharashtra', 'Marathwada']
        },
        'potato': {
            'N': (80, 160), 'P': (50, 100), 'K': (100, 180),
            'soil_type': ['alluvial', 'red'], 'soil_moisture': ['medium'],
            'temperature': (12, 28), 'humidity': (50, 80), 'ph': (5.0, 6.5), 'rainfall': (40, 100),
            'season': ['rabi'], 'water_availability': ['medium'], 'water_ph': (5.5, 7.5),
            'location': ['Western Maharashtra', 'Vidarbha']
        }
    }

    data = []
    samples_per_crop = num_rows // len(crops_profiles)

    for crop, profile in crops_profiles.items():
        for _ in range(samples_per_crop):
            # Introduce slight gaussian noise to continuous variables
            row = {
                'N': int(np.clip(np.random.normal(np.mean(profile['N']), (profile['N'][1]-profile['N'][0])/4), profile['N'][0]-10, profile['N'][1]+10)),
                'P': int(np.clip(np.random.normal(np.mean(profile['P']), (profile['P'][1]-profile['P'][0])/4), profile['P'][0]-10, profile['P'][1]+10)),
                'K': int(np.clip(np.random.normal(np.mean(profile['K']), (profile['K'][1]-profile['K'][0])/4), profile['K'][0]-10, profile['K'][1]+10)),
                'soil_type': random.choice(profile['soil_type']),
                'soil_moisture': random.choice(profile['soil_moisture']),
                'temperature': round(np.clip(np.random.normal(np.mean(profile['temperature']), (profile['temperature'][1]-profile['temperature'][0])/4), profile['temperature'][0]-2, profile['temperature'][1]+2), 1),
                'humidity': round(np.clip(np.random.normal(np.mean(profile['humidity']), (profile['humidity'][1]-profile['humidity'][0])/4), profile['humidity'][0]-5, profile['humidity'][1]+5), 1),
                'ph': round(np.clip(np.random.normal(np.mean(profile['ph']), (profile['ph'][1]-profile['ph'][0])/4), profile['ph'][0]-0.5, profile['ph'][1]+0.5), 1),
                'rainfall': round(np.clip(np.random.normal(np.mean(profile['rainfall']), (profile['rainfall'][1]-profile['rainfall'][0])/4), profile['rainfall'][0]-10, profile['rainfall'][1]+10), 1),
                'season': random.choice(profile['season']),
                'water_availability': random.choice(profile['water_availability']),
                'water_ph': round(np.clip(np.random.normal(np.mean(profile['water_ph']), (profile['water_ph'][1]-profile['water_ph'][0])/4), profile['water_ph'][0]-0.2, profile['water_ph'][1]+0.2), 1),
                'location': random.choice(profile['location']),
                'label': crop
            }
            data.append(row)

    df = pd.DataFrame(data)
    # Shuffle the dataset
    df = df.sample(frac=1).reset_index(drop=True)
    
    output_path = 'dataset.csv'
    df.to_csv(output_path, index=False)
    print(f"Successfully generated {len(df)} rows in {output_path}")

if __name__ == "__main__":
    generate_maharashtra_dataset(10000)
