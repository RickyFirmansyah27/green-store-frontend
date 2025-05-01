import { ref } from 'vue'

export interface Contact {
  id: number
  name: string
  email: string
  phone: string
  status: 'Active' | 'Inactive'
}

export const useContacts = () => {
  const contacts = ref<Contact[]>([
    { id: 1, name: 'John Doe', email: 'john@example.com', phone: '+1234567890', status: 'Active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '+0987654321', status: 'Inactive' },
  ])

  const addContact = (contact: Omit<Contact, 'id'>) => {
    const newId = contacts.value.length ? Math.max(...contacts.value.map(c => c.id)) + 1 : 1
    contacts.value.push({ ...contact, id: newId })
  }

  const updateContact = (id: number, contact: Partial<Contact>) => {
    const index = contacts.value.findIndex(c => c.id === id)
    if (index !== -1) {
      contacts.value[index] = { ...contacts.value[index], ...contact }
    }
  }

  const deleteContact = (id: number) => {
    contacts.value = contacts.value.filter(c => c.id !== id)
  }

  return {
    contacts,
    addContact,
    updateContact,
    deleteContact
  }
}