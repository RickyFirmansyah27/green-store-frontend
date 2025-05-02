<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { onMounted, ref } from 'vue'

const auth = useAuth()
const router = useRouter()
onMounted(() => {
  const isAuthenticated = auth.checkAuth()
  if (!isAuthenticated) {
    router.push('/login')
  }
})
</script>
