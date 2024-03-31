from datasets import load_dataset
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM, DataCollatorForSeq2Seq, Trainer, TrainingArguments

# Load the generics_kb_best dataset
dataset = load_dataset("generics_kb", "generics_kb_best", split="train")


dataset = dataset.sort("score", reverse=True)
dataset = dataset.filter(lambda example: len(example["generic_sentence"]) >= 30)
dataset = dataset.select(range(10000))

# Load the Flan T5 small model and tokenizer
model_name = "google/flan-t5-small"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForSeq2SeqLM.from_pretrained(model_name)

# Preprocess the dataset
def preprocess_function(examples):
    inputs = ["Complete this sentence: " + " ".join(sentence.split()[:2]) for sentence in examples["generic_sentence"]]
    targets = examples["generic_sentence"]
    model_inputs = tokenizer(inputs, truncation=True, padding=True, max_length=128)
    labels = tokenizer(targets, truncation=True, padding=True, max_length=128)
    model_inputs["labels"] = labels["input_ids"]
    return model_inputs

processed_dataset = dataset.map(preprocess_function, batched=True, remove_columns=dataset.column_names)

# Define the data collator
data_collator = DataCollatorForSeq2Seq(tokenizer=tokenizer, model=model)

# Define the training arguments
training_args = TrainingArguments(
    output_dir="./results",
    evaluation_strategy="epoch",
    learning_rate=2e-5,
    per_device_train_batch_size=8,
    per_device_eval_batch_size=8,
    num_train_epochs=3,
    weight_decay=0.01,
    save_total_limit=3
)

# Create the Trainer
trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=processed_dataset,
    eval_dataset=processed_dataset,
    tokenizer=tokenizer,
    data_collator=data_collator,
)

# Fine-tune the model
trainer.train()

# Save the fine-tuned model
trainer.save_model("./fine_tuned_model")