from django.shortcuts import render
from .huggingface_logic import generate_ideas

def upload_furniture(request):
    if request.method == "POST":
        furniture_name = request.POST.get("furniture_name", "furniture")
        prompt = f"Suggest creative upcycling ideas for a {furniture_name}."

        # Call the Hugging Face model to generate multiple suggestions
        suggestions = generate_ideas(prompt)

        return render(request, "upcycle_app/results.html", {
            "furniture_name": furniture_name,
            "suggestions": suggestions,  # Pass the list of suggestions
        })

    return render(request, "upcycle_app/upload.html")
