from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import numpy as np
import os

app = Flask(__name__)
CORS(app)

# Load the trained model
MODEL_PATH = os.path.join(os.path.dirname(__file__), 'model.pkl')

try:
    with open(MODEL_PATH, 'rb') as f:
        model = pickle.load(f)
    print("Model loaded successfully.")
except FileNotFoundError:
    print("Model file not found. Please train the model first.")
    model = None

@app.route('/predict', methods=['POST'])
def predict():
    if model is None:
        return jsonify({'error': 'Model is not trained/loaded yet.'}), 500
        
    try:
        data = request.json
        # Expected features in exact order used during training:
        # ['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']
        features = [
            float(data.get('N', 0)),
            float(data.get('P', 0)),
            float(data.get('K', 0)),
            float(data.get('temperature', 0)),
            float(data.get('humidity', 0)),
            float(data.get('ph', 0)),
            float(data.get('rainfall', 0))
        ]
        
        # Predict probability for all classes
        probas = model.predict_proba([features])[0]
        classes = model.classes_
        
        # Get top 3 predictions
        top_indices = np.argsort(probas)[-3:][::-1]
        
        recommendations = []
        for i in top_indices:
            recommendations.append({
                'crop': classes[i],
                'confidence': round(probas[i] * 100, 2)
            })
            
        return jsonify({'recommendations': recommendations})

    except Exception as e:
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    # Start the Flask app
    # Force reload comment
    app.run(host='0.0.0.0', port=8000, debug=True)
