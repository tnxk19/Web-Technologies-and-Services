async function efetch(url, options = {}) {
  let result = {};
  let json = {};

  // Get token from sessionStorage (or localStorage, depending on how you're storing it)
  const token = sessionStorage.getItem('authToken');

  // Add token to headers if available
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

function makeCategoriesService() {
  const baseUrl = '/api/v1/categories';

  async function fetchCategories() {
    let url = `${baseUrl}`;
    const data = await efetch(url);
    data.categories = data.categories.map((category) => {
      return {
        ...category
      };
    });
    return data;
  }

  async function fetchCategory(id) {
    const { category } = await efetch(`${baseUrl}/${id}`);
    return {
      ...category
    };
  }

  async function createCategory(category) {
    return efetch(baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: category
    });
  }

  async function deleteAllCategories() {
    return efetch(baseUrl, {
      method: 'DELETE'
    });
  }

  async function updateCategory(id, category) {
    return efetch(`${baseUrl}/${id}`, {
      method: 'PUT',
      body: category
    });
  }

  async function deleteCategory(id) {
    return efetch(`${baseUrl}/${id}`, {
      method: 'DELETE'
    });
  }

  return {
    fetchCategories,
    fetchCategory,
    createCategory,
    updateCategory,
    deleteCategory,
    deleteAllCategories
  };
}

export default makeCategoriesService();
