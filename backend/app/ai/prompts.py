SENTIMENT_PROMPT_V1 = """Analyze the sentiment of the following text.
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

SENTIMENT_PROMPT = SENTIMENT_PROMPT_V1


SUMMARY_PROMPT_V1 = """Summarize the following text into a concise summary and a list of key points.

Text to summarize:
"{text}"

Return ONLY a valid JSON object with the following structure and no additional text or formatting:
{{
  "summary": "a clear and concise summary of the text",
  "key_points": [
    "first key point",
    "second key point"
  ],
  "confidence": float (between 0.0 and 1.0)
}}
"""

SUMMARY_PROMPT = SUMMARY_PROMPT_V1
