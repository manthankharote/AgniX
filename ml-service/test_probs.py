import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.naive_bayes import GaussianNB
import urllib.request

url = "https://raw.githubusercontent.com/arzzahid66/Optimizing_Agricultural_Production/master/Crop_recommendation.csv"
df = pd.read_csv(url)

X = df[['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']]
y = df['label']

rf = RandomForestClassifier(n_estimators=100, random_state=42)
rf.fit(X, y)

nb = GaussianNB()
nb.fit(X, y)

test_input = [[90, 42, 43, 28, 70, 6.5, 150]]

rf_probs = rf.predict_proba(test_input)[0]
nb_probs = nb.predict_proba(test_input)[0]

print("RandomForest Top 3:")
rf_top = np.argsort(rf_probs)[-3:][::-1]
for i in rf_top:
    print(f"{rf.classes_[i]}: {rf_probs[i]*100:.2f}%")

print("\nGaussianNB Top 3:")
nb_top = np.argsort(nb_probs)[-3:][::-1]
for i in nb_top:
    print(f"{nb.classes_[i]}: {nb_probs[i]*100:.2f}%")
