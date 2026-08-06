SENTIMENT_PROMPT = """Analyze the sentiment of the following text.
Categorize the sentiment into exactly one of these labels: positive, negative, neutral.

Text to analyze:
"{text}"

Return ONLY a valid JSON object with the following structure and no additional text or formatting:
{{
  "label": "positive" | "negative" | "neutral",
  "confidence": float (between 0.0 and 1.0),
  "reason": "short explanation"
}}
"""
