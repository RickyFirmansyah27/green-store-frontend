<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  Table,
  TableBody,
  TableCell,      
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table' // Assuming you have shadcn-vue table components
import { Input } from '@/components/ui/input'

// Sample contact data
const contacts = ref([
  { id: 1, name: 'John Doe', email: 'john@example.com', phone: '+1234567890', status: 'Active' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '+0987654321', status: 'Inactive' },
  { id: 3, name: 'Mike Johnson', email: 'mike@example.com', phone: '+1122334455', status: 'Active' },
])

const searchQuery = ref('')

// Filter contacts based on search query
const filteredContacts = computed(() => {
  return contacts.value.filter(contact => 
    contact.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    contact.phone.includes(searchQuery.value)
  )
})
</script>

<template>
  <div class="p-6">
    <div class="mb-8">
      <h1 class="text-2xl font-bold mb-4">Contacts</h1>
      <div class="flex gap-4 mb-6">
        <Input
          v-model="searchQuery"
          placeholder="Search contacts..."
          class="max-w-sm"
        />
      </div>
    </div>

    <div class="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow
            v-for="contact in filteredContacts"
            :key="contact.id"
          >
            <TableCell>{{ contact.name }}</TableCell>
            <TableCell>{{ contact.email }}</TableCell>
            <TableCell>{{ contact.phone }}</TableCell>
            <TableCell>
              <span
                :class="{
                  'px-2 py-1 rounded-full text-sm': true,
                  'bg-green-100 text-green-800': contact.status === 'Active',
                  'bg-gray-100 text-gray-800': contact.status === 'Inactive'
                }"
              >
                {{ contact.status }}
              </span>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  </div>
</template>

<style scoped>
.table-container {
  @apply border rounded-lg overflow-hidden;
}
</style>