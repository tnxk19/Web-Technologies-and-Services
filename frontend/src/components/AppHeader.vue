<script setup>
import { useRouter } from 'vue-router';
import { computed, ref, onMounted } from 'vue';
import authService from '@/services/login.service';
import VueJwtDecode from 'vue-jwt-decode';

const router = useRouter();

const isLoggedIn = computed(() => !!sessionStorage.getItem('authToken'));

const username = ref('');

async function handleLogout() {
  await authService.logout();
  router.push('/login').then(() => {
    window.location.reload();
  });
}
const decode = () => {
  //Take token from window local storage
  let token = sessionStorage.getItem('authToken');
  try {
    let decoded = VueJwtDecode.decode(token);
    username.value = decoded.name;
  } catch (err) {
    console.log('token is null: ', err);
  }
};
onMounted(() => {
  decode();
});
</script>
<template>
  <nav v-if="isLoggedIn" class="navbar navbar-expand bg-dark" data-bs-theme="dark">
    <div class="container-fluid">
      <!-- Navbar brand (title) -->
      <a href="/" class="navbar-brand">Financial Manage</a>

      <!-- Left-aligned navigation links -->
      <div class="me-auto navbar-nav">
        <li class="nav-item">
          <router-link :to="{ name: 'AddExpense' }" class="nav-link text-light">
            Add Expense
            <i class="fas fa-address-book ms-1"></i>
          </router-link>
        </li>
      </div>

      <!-- Right-aligned user info and logout button -->
      <div class="ms-auto navbar-nav me-3">
        <span class="navbar-text text-light fs-4">Hello, {{ username }}!</span>
        <button @click="handleLogout" class="btn btn-outline-light ms-3">Logout</button>
      </div>
    </div>
  </nav>
</template>

<style scoped></style>
