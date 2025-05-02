<script setup>
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/composables/useAuth'
import { toast } from 'vue3-toastify'

const auth = useAuth()
const loading = ref(false)
let data = ref([])
const list = [
  {
    title: "Today"
  }, {
    title: "Week"
  }, {
    title: "Month"
  }, {
    title: "Year"
  }
]

let currentCategory = ref("today");

function generateRandomValue(number = 7) {
  let values = [];
  for (let j = 0; j < number + 1; j++) {
    values.push(Math.floor(Math.random() * 100));
  }
  data.value = values;
  return values;
}

const setCategory = (e) => {
  let v = e.target.innerText.toLowerCase();
  currentCategory.value = v
  if (v === 'today') generateRandomValue(24);
  if (v === 'week') generateRandomValue(7);
  if (v === 'month') generateRandomValue(31);
  if (v === 'year') generateRandomValue(365);
}

const cards = [
  {
    title: "Sales",
    progression: 12,
    amount: 1244.43,
    label: "View sales",
    description: "Sales of March 2024",
    icon: "solar:ticket-sale-outline"
  },
  {
    title: "Refunds",
    progression: 8,
    amount: 84.44,
    label: "View refunds",
    description: "Refunds since beginning of year",
    icon: "heroicons-outline:receipt-refund"
  },
  {
    title: "Payouts",
    progression: 14,
    amount: 899.99,
    label: "View payouts",
    description: "Payouts of this week",
    icon: "tabler:zoom-money"
  }
]

const handleLogout = async () => {
  try {
    loading.value = true
    
    await new Promise((resolve) => {
      toast.success('Logout berhasil!', {
        autoClose: 1000,
        position: 'bottom-right',
        onClose: resolve
      })
    })

    await auth.logout()
    
  } catch (error) {
    toast.error('Gagal logout', {
      autoClose: 1000,
      position: 'bottom-right'
    })
    console.error('Logout error:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  generateRandomValue(24);
})
</script>

<template>
  <div class="grid w-full gap-4">
    <header class="flex items-start justify-between">
      <div class="grow">
        <p>Hi, welcome back !</p>
        <h1>Dashboard</h1>
      </div>
      <div class="flex items-center gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          class="hidden lg:inline-flex"
          :disabled="loading"
          @click="handleLogout"
        >
          <span v-if="loading" class="flex items-center gap-2">
            <Icon name="ph:circle-notch" class="h-4 w-4 animate-spin" />
            Loading...
          </span>
          <span v-else>Logout</span>
        </Button>
      </div>
    </header>
    <main class="grid w-full gap-4">
      <Tabs default-value="Today" class="w-full" @click="setCategory">
        <TabsList class="max-w-[400px]">
          <TabsTrigger v-for="item, index in list" :key="index" :value="item.title">
            {{ item.title }}
          </TabsTrigger>
        </TabsList>
        <TabsContent class="w-[100%]" v-for="item, index in  list " :key="index" :value="item.title">
          <Chart v-if="data.length > 0" :currentCategory="currentCategory" :data="data" />
        </TabsContent>
      </Tabs>
    </main>
    <footer>
      <div class="grid gap-4 lg:grid-cols-3">
        <Card v-for='( item, index ) in  cards' :card="item" :key='index' />
      </div>
    </footer>
  </div>
</template>
