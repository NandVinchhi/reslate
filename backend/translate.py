from typing import List
from google.cloud import translate_v2 as translate
translate_client = translate.Client()

def translate_text(target: str, text: List[str]) -> dict:
    result = translate_client.translate(text, target_language=target)

    final = []
    for i in result:
        final.append(i["translatedText"])

    return final


# print(translate_text("fr", ["Hey how are you doing"]))
