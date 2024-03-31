import numpy as np
import librosa
import joblib

# Function to extract features from an audio file
def extract_features(file_path):
    try:
        # Load audio file
        audio, sample_rate = librosa.load(file_path, res_type='kaiser_fast')
        # Extract MFCCs
        mfccs = librosa.feature.mfcc(y=audio, sr=sample_rate, n_mfcc=40)
        mfccs_processed = np.mean(mfccs.T, axis=0)
    except Exception as e:
        print(f"Error encountered while parsing file: {file_path}")
        return None
    return mfccs_processed

# Function to predict from an audio file path
def predict(file_path):
    # Load the saved model and scaler
    model = joblib.load('model.joblib')
    scaler = joblib.load('scaler.joblib')
    
    # Extract features
    features = extract_features(file_path)
    if features is not None:
        # Scaling the extracted features
        features = scaler.transform([features])
        prediction = model.predict(features)
        # Returning 'M' or 'F'
        return 'M' if prediction == 0 else 'F'
    else:
        return "Error processing file"

