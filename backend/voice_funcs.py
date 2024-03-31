import os
import torch
from openvoice import se_extractor
from openvoice.api import ToneColorConverter
from openai import OpenAI
from dotenv import load_dotenv
import pickle
import uuid
import concurrent.futures

ckpt_converter = 'checkpoints/converter'
device="cuda:0" if torch.cuda.is_available() else "cpu"
output_dir = 'outputs'

tone_color_converter = ToneColorConverter(f'{ckpt_converter}/config.json', device=device)
tone_color_converter.load_ckpt(f'{ckpt_converter}/checkpoint.pth')

source_se_m = None
source_se_f = None
with open("source_se_m.bin", "rb") as f:
    source_se_m = pickle.load(f)
with open("source_se_f.bin", "rb") as f:
    source_se_f = pickle.load(f)

load_dotenv() 

client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))

# text = [
#     "MyShell is a decentralized and comprehensive platform for discovering, creating, and staking AI-native apps.",
#     "MyShell es una plataforma descentralizada y completa para descubrir, crear y apostar por aplicaciones nativas de IA.",
#     "MyShell est une plateforme décentralisée et complète pour découvrir, créer et miser sur des applications natives d'IA.",
#     "MyShell ist eine dezentralisierte und umfassende Plattform zum Entdecken, Erstellen und Staken von KI-nativen Apps.",
#     "MyShell è una piattaforma decentralizzata e completa per scoprire, creare e scommettere su app native di intelligenza artificiale.",
#     "MyShellは、AIネイティブアプリの発見、作成、およびステーキングのための分散型かつ包括的なプラットフォームです。",
#     "MyShell — это децентрализованная и всеобъемлющая платформа для обнаружения, создания и стейкинга AI-ориентированных приложений.",
#     "MyShell هي منصة لامركزية وشاملة لاكتشاف وإنشاء ورهان تطبيقات الذكاء الاصطناعي الأصلية.",
#     "MyShell是一个去中心化且全面的平台，用于发现、创建和投资AI原生应用程序。",
#     "MyShell एक विकेंद्रीकृत और व्यापक मंच है, जो AI-मूल ऐप्स की खोज, सृजन और स्टेकिंग के लिए है।",
#     "MyShell é uma plataforma descentralizada e abrangente para descobrir, criar e apostar em aplicativos nativos de IA."
# ]


def create_voice(reference_mp3):
    target_se, audio_name = se_extractor.get_se(reference_mp3, tone_color_converter, vad=True)
    voice_id = str(uuid.uuid1())

    with open("voices/" + voice_id + ".bin", "wb") as f:
        pickle.dump(target_se, f)
    
    return voice_id

def generate_audio(text_input, voice_id, voice_classification):

    output_id = str(uuid.uuid1())
    src_path = f'{output_dir}/{output_id}_tmp.wav'

    if voice_classification == "M":
        response = client.audio.speech.create(
            model="tts-1",
            voice="onyx",
            input=text_input,
        )
    else:
        response = client.audio.speech.create(
            model="tts-1",
            voice="nova",
            input=text_input,
        )
    response.stream_to_file(src_path)

    save_path = f'{output_dir}/{output_id}_final.wav'

    target_se = None
    with open("voices/" + voice_id + ".bin", "rb") as f:
        target_se = pickle.load(f)
    encode_message = "@MyShell"

    if (voice_classification == "M"):
        tone_color_converter.convert(
            audio_src_path=src_path, 
            src_se=source_se_m, 
            tgt_se=target_se, 
            output_path=save_path,
            message=encode_message)
    else:
        tone_color_converter.convert(
            audio_src_path=src_path, 
            src_se=source_se_f, 
            tgt_se=target_se, 
            output_path=save_path,
            message=encode_message)
    
    return output_id

def generate_parallel(ta, tb, voice_id, voice_classification):
    with concurrent.futures.ThreadPoolExecutor() as executor:
        future1 = executor.submit(generate_audio, ta, voice_id, voice_classification)
        future2 = executor.submit(generate_audio, tb, voice_id, voice_classification)

        result1 = future1.result()
        result2 = future2.result()

    return result1, result2

# vid = create_voice("srk_ff.mp3")

# oid = generate_audio("There is a person on the other side of the border. He will give his life for you.", vid, "M")

# print(oid)