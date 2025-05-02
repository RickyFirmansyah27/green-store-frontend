<template>
  <div class="container mx-auto p-6">
    <h1 class="text-2xl font-bold mb-8">Pengaturan Aplikasi</h1>

    <!-- Company Information Section -->
    <div class="mb-8">
      <h2 class="text-xl font-semibold mb-4">Informasi Perusahaan</h2>
      <div class="max-w-lg">
        <label class="block mb-2">Nama Perusahaan</label>
        <input 
          v-model="companyName"
          type="text"
          class="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Masukkan nama perusahaan"
        />
      </div>
    </div>

    <!-- Auto Save Option -->
    <div class="mb-8">
      <label class="flex items-center space-x-2 cursor-pointer">
        <input 
          v-model="autoSave"
          type="checkbox"
          class="form-checkbox"
        />
        <span>Simpan otomatis saat mengedit data</span>
      </label>
    </div>

    <!-- Display Settings -->
    <div class="mb-8">
      <h2 class="text-xl font-semibold mb-4">Tampilan</h2>
      <p class="text-gray-600 mb-4">Ubah tampilan aplikasi sesuai preferensi Anda</p>
      
      <button 
        @click="toggleDarkMode"
        class="flex items-center space-x-2 px-4 py-2 border rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 dark:border-gray-600"
      >
        <Icon 
          :name="darkMode ? 'ph:moon-fill' : 'ph:moon'" 
          class="w-5 h-5"
        />
        <span>Mode Gelap</span>
      </button>
    </div>

    <!-- Save Button -->
    <button 
      @click="saveSettings"
      class="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
    >
      Simpan Pengaturan
    </button>

    <!-- About Section -->
    <div class="mt-12">
      <h2 class="text-xl font-semibold mb-4">Tentang Aplikasi</h2>
      <p class="text-gray-600 dark:text-gray-400">Green Store v1.0.0</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import 'vue3-toastify/dist/index.css'

// State
const companyName = ref('')
const autoSave = ref(false)
const darkMode = ref(false)

// Methods
const toggleDarkMode = () => {
  darkMode.value = !darkMode.value
  document.documentElement.classList.toggle('dark')
  localStorage.setItem('darkMode', darkMode.value.toString())
}

const saveSettings = () => {
  try {
    // Save settings logic here
    const settings = {
      companyName: companyName.value,
      autoSave: autoSave.value,
      darkMode: darkMode.value
    }
    
    localStorage.setItem('settings', JSON.stringify(settings))
    
    toast.success('Pengaturan berhasil disimpan!', {
      autoClose: 3000,
      position: 'top-right',
    })
  } catch (error) {
    toast.error('Gagal menyimpan pengaturan', {
      autoClose: 3000,
      position: 'top-right',
    })
  }
}

// Initialize settings from localStorage
onMounted(() => {
  try {
    const savedSettings = localStorage.getItem('settings')
    if (savedSettings) {
      const settings = JSON.parse(savedSettings)
      companyName.value = settings.companyName
      autoSave.value = settings.autoSave
      darkMode.value = settings.darkMode
      
      if (darkMode.value) {
        document.documentElement.classList.add('dark')
      }
    }
  } catch (error) {
    console.error('Failed to load settings:', error)
  }
})
</script>

<style lang="postcss" scoped>
.container {
  max-width: 1200px;
}

.form-checkbox {
  @apply h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500;
}

:deep(.Vue-Toastification__toast) {
  @apply dark:bg-gray-800 dark:text-white;
}
</style>
