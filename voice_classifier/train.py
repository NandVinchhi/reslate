import os
import numpy as np
import librosa
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.svm import SVC
from sklearn.metrics import accuracy_score
import joblib  # Import joblib

# Directory containing your .wav files
data_dir = "./voicedata"

# Function to extract features from an audio file
def extract_features(file_path):
    try:
        audio, sample_rate = librosa.load(file_path, res_type='kaiser_fast')
        mfccs = librosa.feature.mfcc(y=audio, sr=sample_rate, n_mfcc=40)
        mfccs_processed = np.mean(mfccs.T, axis=0)
    except Exception as e:
        print("Error encountered while parsing file: ", file_path)
        return None, None
    return mfccs_processed

# Preparing the dataset
features = []
labels = []

# Iterate through each file, extracting features and labels
for file in os.listdir(data_dir):
    print(file)
    if file.endswith(".wav"):
        file_path = os.path.join(data_dir, file)
        mfccs_processed = extract_features(file_path)
        if mfccs_processed is not None:
            features.append(mfccs_processed)
            # Assuming the filename starts with 'm' or 'f' for labeling
            labels.append(0 if file.startswith('m') else 1)

# Converting lists to numpy arrays
X = np.array(features)
y = np.array(labels)

# Splitting dataset into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=0)

# Feature scaling
scaler = StandardScaler()
X_train = scaler.fit_transform(X_train)
X_test = scaler.transform(X_test)

# Training a Support Vector Machine classifier
model = SVC(kernel='linear')
model.fit(X_train, y_train)

# Predicting on the test set
y_pred = model.predict(X_test)

# Evaluating the model
print("Accuracy:", accuracy_score(y_test, y_pred))
model_filename = 'model.joblib'
scaler_filename = 'scaler.joblib'
joblib.dump(model, model_filename)
joblib.dump(scaler, scaler_filename)