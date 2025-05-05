<script setup lang="ts">
import { ref, computed } from "vue";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Pagination } from '@/components/ui/pagination';
import { useGetSalesReps } from "@/lib/transaction-service";
import lodash from "lodash";
import { column_data_sales_transaction } from "./constant";
import {
  DialogRoot,
  DialogTrigger,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogTitle,
  DialogClose,
} from 'radix-vue'

const { get, pickBy } = lodash;
const selectedRegion = ref<string | null>(null);
const selectedRole = ref<string | null>(null);
const selectedName = ref<string | null>(null);
const selectedEmail = ref<string | null>(null);

const selectedRegionText = computed(() => filterForm.value.region || 'Select Region')
const selectedRoleText = computed(() => filterForm.value.role || 'Select Role')

const regions = ref(["North", "Europe", "Asia-Pacific", "Middle East", "South America"]);
const roles = ref(["Account Manager", "Senior Sales Executive", "Regional Sales Manager"]);

const currentPage = ref(1);
const limit = ref(10);

const params = computed(() => pickBy({
  page: currentPage.value,
  limit: limit.value,
  region: selectedRegion.value,
  role: selectedRole.value,
  name: selectedName.value,
  email: selectedEmail.value,
}));

const { data: responseData, isLoading, isError, error, refetch } = useGetSalesReps(params);

const totalData = computed(() => {
  return get(responseData.value, "data.data.totalData", 0);
});

const data = computed(() => {
  const salesReps = get(responseData.value, "data.data.salesReps", []);
  return salesReps.map((rep: any) => ({
    region: get(rep, "region", "N/A"),
    name: get(rep, "name", "N/A"),
    role: get(rep, "role", "N/A"),
    email: get(rep, "clients[0].contact", "N/A"),
    status: get(rep, "deals[0].status", "N/A"),
    amount: get(rep, "deals[0].value", 0),
  }));
});

const columns = computed(() => {
  return column_data_sales_transaction.map((col: any) => ({
    ...col,
    header: col.header(),
    cell: (row: any) => col.cell({ row }),
  }));
});

const resetFilters = () => {
  selectedRegion.value = null;
  selectedRole.value = null;
  selectedName.value = null;
  selectedEmail.value = null;
  currentPage.value = 1;
};

const handlePageChange = (page: number) => {
  currentPage.value = page;
};

const showFilterModal = ref(false)
const filterForm = ref({
  region: '',
  role: '',
  name: '',
  email: '',
})

const applyFilters = () => {
  selectedRegion.value = filterForm.value.region
  selectedRole.value = filterForm.value.role
  selectedName.value = filterForm.value.name
  selectedEmail.value = filterForm.value.email
  currentPage.value = 1
  showFilterModal.value = false
}

const resetAdvancedFilters = () => {
  filterForm.value = {
    region: '',
    role: '',
    name: '',
    email: '',
  }
}
</script>

<template>
  <div class="grid w-full gap-4">
    <header class="flex items-start justify-between">
      <div class="grow">
        <p>All your transactions</p>
        <h1>Transactions</h1>
      </div>
    </header>

    <div class="flex gap-4 items-center">
      <DialogRoot v-model:open="showFilterModal">
        <DialogTrigger asChild>
          <button class="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 dark:border-gray-600">
            <Icon name="heroicons:funnel" class="h-5 w-5" />
            <span>Advanced Filters</span>
          </button>
        </DialogTrigger>

        <DialogPortal>
          <DialogOverlay class="fixed inset-0 bg-black/50" />
          <DialogContent class="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] bg-white dark:bg-gray-800 rounded-lg shadow-lg w-[95%] max-w-[800px] p-6 md:p-8">
            <DialogTitle class="text-lg md:text-xl font-bold mb-4 dark:text-white">
              Advanced Filters
            </DialogTitle>

            <div class="grid grid-cols-2 gap-4 py-4">
              <div class="grid gap-2">
                <label class="text-sm font-medium dark:text-gray-200">Name</label>
                <input 
                  v-model="filterForm.name"
                  type="text"
                  placeholder="Filter by name..."
                  class="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                />
              </div>

              <div class="grid gap-2">
                <label class="text-sm font-medium dark:text-gray-200">Email</label>
                <input 
                  v-model="filterForm.email"
                  type="text"
                  placeholder="Filter by email..."
                  class="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                />
              </div>

              <div class="grid gap-2">
                <label class="text-sm font-medium dark:text-gray-200">Region</label>
                <div class="relative w-full">
                  <DropdownMenu>
                    <DropdownMenuTrigger class="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-600 dark:text-white text-left flex justify-between items-center">
                      <span>{{ selectedRegionText }}</span>
                      <Icon name="heroicons:chevron-down" class="h-4 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent 
                      class="w-full mt-1 z-50 bg-white dark:bg-gray-800 rounded-md border dark:border-gray-700 shadow-lg"
                      :side-offset="4"
                      :align="'start'"
                    >
                      <DropdownMenuItem @click="filterForm.region = ''" class="w-full">
                        All Regions
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        v-for="region in regions" 
                        :key="region"
                        @click="filterForm.region = region"
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
                    <DropdownMenuTrigger class="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-600 dark:text-white text-left flex justify-between items-center">
                      <span>{{ selectedRoleText }}</span>
                      <Icon name="heroicons:chevron-down" class="h-4 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent 
                      class="w-full mt-1 z-50 bg-white dark:bg-gray-800 rounded-md border dark:border-gray-700 shadow-lg"
                      :side-offset="4"
                      :align="'start'"
                    >
                      <DropdownMenuItem @click="filterForm.role = ''" class="w-full">
                        All Roles
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        v-for="role in roles" 
                        :key="role"
                        @click="filterForm.role = role"
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

      <button class="ml-auto flex items-center gap-2 border p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 dark:border-gray-600" 
        @click="resetFilters">
        <span>Reset</span>
        <Icon name="mdi-refresh" class="h-5 w-5" />
      </button>
      
    </div>

    <div v-if="isLoading">Loading...</div>
    <div v-else-if="isError">Error: {{ error }}</div>
    <DataTable v-else :columns="columns" :data="data" />
    <div class="flex justify-between items-center mt-4">
      <p>Total: {{ totalData || 0 }}</p>
      <Pagination
        :page="currentPage"
        :total="totalData"
        :limit="limit"
        @page-change="handlePageChange"
      />
    </div>
  </div>
</template>
