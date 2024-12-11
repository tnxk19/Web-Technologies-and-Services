<template>
  <div class="category-list">
    <p v-if="message" class="error-message">{{ message }}</p>

    <div v-if="totalAmount > 0" class="category-items total-amount-row">
      <div class="category-item total-amount-card">
        <h4>Total Amount</h4>
        <p>{{ formattedAmount(totalAmount) }} VND</p>
      </div>
    </div>

    <div v-if="categories.length" class="category-container">
      <button
        v-if="categories.length > itemsPerPage"
        @click="prevPage"
        :disabled="currentPage === 1"
        class="arrow-btn"
      >
        <i class="fa-solid fa-chevron-left"></i>
      </button>

      <div class="category-items">
        <div v-for="category in paginatedCategories" :key="category.id" class="category-item">
          <h4>{{ category.name }}</h4>
          <p>{{ formattedAmount(category.totalAmount) }} VND</p>
        </div>
      </div>

      <button
        v-if="categories.length > itemsPerPage"
        @click="nextPage"
        :disabled="currentPage === totalPages"
        class="arrow-btn"
      >
        <i class="fa-solid fa-chevron-right"></i>
      </button>
    </div>

    <p v-else>No categories found.</p>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import categoriesService from '@/services/categories.service';
import expensesService from '@/services/expenses.service';

const categories = ref([]);
const totalAmount = ref(0);
const message = ref('');
const itemsPerPage = 3;
const currentPage = ref(1);

async function fetchCategories() {
  try {
    const data = await categoriesService.fetchCategories();
    const categoriesData = data.categories || [];

    const expenses = await fetchExpenses();

    categories.value = categoriesData.map((category) => {
      const totalCategoryAmount = expenses
        .filter((expense) => expense.category_id === category.id)
        .reduce((sum, expense) => sum + expense.amount, 0);

      return {
        ...category,
        totalAmount: totalCategoryAmount
      };
    });

    totalAmount.value = categories.value.reduce((sum, category) => sum + category.totalAmount, 0);
  } catch (error) {
    message.value = 'Failed to load categories or expenses: ' + error.message;
  }
}

async function fetchExpenses() {
  try {
    const data = await expensesService.fetchExpenses();
    return data.expenses || [];
  } catch (error) {
    message.value = 'Failed to load expenses: ' + error.message;
    return [];
  }
}

function formattedAmount(amount) {
  return new Intl.NumberFormat().format(amount);
}

const paginatedCategories = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return categories.value.slice(start, end);
});

const totalPages = computed(() => Math.ceil(categories.value.length / itemsPerPage));

function prevPage() {
  if (currentPage.value > 1) currentPage.value--;
}

function nextPage() {
  if (currentPage.value < totalPages.value) currentPage.value++;
}

onMounted(fetchCategories);
</script>

<style scoped>
.category-list {
  padding: 2rem;
  text-align: center;
}

.error-message {
  color: red;
  font-size: 1rem;
  margin-bottom: 1rem;
}

.category-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.arrow-btn {
  background: none;
  border: none;
  font-size: 2rem;
  color: #4caf50;
  cursor: pointer;
}

.arrow-btn:disabled {
  color: #ccc;
  cursor: not-allowed;
}

.category-items {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.category-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 220px;
  height: 150px;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.category-item h4 {
  color: #4caf50;
  margin: 0;
  font-size: 2rem;
}

.category-item p {
  color: #555;
  font-size: 1.5rem;
}

.category-item:hover {
  background-color: #f0f0f0;
  cursor: pointer;
}

.total-amount-row {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.total-amount-card {
  background-color: #e8f5e9;
  border: 1px solid #81c784;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  width: 290px;
  height: 150px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.total-amount-card h4 {
  color: #388e3c;
  margin: 0;
  font-size: 2.5rem;
}

.total-amount-card p {
  color: #2e7d32;
  font-size: 1.8rem;
}
</style>
