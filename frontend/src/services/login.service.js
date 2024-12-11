/**
 * @param {string} url
 * @param {RequestInit} options
 * @returns Promise<Response>
 */
async function efetch(url, options = {}) {
  let result = {};
  let json = {};
  try {
    result = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });
    json = await result.json();
  } catch (error) {
    throw new Error(error.message);
  }
  if (!result.ok || json.status !== 'success') {
    throw new Error(json.message);
  }
  return json.data;
}

function makeAuthService() {
  const authUrl = '/api/v1/users';

  async function login(credentials) {
    const data = await efetch(`${authUrl}/login`, {
      method: 'POST',
      body: JSON.stringify(credentials)
    });

    if (data.token) {
      sessionStorage.setItem('authToken', data.token);
    }

    return data;
  }

  async function register(details) {
    return efetch(`${authUrl}/register`, {
      method: 'POST',
      body: JSON.stringify(details)
    });
  }

  function logout() {
    sessionStorage.removeItem('authToken');
  }

  function getToken() {
    return sessionStorage.getItem('authToken');
  }

  return {
    login,
    register,
    logout,
    getToken
  };
}

export default makeAuthService();
