<template>
  <div class="sidebar-item" :class="{ active: isActive }">
    <NuxtLink :to="to" class="sidebar-link">
      <slot name="icon"></slot>
      <span class="sidebar-text">{{ text }}</span>
    </NuxtLink>
  </div>
  <SidebarItem 
    text="Dashboard" 
    to="/dashboard" 
    :isActive="true"
  >
    <template #icon>
      <IconDashboard />
    </template>
  </SidebarItem>
</template>

<script setup lang="ts">
defineProps<{
  text: string
  to: string
  isActive?: boolean
}>()
</script>

<style scoped>
.sidebar-item {
  padding: 0.5rem 1rem;
  cursor: pointer;
}

.sidebar-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
  color: inherit;
}

.sidebar-text {
  font-size: 0.875rem;
}

.active {
  background-color: rgb(var(--color-primary-600));
  color: white;
  border-radius: 0.375rem;
}
</style>