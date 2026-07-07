(async () => {
  try {
    const reg = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Test User', email: 'testuser@example.com', password: 'Password123' })
    });
    console.log('register status', reg.status);
    const regBody = await reg.text();
    console.log('register body', regBody);
  } catch (e) {
    console.error('register error', e);
  }

  try {
    const login = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'testuser@example.com', password: 'Password123' })
    });
    console.log('login status', login.status);
    const loginBody = await login.text();
    console.log('login body', loginBody);
  } catch (e) {
    console.error('login error', e);
  }
})();
