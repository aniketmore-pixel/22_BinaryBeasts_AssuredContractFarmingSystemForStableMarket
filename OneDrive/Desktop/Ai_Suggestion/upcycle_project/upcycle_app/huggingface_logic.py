from transformers import AutoModelForSeq2SeqLM, AutoTokenizer

# Load the model and tokenizer
model_name = "google/flan-t5-small"  # You can change this to another model
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForSeq2SeqLM.from_pretrained(model_name)

def generate_ideas(prompt, max_length=150):
    """
    Generate diverse creative upcycling ideas based on the prompt.
    """
    refined_prompt = (
    f"Here are examples of creative upcycling ideas:\n"
    "1. Turn an old chair into a garden planter by removing the seat and adding soil and plants.\n"
    "2. Repurpose a scratched table into a bookshelf by cutting it into smaller pieces and painting it.\n"
    "Now, provide 3 unique, creative, and practical upcycling ideas for the following furniture item: "
    f"{prompt}."
)


    inputs = tokenizer(refined_prompt, return_tensors="pt")
    outputs = model.generate(
        inputs.input_ids,
        max_length=max_length,
        num_return_sequences=3,  # Generate multiple suggestions
        num_beams=5,            # Use beam search for high-quality output
        top_k=50,               # Allow more diverse token choices
        top_p=0.9,              # Use nucleus sampling for randomness
        temperature=1.2,        # Increase randomness in generation
        early_stopping=True
    )
    
    # Decode each suggestion into a list
    suggestions = [tokenizer.decode(output, skip_special_tokens=True) for output in outputs]
    return suggestions
