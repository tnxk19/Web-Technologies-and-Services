<script setup>
import { ref } from 'vue';
import authService from '@/services/login.service';

const name = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const message = ref('');

async function onRegister() {
  if (password.value !== confirmPassword.value) {
    message.value = 'Wrong password';
    return;
  }

  try {
    const response = await authService.register({
      name: name.value,
      email: email.value,
      password: password.value
    });

    message.value = 'Registration successful';
    console.log('Registration successful:', response);
  } catch (error) {
    message.value = 'Registration failed';
    console.error('Registration error:', error.message);
  }
}
</script>

<template>
  <div class="register-container">
    <div class="register-box">
      <h4>Register</h4>
      <form @submit.prevent="onRegister">
        <div class="input-group">
          <label>Name:</label>
          <input type="text" v-model="name" required class="input-field" />
        </div>
        <div class="input-group">
          <label>Email:</label>
          <input type="email" v-model="email" required class="input-field" />
        </div>
        <div class="input-group">
          <label>Password:</label>
          <input type="password" v-model="password" required class="input-field" />
        </div>
        <div class="input-group">
          <label>Confirm Password:</label>
          <input type="password" v-model="confirmPassword" required class="input-field" />
        </div>
        <button type="submit" class="register-button">Register</button>
      </form>
      <p class="login-link">Already have an account? <a :href="'/login'">Login</a></p>
      <p class="message">{{ message }}</p>
    </div>
  </div>
</template>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80vh;
}

.register-box {
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

.register-button {
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

.login-link,
.message {
  color: #888;
  font-size: 0.875rem;
  margin-top: 1rem;
}

.login-link a {
  color: #4caf50;
  text-decoration: none;
}
</style>
