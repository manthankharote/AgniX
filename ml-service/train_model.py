import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
from sklearn.preprocessing import OneHotEncoder, LabelEncoder
from xgboost import XGBClassifier
import pickle
import os

def train_and_save():
    print("Loading 10,000-Row Custom Maharashtra Dataset...")
    dataset_path = os.path.join(os.path.dirname(__file__), 'dataset.csv')
    
    try:
        df = pd.read_csv(dataset_path)
        print("Dataset loaded successfully!")
    except Exception as e:
        print(f"Error loading dataset: {e}")
        return

    # Define categorical and numerical features
    categorical_cols = ['soil_type', 'soil_moisture', 'season', 'water_availability', 'location']
    numerical_cols = ['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall', 'water_ph']
    
    X = df[numerical_cols + categorical_cols]
    y = df['label']
    
    print("Fitting Target LabelEncoder...")
    label_encoder = LabelEncoder()
    y_encoded = label_encoder.fit_transform(y)
    
    print("Fitting OneHotEncoder on categorical features...")
    encoder = OneHotEncoder(sparse_output=False, handle_unknown='ignore')
    
    # Fit and transform categorical data
    encoded_cats = encoder.fit_transform(X[categorical_cols])
    
    # Create final feature array combining numerical and encoded categorical
    X_num = X[numerical_cols].values
    X_final = np.hstack((X_num, encoded_cats))
    
    # Train-test split
    X_train, X_test, y_train, y_test = train_test_split(X_final, y_encoded, test_size=0.2, random_state=42)
    
    print("Training XGBClassifier for sharp, high-confidence probabilities...")
    # XGBoost configuration for multiclass
    model = XGBClassifier(
        objective='multi:softprob',
        n_estimators=150,
        learning_rate=0.1,
        max_depth=5,
        random_state=42
    )
    model.fit(X_train, y_train)
    
    # Evaluate
    y_pred = model.predict(X_test)
    score = accuracy_score(y_test, y_pred)
    print(f"Model accuracy on test set: {score * 100:.2f}%")
    
    # Save the model
    model_path = os.path.join(os.path.dirname(__file__), 'model.pkl')
    with open(model_path, 'wb') as f:
        pickle.dump(model, f)
        
    # Save the feature encoder
    encoder_path = os.path.join(os.path.dirname(__file__), 'encoder.pkl')
    with open(encoder_path, 'wb') as f:
        pickle.dump(encoder, f)
        
    # Save the target label encoder
    label_encoder_path = os.path.join(os.path.dirname(__file__), 'label_encoder.pkl')
    with open(label_encoder_path, 'wb') as f:
        pickle.dump(label_encoder, f)
        
    print(f"Model and Encoders saved successfully!")

if __name__ == "__main__":
    train_and_save()
