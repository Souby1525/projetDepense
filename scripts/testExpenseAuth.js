(async () => {
  try {
    const login = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'testuser@example.com', password: 'Password123' })
    });
    const loginBody = await login.json();
    const token = loginBody.data.token;
    console.log('token', token.slice(0, 20) + '...');

    const res = await fetch('http://localhost:5000/api/expenses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ date: new Date().toISOString(), category: 'Test', description: 'Test expense', amount: 12345, paymentMethod: 'Espèces' })
    });
    console.log('create expense status', res.status);
    const body = await res.text();
    console.log('body', body);
  } catch (e) {
    console.error(e);
  }
})();
