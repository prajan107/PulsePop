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


DUPLICATE_PROMPT_V1 = """Determine whether the following two texts describe the same real-world event, news story, or trend.

Text A:
"{text_a}"

Text B:
"{text_b}"

Return ONLY a valid JSON object with the following structure and no additional text or formatting:
{{
  "is_duplicate": boolean (true if they describe the same event/trend, false otherwise),
  "similarity_score": float (between 0.0 and 1.0 indicating degree of semantic duplication),
  "reason": "short explanation"
}}
"""

DUPLICATE_PROMPT = DUPLICATE_PROMPT_V1


ENTITY_EXTRACTION_PROMPT_V1 = """Extract named entities from the following text.
Supported entity types are strictly: PERSON, ORGANIZATION, COMPANY, PRODUCT, LOCATION, EVENT, TECHNOLOGY.

Text:
"{text}"

Return ONLY a valid JSON object with the following structure and no additional text or formatting:
{{
  "entities": [
    {{
      "name": "entity name",
      "type": "PERSON" | "ORGANIZATION" | "COMPANY" | "PRODUCT" | "LOCATION" | "EVENT" | "TECHNOLOGY",
      "confidence": float (between 0.0 and 1.0)
    }}
  ]
}}
"""

ENTITY_EXTRACTION_PROMPT = ENTITY_EXTRACTION_PROMPT_V1


TOPIC_CLASSIFICATION_PROMPT_V1 = """Classify the topics covered in the following text.
Supported topic labels are strictly: TECHNOLOGY, ARTIFICIAL_INTELLIGENCE, FINANCE, BUSINESS, ENTERTAINMENT, SPORTS, POLITICS, SCIENCE, HEALTH, GAMING, SOCIAL_MEDIA, OTHER.

Text to classify:
"{text}"

Return ONLY a valid JSON object with the following structure and no additional text or formatting:
{{
  "topics": [
    "TECHNOLOGY",
    "ARTIFICIAL_INTELLIGENCE"
  ],
  "confidence": float (between 0.0 and 1.0)
}}
"""

TOPIC_CLASSIFICATION_PROMPT = TOPIC_CLASSIFICATION_PROMPT_V1
