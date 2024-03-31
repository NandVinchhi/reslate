import whisper

# Load the Whisper model
model = whisper.load_model("large")

# Transcribe the MP4 file
result = model.transcribe("srk.mp4", language="hi", task="translate")

# Print the English transcription
k = result["text"]

with open("t.txt", "w") as f:
    f.write(k)

