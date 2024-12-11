<template>
  <div class="expense-form">
    <form @submit.prevent="submitForm">
      <h2>Add Expense</h2>
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

      <button type="submit" class="category-button">Add Expense</button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import categoriesService from '@/services/categories.service';
import expensesService from '@/services/expenses.service';

const router = useRouter();

const expense = ref({
  category_id: '',
  amount: '',
  description: '',
  date: ''
});

const categories = ref([]);
const selectedCategory = ref('');
const isAddingNewCategory = ref(false);
const newCategoryName = ref('');

const fetchCategories = async () => {
  try {
    const response = await categoriesService.fetchCategories();
    categories.value = response.categories;
  } catch (error) {
    console.error('Failed to fetch categories', error);
  }
};

const onCategoryChange = () => {
  isAddingNewCategory.value = selectedCategory.value === 'new';
};

const onAmountInput = (event) => {
  let value = event.target.value;
  value = value.replace(/[^\d.]/g, '');
  value = value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  event.target.value = value;
  expense.value.amount = value;
};

const submitForm = async () => {
  try {
    if (isAddingNewCategory.value) {
      expense.value.category = newCategoryName.value;
    } else {
      expense.value.category = selectedCategory.value;
    }

    const rawAmount = expense.value.amount.replace(/,/g, '');
    expense.value.amount = parseFloat(rawAmount);

    const response = await expensesService.createExpense(expense.value);
    console.log('Expense added successfully:', response);

    router.push('/');
  } catch (error) {
    console.error('Error adding expense:', error);
  }
};

onMounted(fetchCategories);
</script>

<style scoped>
.expense-form {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80vh;
}

h2 {
  margin-bottom: 1.5rem;
  color: #333;
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

input[type='text'] {
  font-family: 'Courier New', Courier, monospace;
}

textarea {
  resize: vertical;
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

.message {
  color: green;
  font-size: 0.875rem;
  margin-top: 1rem;
}
</style>
