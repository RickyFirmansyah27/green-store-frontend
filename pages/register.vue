<script setup lang="ts">
definePageMeta({
  layout: 'public'
})

import { ref } from 'vue'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/composables/useAuth'
import { toast } from 'vue3-toastify'
import { useRouter } from 'vue-router'

const router = useRouter()
const auth = useAuth()

const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const isLoading = ref(false)

const togglePassword = () => {
  showPassword.value = !showPassword.value
}

const handleRegister = async () => {
  if (!name.value || !email.value || !password.value || !confirmPassword.value) {
    toast.error('Mohon lengkapi semua field', {
      autoClose: 3000,
      position: 'top-right'
    })
    return
  }

  if (password.value !== confirmPassword.value) {
    toast.error('Password tidak cocok', {
      autoClose: 3000,
      position: 'top-right'
    })
    return
  }

  try {
    isLoading.value = true
    const success = await auth.register(name.value, email.value, password.value)
    
    if (success) {
      toast.success('Registrasi berhasil!', {
        autoClose: 2000,
        position: 'top-right'
      })
      
      await new Promise(resolve => setTimeout(resolve, 2000))
      await router.push('/login')
    }
  } catch (error) {
    toast.error('Gagal melakukan registrasi', {
      autoClose: 3000,
      position: 'top-right'
    })
    console.error('Register error:', error)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center">
    <Card class="w-[400px]">
      <CardHeader>
        <CardTitle class="text-2xl font-bold text-center">Register</CardTitle>
      </CardHeader>
      <CardContent>
        <form @submit.prevent="handleRegister">
          <div class="grid gap-4">
            <div class="grid gap-2">
              <Label for="name">Nama</Label>
              <Input
                id="name"
                type="text"
                v-model="name"
                placeholder="Masukkan nama lengkap"
                required
              />
            </div>
            <div class="grid gap-2">
              <Label for="email">Email</Label>
              <Input
                id="email"
                type="email"
                v-model="email"
                placeholder="nama@email.com"
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
                  placeholder="Password minimal 8 karakter"
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
            <div class="grid gap-2">
              <Label for="confirm-password">Konfirmasi Password</Label>
              <Input
                id="confirm-password"
                :type="showPassword ? 'text' : 'password'"
                v-model="confirmPassword"
                placeholder="Ulangi password"
                required
              />
            </div>
            <Button type="submit" class="w-full" :disabled="isLoading">
              <span v-if="isLoading" class="flex items-center gap-2">
                <Icon name="ph:circle-notch" class="h-4 w-4 animate-spin" />
                Loading...
              </span>
              <span v-else>Register</span>
            </Button>
          </div>
        </form>
        <div class="mt-4 text-center text-sm">
          <p class="text-gray-600">
            Sudah punya akun?
            <NuxtLink to="/login" class="text-blue-600 hover:underline">
              Login disini
            </NuxtLink>
          </p>
        </div>
      </CardContent>
    </Card>
  </div>
</template>