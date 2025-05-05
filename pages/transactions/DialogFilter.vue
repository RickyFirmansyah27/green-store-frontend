<script setup lang="ts">
import { computed } from 'vue'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import {
  DialogRoot,
  DialogTrigger,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogTitle,
  DialogClose,
} from 'radix-vue'

interface Props {
  regions: string[]
  roles: string[]
  filterForm: {
    region: string
    role: string
    name: string
    email: string
  }
  isModalOpen: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  'apply': []
  'reset': []
}>()

// Binding modal state
const showFilterModal = computed({
  get: () => props.isModalOpen,
  set: (val: boolean) => emit('update:open', val),
})

// Computed text
const selectedRegionText = computed(() =>
  props.filterForm.region ? props.filterForm.region : 'All Regions'
)

const selectedRoleText = computed(() =>
  props.filterForm.role ? props.filterForm.role : 'All Roles'
)

// Emit actions
const applyFilters = () => {
  emit('apply')
}
const resetAdvancedFilters = () => {
  props.filterForm.region = ''
  props.filterForm.role = ''
  props.filterForm.name = ''
  props.filterForm.email = ''
  emit('reset')
}
</script>

<template>
  <div class="flex gap-4 items-center">
    <DialogRoot v-model:open="showFilterModal">
      <DialogTrigger asChild>
        <button
          class="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 dark:border-gray-600"
        >
          <Icon name="heroicons:funnel" class="h-5 w-5" />
          <span>Advanced Filters</span>
        </button>
      </DialogTrigger>

      <DialogPortal>
        <DialogOverlay class="fixed inset-0 bg-black/50" />
        <DialogContent
          class="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] bg-white dark:bg-gray-800 rounded-lg shadow-lg w-[95%] max-w-[800px] p-6 md:p-8"
        >
          <DialogTitle class="text-lg md:text-xl font-bold mb-4 dark:text-white">
            Advanced Filters
          </DialogTitle>

          <div class="grid grid-cols-2 gap-4 py-4">
            <div class="grid gap-2">
              <label class="text-sm font-medium dark:text-gray-200">Name</label>
              <input
                v-model="props.filterForm.name"
                type="text"
                placeholder="Filter by name..."
                class="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              />
            </div>

            <div class="grid gap-2">
              <label class="text-sm font-medium dark:text-gray-200">Email</label>
              <input
                v-model="props.filterForm.email"
                type="text"
                placeholder="Filter by email..."
                class="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              />
            </div>

            <div class="grid gap-2">
              <label class="text-sm font-medium dark:text-gray-200">Region</label>
              <div class="relative w-full">
                <DropdownMenu>
                  <DropdownMenuTrigger
                    class="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-600 dark:text-white text-left flex justify-between items-center"
                  >
                    <span>{{ selectedRegionText }}</span>
                    <Icon name="heroicons:chevron-down" class="h-4 w-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    class="w-full mt-1 z-50 bg-white dark:bg-gray-800 rounded-md border dark:border-gray-700 shadow-lg"
                    :side-offset="4"
                    :align="'start'"
                  >
                    <DropdownMenuItem
                      @click="props.filterForm.region = ''"
                      class="w-full"
                    >
                      All Regions
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      v-for="region in props.regions"
                      :key="region"
                      @click="props.filterForm.region = region"
                      class="w-full"
                    >
                      {{ region }}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <div class="grid gap-2">
              <label class="text-sm font-medium dark:text-gray-200">Role</label>
              <div class="relative w-full">
                <DropdownMenu>
                  <DropdownMenuTrigger
                    class="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-600 dark:text-white text-left flex justify-between items-center"
                  >
                    <span>{{ selectedRoleText }}</span>
                    <Icon name="heroicons:chevron-down" class="h-4 w-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    class="w-full mt-1 z-50 bg-white dark:bg-gray-800 rounded-md border dark:border-gray-700 shadow-lg"
                    :side-offset="4"
                    :align="'start'"
                  >
                    <DropdownMenuItem
                      @click="props.filterForm.role = ''"
                      class="w-full"
                    >
                      All Roles
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      v-for="role in props.roles"
                      :key="role"
                      @click="props.filterForm.role = role"
                      class="w-full"
                    >
                      {{ role }}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>

          <div class="flex justify-end gap-2 mt-6">
            <DialogClose asChild>
              <button
                @click="resetAdvancedFilters"
                class="px-4 py-2 border rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                Reset
              </button>
            </DialogClose>
            <DialogClose asChild>
              <button
                @click="applyFilters"
                class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Apply Filters
              </button>
            </DialogClose>
          </div>
        </DialogContent>
      </DialogPortal>
    </DialogRoot>
  </div>
</template>
