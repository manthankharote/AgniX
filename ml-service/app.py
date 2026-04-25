from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import numpy as np
import pandas as pd
import os

app = Flask(__name__)
CORS(app)

# Load the trained model and encoders
MODEL_PATH = os.path.join(os.path.dirname(__file__), 'model.pkl')
ENCODER_PATH = os.path.join(os.path.dirname(__file__), 'encoder.pkl')
LABEL_ENCODER_PATH = os.path.join(os.path.dirname(__file__), 'label_encoder.pkl')

try:
    with open(MODEL_PATH, 'rb') as f:
        model = pickle.load(f)
    with open(ENCODER_PATH, 'rb') as f:
        encoder = pickle.load(f)
    with open(LABEL_ENCODER_PATH, 'rb') as f:
        label_encoder = pickle.load(f)
    print("Model and Encoders loaded successfully.")
except Exception as e:
    print(f"Failed to load models: {e}")
    import traceback
    traceback.print_exc()
    model = None
    encoder = None
    label_encoder = None

@app.route('/predict', methods=['POST'])
def predict():
    if model is None or encoder is None or label_encoder is None:
        return jsonify({'error': 'Model is not trained/loaded yet.'}), 500
        
    try:
        data = request.json
        
        # Extract numerical features
        numerical_features = [
            float(data.get('N', 0)),
            float(data.get('P', 0)),
            float(data.get('K', 0)),
            float(data.get('temperature', 0)),
            float(data.get('humidity', 0)),
            float(data.get('ph', 0)),
            float(data.get('rainfall', 0)),
            float(data.get('water_ph', 7.0))
        ]
        
        # Extract categorical features
        categorical_features = pd.DataFrame([{
            'soil_type': data.get('soil_type', 'black').lower(),
            'soil_moisture': data.get('soil_moisture', 'medium').lower(),
            'season': data.get('season', 'kharif').lower(),
            'water_availability': data.get('water_availability', 'medium').lower(),
            'location': data.get('location', 'Maharashtra')
        }])
        
        # Encode categoricals
        encoded_cats = encoder.transform(categorical_features)
        
        # Combine
        X_num = np.array([numerical_features])
        X_final = np.hstack((X_num, encoded_cats))
        
        # Predict probability
        probas = model.predict_proba(X_final)[0]
        classes = label_encoder.classes_
        
        # Get top 3 predictions
        top_indices = np.argsort(probas)[-3:][::-1]
        
        recommendations = []
        for i in top_indices:
            recommendations.append({
                'crop': classes[i],
                'confidence': float(round(probas[i], 4)) 
            })
            
        return jsonify({'recommendations': recommendations})

    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    # Force auto-reload v3
    app.run(host='0.0.0.0', port=8000, debug=True)
