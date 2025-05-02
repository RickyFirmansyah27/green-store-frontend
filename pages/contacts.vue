<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from 'radix-vue'
import {
  Table,
  TableBody,
  TableCell,      
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useContacts, type Contact } from '@/composables/useContacts'

const { contacts, addContact, updateContact, deleteContact } = useContacts()

const searchQuery = ref('')
const isDialogOpen = ref(false)
const editingContact = ref<Partial<Contact> | null>(null)

const formData = ref<{
  name: string
  email: string
  phone: string
  status: 'Active' | 'Inactive'
}>({
  name: '',
  email: '',
  phone: '',
  status: 'Active'
})

const resetForm = () => {
  formData.value = {
    name: '',
    email: '',
    phone: '',
    status: 'Active'
  }
  editingContact.value = null
}

const handleSubmit = () => {
  if (editingContact.value?.id) {
    updateContact(editingContact.value.id, formData.value)
  } else {
    addContact(formData.value)
  }
  isDialogOpen.value = false
  resetForm()
}

const editContact = (contact: Contact) => {
  editingContact.value = contact
  formData.value = { ...contact }
  isDialogOpen.value = true
}

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
      <div class="flex justify-between items-center mb-4">
        <h1 class="text-2xl font-bold">Contacts</h1>
        <DialogRoot v-model:open="isDialogOpen">
          <DialogTrigger asChild>
            <Button @click="resetForm">Add Contact</Button>
          </DialogTrigger>
          <DialogPortal>
            <DialogOverlay class="fixed inset-0 bg-black/50" />
            <DialogContent class="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] bg-white rounded-lg shadow-lg w-[95%] max-w-[500px] p-6 md:p-8">
              <DialogTitle class="text-lg md:text-xl font-bold mb-4">
                {{ editingContact ? 'Edit Contact' : 'Add Contact' }}
              </DialogTitle>
              <form @submit.prevent="handleSubmit" class="grid gap-4">
                <div class="grid gap-2">
                  <label class="font-medium">Name</label>
                  <Input v-model="formData.name" required />
                </div>
                <div class="grid gap-2">
                  <label class="font-medium">Email</label>
                  <Input v-model="formData.email" type="email" required />
                </div>
                <div class="grid gap-2">
                  <label class="font-medium">Phone</label>
                  <Input v-model="formData.phone" required />
                </div>
                <div class="grid gap-2">
                  <label class="font-medium">Status</label>
                  <select v-model="formData.status" class="w-full p-2 border rounded">
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
                <div class="flex justify-end gap-2 pt-4">
                  <DialogClose asChild>
                    <Button variant="outline" type="button">Cancel</Button>
                  </DialogClose>
                  <Button type="submit">{{ editingContact ? 'Update' : 'Add' }}</Button>
                </div>
              </form>
            </DialogContent>
          </DialogPortal>
        </DialogRoot>
      </div>
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
            <TableHead>Actions</TableHead>
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
            <TableCell>
              <div class="flex gap-2">
                <Button variant="outline" size="sm" @click="editContact(contact)">
                  Edit
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm" 
                  @click="deleteContact(contact.id)"
                >
                  Delete
                </Button>
              </div>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.table-container {
  @apply border rounded-lg overflow-hidden;
}
</style>
