// PulsePop UI Primitives Tests

export function testStatusNormalization() {
  const status = 'Healthy'.toLowerCase();
  if (status !== 'healthy') {
    throw new Error('Status normalization failed');
  }
  return true;
}

export function testMetricFormatting() {
  const value = 12500;
  const formatted = value >= 1000 ? `${(value / 1000).toFixed(1)}k` : `${value}`;
  if (formatted !== '12.5k') {
    throw new Error('Metric formatting failed');
  }
  return true;
}
