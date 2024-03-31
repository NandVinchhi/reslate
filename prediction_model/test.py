from transformers import pipeline

# Load the fine-tuned model
model_path = "./fine_tuned_model"
generator = pipeline("text2text-generation", model=model_path, tokenizer=model_path)

# Example input sentence
input_sentence = "Complete this sentence: I am"

# Generate a single completion
completion = generator(input_sentence, max_length=128, min_length=10)

# Print the generated completion
print(completion[0]["generated_text"])