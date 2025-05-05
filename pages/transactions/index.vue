<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Pagination } from '@/components/ui/pagination';
import { useGetSalesReps } from "@/lib/transaction-service";
import lodash from "lodash";
const { get, pickBy } = lodash;
import { column_data_sales_transaction } from "./constant";



const selectedRegion = ref<string | null>(null);
const selectedRole = ref<string | null>(null);

const regions = ref(["North", "Europe", "Asia-Pacific", "Middle East", "South America"]);
const roles = ref(["Account Manager", "Senior Sales Executive", "Regional Sales Manager"]);

const currentPage = ref(1);
const limit = ref(10);

const params = computed(() => pickBy({
  page: currentPage.value,
  limit: limit.value,
  region: selectedRegion.value,
  role: selectedRole.value,
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

const handleRoleChange = (value: string) => {
  selectedRole.value = value === "all" ? '' : value;
  selectedRegion.value = '';
  currentPage.value = 1;
};

const handleRegionChange = (value: string) => {
  selectedRole.value = '';
  selectedRegion.value = value === "all" ? '' : value;
  currentPage.value = 1;
};

const resetFilters = () => {
  selectedRegion.value = null;
  selectedRole.value = null;
  currentPage.value = 1;
};

const handlePageChange = (page: number) => {
  currentPage.value = page;
};
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
      <DropdownMenu>
        <DropdownMenuTrigger class="border p-2 rounded cursor-pointer">
          {{ selectedRegion || "Filter by Region" }}
        </DropdownMenuTrigger>
        <DropdownMenuContent class="bg-white border rounded shadow-md hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 dark:border-gray-600">
          <DropdownMenuItem @click="() => handleRegionChange('all')">All Regions</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem v-for="region in regions" :key="region" @click="() => handleRegionChange(region)">
            {{ region }}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger class="border p-2 rounded cursor-pointer">
          {{ selectedRole || "Filter by Role" }}
        </DropdownMenuTrigger>
        <DropdownMenuContent class="bg-white border rounded shadow-md hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 dark:border-gray-600">
          <DropdownMenuItem @click="() => handleRoleChange('all')">All Roles</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem v-for="role in roles" :key="role" @click="() => handleRoleChange(role)">
            {{ role }}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

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
