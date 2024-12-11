<template>
  <div>
    <div class="category-list">
      <CategoryList />
    </div>
  </div>
  <ExpensesHistory />
</template>

<script setup>
import { ref, onMounted } from 'vue';
import categoriesService from '@/services/categories.service';
import ExpensesHistory from '@/components/ExpensesHistory.vue';
import CategoryList from '@/components/CategoryList.vue';

const categories = ref([]);
const message = ref('');

async function fetchCategories() {
  try {
    const data = await categoriesService.fetchCategories(1, 20);
    categories.value = data.categories;
  } catch (error) {
    message.value = 'Failed to load categories: ' + error.message;
  }
}
onMounted(fetchCategories);
</script>

<style scoped>
.category-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
}
</style>
