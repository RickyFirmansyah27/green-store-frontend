<script setup lang="ts">
definePageMeta({
  layout: 'public'
})

import { ref, onMounted } from 'vue'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/composables/useAuth'
import { toast } from 'vue3-toastify'
import { useRouter } from 'vue-router'

const router = useRouter()
const auth = useAuth()

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const isLoading = ref(false)

const togglePassword = () => {
  showPassword.value = !showPassword.value
}

const handleLogin = async () => {
  if (!email.value || !password.value) {
    toast.error('Mohon isi email dan password', {
      autoClose: 3000,
      position: 'top-right'
    })
    return
  }

  try {
    isLoading.value = true
    const success = await auth.login(email.value, password.value)
    
    if (success) {
      toast.success('Login berhasil!', {
        autoClose: 3000,
        position: 'top-right'
      })
      await router.push('/')
    } else {
      toast.error('Email atau password salah', {
        autoClose: 3000,
        position: 'top-right'
      })
    }
  } catch (error) {
    toast.error('Terjadi kesalahan', {
      autoClose: 3000,
      position: 'top-right'
    })
    console.error('Login error:', error)
  } finally {
    isLoading.value = false
  }
}


onMounted(() => {
  auth.checkAuth()
})
</script>

<template>
  <div class="flex min-h-[calc(100vh-4rem)] items-center justify-center">
    <Card class="w-[400px]">
      <CardHeader>
        <CardTitle class="text-2xl font-bold text-center">Login</CardTitle>
      </CardHeader>
      <CardContent>
        <form @submit.prevent="handleLogin">
          <div class="grid gap-4">
            <div class="grid gap-2">
              <Label for="email">Email</Label>
              <Input
                id="email"
                type="email"
                v-model="email"
                placeholder="example@gmail.com"
                required
              />
            </div>
            <div class="grid gap-2">
              <Label for="password">Password</Label>
              <div class="relative">
                <Input
                  id="password"
                  :type="showPassword ? 'text' : 'password'"
                  v-model="password"
                  placeholder="password"
                  required
                />
                <button
                  type="button"
                  @click="togglePassword"
                  class="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  <Icon
                    :name="showPassword ? 'ph:eye-slash' : 'ph:eye'"
                    class="h-5 w-5 text-gray-500"
                  />
                </button>
              </div>
            </div>
            <Button type="submit" class="w-full" :disabled="isLoading">
              <span v-if="isLoading" class="flex items-center gap-2">
                <Icon name="ph:circle-notch" class="h-4 w-4 animate-spin" />
                Loading...
              </span>
              <span v-else>Login</span>
            </Button>
          </div>
        </form>
        <div class="mt-4 text-center text-sm">
          <p class="text-gray-600">
            Belum punya akun?
            <NuxtLink to="/register" class="text-blue-600 hover:underline">
              Daftar disini
            </NuxtLink>
          </p>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

