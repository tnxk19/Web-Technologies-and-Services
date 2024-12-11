<template>
  <div class="expense-history">
    <h2>Expense History</h2>
    <p v-if="message" class="error-message">{{ message }}</p>

    <ul v-if="paginatedExpenses.length">
      <li v-for="expense in paginatedExpenses" :key="expense.id" class="expense-item">
        <div class="expense-info">
          <div class="expense-category-amount">
            <h5>
              {{ expense.category_name || 'Category Not Found' }} -
              {{ formattedAmount(expense.amount) }} VND
            </h5>
          </div>
          <div class="expense-description">
            <p>{{ expense.description }}</p>
          </div>
          <!-- <div class="expense-date">
            <p>{{ formatExpenseDate(expense.date) }}</p>
          </div> -->
          <div class="expense-created-at">
            <p>{{ formatCreatedAt(expense.created_at) }}</p>
          </div>
          <div class="expense-actions">
            <button @click="editExpense(expense.id)" class="btn-edit">Edit</button>
          </div>
        </div>
      </li>
    </ul>

    <div v-if="expenses.length" class="pagination">
      <button @click="prevPage" :disabled="currentPage === 1" class="arrow-btn">
        <i class="fa-solid fa-chevron-left"></i>
      </button>

      <span>{{ currentPage }} / {{ totalPages }}</span>

      <button @click="nextPage" :disabled="currentPage === totalPages" class="arrow-btn">
        <i class="fa-solid fa-chevron-right"></i>
      </button>
    </div>

    <p v-else>No expenses found.</p>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import expensesService from '@/services/expenses.service';
import categoriesService from '@/services/categories.service';

const router = useRouter();
const expenses = ref([]);
const message = ref('');
const currentPage = ref(1);
const itemsPerPage = 5;

async function fetchExpenses(page = 1, limit = 10) {
  try {
    const data = await expensesService.fetchExpenses(page, limit);

    const categories = await fetchCategories();

    expenses.value = data.expenses
      .map((expense) => {
        const category = categories.find((cat) => cat.id === expense.category_id);
        return {
          ...expense,
          category_name: category ? category.name : 'Category Not Found'
        };
      })
      .sort((a, b) => b.id - a.id);
  } catch (error) {
    message.value = 'Failed to load expenses: ' + error.message;
  }
}

async function fetchCategories() {
  try {
    const data = await categoriesService.fetchCategories();
    return data.categories || [];
  } catch (error) {
    message.value = 'Failed to load categories: ' + error.message;
    return [];
  }
}

function formattedAmount(amount) {
  return new Intl.NumberFormat().format(amount);
}

// function formatExpenseDate(dateString) {
//   const date = new Date(dateString);
//   return date.toLocaleDateString(); // Only return the date part (11/12/2024)
// }

function formatCreatedAt(dateString) {
  const date = new Date(dateString);
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
}

const totalPages = computed(() => Math.ceil(expenses.value.length / itemsPerPage));

const paginatedExpenses = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return expenses.value.slice(start, end);
});

function prevPage() {
  if (currentPage.value > 1) currentPage.value--;
}

function nextPage() {
  if (currentPage.value < totalPages.value) currentPage.value++;
}

function editExpense(id) {
  console.log('Edit expense with ID:', id);
  router.push({ name: 'EditExpense', params: { id } });
}

onMounted(() => {
  fetchExpenses(currentPage.value, itemsPerPage);
});
</script>

<style scoped>
.expense-history {
  padding: 2rem;
  text-align: center;
}

h2 {
  margin-bottom: 1.5rem;
  color: #333;
}

.error-message {
  color: red;
  font-size: 1rem;
  margin-bottom: 1rem;
}

ul {
  list-style-type: none;
  padding: 0;
}

.expense-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 0.5rem;
  flex-wrap: nowrap; /* Prevent wrapping */
}

.expense-info {
  display: flex;
  justify-content: space-between;
  flex-wrap: nowrap; /* Prevent wrapping */
  width: 100%;
}

.expense-category-amount,
.expense-description,
.expense-date,
.expense-created-at,
.expense-actions {
  flex: 1;
  text-align: center;
}

.expense-category-amount {
  text-align: left;
  flex: 0 0 auto;
}

.expense-actions {
  flex: 0 0 auto;
  text-align: right;
}

.btn-edit {
  padding: 0.5rem 1rem;
  border: none;
  cursor: pointer;
  border-radius: 4px;
  background-color: #4caf50;
  color: white;
}

.btn-edit:hover {
  background-color: #45a049;
}

.pagination {
  margin-top: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
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
</style>
