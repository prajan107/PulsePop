// PulsePop Trend Explorer Filter & URL Sync Tests

export function testTrendSearchParamsParsing() {
  const queryParams = new URLSearchParams('search=ai&page=2&sort_by=trend_score');

  const search = queryParams.get('search');
  const page = Number(queryParams.get('page'));
  const sortBy = queryParams.get('sort_by');

  if (search !== 'ai' || page !== 2 || sortBy !== 'trend_score') {
    throw new Error('Search params parsing failed');
  }

  return true;
}

export function testSentimentBadgeScoreClassification() {
  const getLabel = (score: number) => {
    if (score >= 0.25) return 'Positive';
    if (score <= -0.25) return 'Negative';
    return 'Neutral';
  };

  if (getLabel(0.8) !== 'Positive') throw new Error('Positive sentiment failed');
  if (getLabel(-0.5) !== 'Negative') throw new Error('Negative sentiment failed');
  if (getLabel(0.1) !== 'Neutral') throw new Error('Neutral sentiment failed');

  return true;
}
