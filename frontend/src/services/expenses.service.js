async function efetch(url, options = {}) {
  let result = {};
  let json = {};

  const token = sessionStorage.getItem('authToken');

  if (token) {
    options.headers = {
      ...options.headers,
      Authorization: `Bearer ${token}`
    };
  }

  try {
    result = await fetch(url, options);
    json = await result.json();
  } catch (error) {
    throw new Error(error.message);
  }

  if (!result.ok || json.status !== 'success') {
    throw new Error(json.message);
  }

  return json.data;
}

function makeExpensesService() {
  const baseUrl = '/api/v1/expenses';

  async function fetchExpenses() {
    let url = `${baseUrl}`;
    const data = await efetch(url);
    data.expenses = data.expenses.map((expense) => {
      return {
        ...expense
      };
    });
    return data;
  }

  async function fetchExpense(id) {
    const { expense } = await efetch(`${baseUrl}/${id}`);
    return {
      ...expense
    };
  }

  async function createExpense(expense) {
    return efetch(baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(expense)
    });
  }

  async function updateExpense(id, expense) {
    return efetch(`${baseUrl}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(expense)
    });
  }

  async function deleteExpense(id) {
    return efetch(`${baseUrl}/${id}`, {
      method: 'DELETE'
    });
  }

  return {
    fetchExpenses,
    fetchExpense,
    createExpense,
    updateExpense,
    deleteExpense
  };
}

export default makeExpensesService();
