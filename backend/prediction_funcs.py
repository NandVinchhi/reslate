from transformers import pipeline
import concurrent.futures
import requests
import json
import string

def process_first_sentence(text):
    # Split the text into sentences using the period as a delimiter
    sentences = text.split('.')
    
    # Get the first sentence (if there is one)
    if len(sentences) > 0:
        first_sentence = sentences[0]
    else:
        return ""
    
    # Remove all punctuation from the sentence
    first_sentence = first_sentence.translate(str.maketrans("", "", string.punctuation))
    
    # Remove leading and trailing whitespace
    first_sentence = first_sentence.strip()
    
    # Convert the sentence to lowercase
    first_sentence = first_sentence.lower()
    
    return first_sentence

model_path = "./fine_tuned_model"
generator = pipeline("text2text-generation", model=model_path, tokenizer=model_path)

def predict_flan(k):
    completion = generator("Complete this sentence: " + k, max_length=128)
    return process_first_sentence(completion[0]["generated_text"])


def predict_mistral(k):
    prompt = "Complete this sentence to make it between 5 and 8 words and make sense in a common context: " + k
    url = "http://localhost:11434/api/generate"
    data = {
        "model": "mistral",
        "prompt": prompt,
        "stream": False,
        "options": {"temperature": 0}
    }
    headers = {"Content-Type": "application/json"}
    
    response = requests.post(url, data=json.dumps(data), headers=headers)
    
    if response.status_code == 200:
        result = response.json()
        return process_first_sentence(result["response"])
    else:
        return f"Error: {response.status_code} - {response.text}"


def parallel_functions(X):
    with concurrent.futures.ThreadPoolExecutor() as executor:
        future1 = executor.submit(predict_flan, X)
        future2 = executor.submit(predict_mistral, X)

        result1 = future1.result()
        result2 = future2.result()

    return result1, result2