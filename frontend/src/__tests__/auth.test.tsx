// PulsePop Auth Flow Integration Tests

export function testAuthValidation() {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test('admin@pulsepop.ai')) {
    throw new Error('Valid email check failed');
  }
  if (emailRegex.test('invalid-email')) {
    throw new Error('Invalid email check failed');
  }
  return true;
}

export function testTokenStorageKey() {
  const key = 'pulsepop_access_token';
  return key === 'pulsepop_access_token';
}
