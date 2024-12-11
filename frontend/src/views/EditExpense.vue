<template>
  <div class="expense-form">
    <form @submit.prevent="submitForm">
      <h2>Edit Expense</h2>
      <div class="input-group">
        <label for="category">Category</label>
        <select v-model="selectedCategory" @change="onCategoryChange" required class="input-field">
          <option v-for="category in categories" :key="category.id" :value="category.name">
            {{ category.name }}
          </option>
          <option value="new">Add New Category</option>
        </select>

        <input
          v-if="isAddingNewCategory"
          type="text"
          v-model="newCategoryName"
          placeholder="Enter new category name"
          required
          class="input-field mt-2"
        />
      </div>

      <div class="input-group">
        <label for="amount">Amount</label>
        <input
          type="text"
          v-model="expense.amount"
          @input="onAmountInput"
          required
          class="input-field"
          placeholder="Enter amount"
        />
      </div>

      <div class="input-group">
        <label for="description">Description</label>
        <textarea v-model="expense.description" class="input-field"></textarea>
      </div>

      <div class="input-group">
        <label for="date">Date</label>
        <input type="date" v-model="expense.date" required class="input-field" />
      </div>

      <button type="submit" class="category-button">Save Changes</button>
      <button type="button" @click="confirmDelete" class="delete-button">Delete Expense</button>
      <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import expensesService from '@/services/expenses.service';
import categoriesService from '@/services/categories.service';

const expense = ref({
  category: '',
  amount: '',
  description: '',
  date: ''
});
const successMessage = ref('');
const route = useRoute();
const router = useRouter();
const categories = ref([]);
const selectedCategory = ref('');
const isAddingNewCategory = ref(false);
const newCategoryName = ref('');

const onCategoryChange = () => {
  isAddingNewCategory.value = selectedCategory.value === 'new';
};

const fetchCategories = async () => {
  try {
    const response = await categoriesService.fetchCategories();
    categories.value = response.categories;
  } catch (error) {
    console.error('Failed to fetch categories', error);
  }
};

onMounted(async () => {
  await fetchCategories();
  const expenseId = parseInt(route.params.id);
  try {
    const response = await expensesService.fetchExpenses();
    const expenses = response.expenses || [];
    const selectedExpense = expenses.find((e) => e.id === expenseId);

    if (selectedExpense) {
      const selectedCategoryObj = categories.value.find(
        (category) => category.id === selectedExpense.category_id
      );
      selectedCategory.value = selectedCategoryObj ? selectedCategoryObj.name : '';
    }

    if (selectedExpense) {
      expense.value = {
        category: selectedExpense.category_id,
        amount: selectedExpense.amount.toLocaleString(),
        description: selectedExpense.description,
        date: selectedExpense.date.split('T')[0]
      };
    }
  } catch (error) {
    console.error('Failed to fetch expense data:', error.message);
  }
});
onMounted(fetchCategories);

function onAmountInput(event) {
  let value = event.target.value.replace(/[^\d.]/g, '');
  value = value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  expense.value.amount = value;
}

async function submitForm() {
  const expenseId = parseInt(route.params.id);

  if (isAddingNewCategory.value) {
    expense.value.category = newCategoryName.value;
  } else {
    expense.value.category = selectedCategory.value;
  }

  if (!expense.value.category) {
    alert('Please select or enter a category.');
    return;
  }
  try {
    await expensesService.updateExpense(expenseId, {
      ...expense.value,
      amount: parseFloat(expense.value.amount.replace(/,/g, '')) || 0
    });
    successMessage.value = 'Expense updated successfully!';
    setTimeout(() => {
      successMessage.value = '';
      router.push('/');
    }, 3000);
  } catch (error) {
    console.error('Failed to update expense:', error.message);
    alert(`Failed to update expense: ${error.message}`);
  }
}

function confirmDelete() {
  if (window.confirm('Are you sure you want to delete this expense?')) {
    deleteExpense();
  }
}

async function deleteExpense() {
  const expenseId = parseInt(route.params.id);
  try {
    await expensesService.deleteExpense(expenseId);
    successMessage.value = 'Expense deleted successfully!';
    setTimeout(() => {
      successMessage.value = '';
      router.push('/');
    }, 3000);
  } catch (error) {
    console.error('Failed to delete expense:', error.message);
    alert(`Failed to delete expense: ${error.message}`);
  }
}
</script>

<style scoped>
.expense-form {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

h2 {
  margin-bottom: 1.5rem;
  color: #333;
  text-align: center;
}

.success-message {
  color: green;
  font-size: 1rem;
  margin-bottom: 1rem;
  text-align: center;
}

form {
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 400px;
}

.input-group {
  margin-bottom: 1.5rem;
  text-align: left;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  color: #333;
}

.input-field {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

button.category-button {
  width: 100%;
  padding: 0.75rem;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
}

button.category-button:hover {
  background-color: #45a049;
}

button.delete-button {
  width: 100%;
  padding: 0.75rem;
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 1rem;
}

button.delete-button:hover {
  background-color: #e53935;
}
</style>
