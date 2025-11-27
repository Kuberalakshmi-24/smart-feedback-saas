from fastapi import FastAPI
from pydantic import BaseModel
from textblob import TextBlob
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

app = FastAPI()

# This allows your React app to talk to this Python backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Review(BaseModel):
    text: str

@app.post("/analyze")
def analyze_sentiment(review: Review):
    blob = TextBlob(review.text)
    polarity = blob.sentiment.polarity
    
    # Logic to determine sentiment label
    if polarity > 0.1:
        sentiment = "Positive"
    elif polarity < -0.1:
        sentiment = "Negative"
    else:
        sentiment = "Neutral"

    return {
        "sentiment": sentiment,
        "score": round(polarity, 2),
        "original_text": review.text
    }

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)