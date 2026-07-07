(async () => {
  try {
    // login
    const login = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'testuser@example.com', password: 'Password123' })
    });
    const loginBody = await login.json();
    const token = loginBody.data.token;
    console.log('logged in, token ok');

    // update email
    const newEmail = 'testuser+updated@example.com';
    const res = await fetch('http://localhost:5000/api/auth/me', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ email: newEmail })
    });
    console.log('update status', res.status);
    const body = await res.text();
    console.log('update body', body);

    // revert email
    const revert = await fetch('http://localhost:5000/api/auth/me', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ email: 'testuser@example.com' })
    });
    console.log('revert status', revert.status);
  } catch (e) {
    console.error(e);
  }
})();
