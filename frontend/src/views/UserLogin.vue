<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import authService from '@/services/login.service';

const email = ref('');
const password = ref('');
const message = ref('');
const router = useRouter();

async function onLogin() {
  try {
    const response = await authService.login({
      email: email.value,
      password: password.value
    });
    message.value = 'Login successful';
    console.log('Login successful:', response);
    router.push('/').then(() => {
      window.location.reload();
    });
  } catch (error) {
    message.value = 'Login failed. Please try again.';
    console.error('Login error:', error.message);
  }
}
</script>

<template>
  <div class="login-container">
    <div class="login-box">
      <h4>Login</h4>
      <form @submit.prevent="onLogin">
        <div class="input-group">
          <label>Email:</label>
          <input type="email" v-model="email" required class="input-field" />
        </div>
        <div class="input-group">
          <label>Password:</label>
          <input type="password" v-model="password" required class="input-field" />
        </div>
        <button type="submit" class="login-button">Login</button>
      </form>
      <p class="register-link">Not registered? <a :href="'/register'">Create an account</a></p>
    </div>
  </div>
</template>
<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80vh;
}

.login-box {
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
  text-align: center;
  width: 100%;
  max-width: 400px;
  margin-bottom: 4%;
}

h4 {
  margin-bottom: 1rem;
  color: #333;
}

.input-group {
  margin-bottom: 1rem;
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

.login-button {
  width: 100%;
  padding: 0.75rem;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 1rem;
}

.register-link,
.home-link {
  color: #888;
  font-size: 0.875rem;
  margin-top: 1rem;
}

.register-link a,
.home-link a {
  color: #4caf50;
  text-decoration: none;
}
</style>
