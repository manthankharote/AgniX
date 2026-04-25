import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
import pickle
import os
import urllib.request

def train_and_save():
    print("Downloading REAL Crop Recommendation Dataset...")
    url = "https://raw.githubusercontent.com/arzzahid66/Optimizing_Agricultural_Production/master/Crop_recommendation.csv"
    
    # Load dataset directly from URL
    try:
        df = pd.read_csv(url)
        print("Dataset loaded successfully!")
    except Exception as e:
        print(f"Error downloading dataset: {e}")
        return

    # Check columns
    expected_cols = ['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']
    X = df[expected_cols]
    y = df['label']
    
    # Train-test split
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    print("Training GaussianNB on REAL data for higher confidence margins...")
    from sklearn.naive_bayes import GaussianNB
    model = GaussianNB()
    model.fit(X_train, y_train)
    
    # Evaluate
    y_pred = model.predict(X_test)
    score = accuracy_score(y_test, y_pred)
    print(f"Model accuracy on test set: {score * 100:.2f}%")
    
    # Save the model
    model_path = os.path.join(os.path.dirname(__file__), 'model.pkl')
    with open(model_path, 'wb') as f:
        pickle.dump(model, f)
        
    print(f"Model saved successfully at {model_path}")

if __name__ == "__main__":
    train_and_save()
