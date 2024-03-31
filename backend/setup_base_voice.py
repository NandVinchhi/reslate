# Please create a file named .env and place your
# OpenAI key as OPENAI_API_KEY=xxx
from openai import OpenAI
from dotenv import load_dotenv
import os
from openvoice import se_extractor
import pickle
from openvoice.api import ToneColorConverter
import torch

ckpt_converter = 'checkpoints/converter'
device="cuda:0" if torch.cuda.is_available() else "cpu"
tone_color_converter = ToneColorConverter(f'{ckpt_converter}/config.json', device=device)
tone_color_converter.load_ckpt(f'{ckpt_converter}/checkpoint.pth')

load_dotenv()

output_dir = 'outputs'
os.makedirs(output_dir, exist_ok=True)
client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))

response = client.audio.speech.create(
    model="tts-1",
    voice="onyx",
    input="This audio will be used to extract the base speaker tone color embedding. " + \
        "Typically a very short audio should be sufficient, but increasing the audio " + \
        "length will also improve the output audio quality."
)

response.stream_to_file(f"{output_dir}/openai_source_output_m.mp3")

base_speaker = f"{output_dir}/openai_source_output_m.mp3"
source_se, audio_name = se_extractor.get_se(base_speaker, tone_color_converter, vad=True)

with open("source_se_m.bin", "wb") as f:
    pickle.dump(source_se, f)

response1 = client.audio.speech.create(
    model="tts-1",
    voice="nova",
    input="This audio will be used to extract the base speaker tone color embedding. " + \
        "Typically a very short audio should be sufficient, but increasing the audio " + \
        "length will also improve the output audio quality."
)

response1.stream_to_file(f"{output_dir}/openai_source_output_f.mp3")

base_speaker1 = f"{output_dir}/openai_source_output_f.mp3"
source_se1, audio_name = se_extractor.get_se(base_speaker1, tone_color_converter, vad=True)

with open("source_se_f.bin", "wb") as f:
    pickle.dump(source_se1, f)