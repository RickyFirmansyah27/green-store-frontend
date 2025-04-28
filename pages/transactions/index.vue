<script setup lang="ts">
import { ref, computed, watchEffect } from "vue";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { useGetSalesReps } from "@/lib/transaction-service";
import { get, pickBy } from "lodash";
import { column_data_sales_transaction } from "./constant";

// Reactive properties for filters
const selectedRegion = ref<string | null>(null);
const selectedRole = ref<string | null>(null);

const regions = ref(["North", "South", "East", "West"]); // Example regions
const roles = ref(["Account Manager", "Senior Sales", "Support"]); // Example roles

// Generate params dynamically as a computed property
const params = computed(() => pickBy({
  page: 1,
  limit: 10,
  region: selectedRegion.value,
  role: selectedRole.value,
}));

// Fetch data with cleaned params
const { data: responseData, isLoading, isError, error, refetch } = useGetSalesReps(params);

// Watch params to trigger fetch whenever the filter changes
watchEffect(() => {
  console.log("Fetching data with params:", params.value);
  refetch(); // Automatically fetch when params change
});

// Map and clean up sales reps data
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
  selectedRole.value = value === "all" ? null : value;
};

const handleRegionChange = (value: string) => {
  selectedRegion.value = value === "all" ? null : value;
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

    <!-- Filters -->
    <div class="flex gap-4">
      <!-- Filter by Region -->
      <DropdownMenu>
        <DropdownMenuTrigger class="border p-2 rounded cursor-pointer">
          {{ selectedRegion || "Filter by Region" }}
        </DropdownMenuTrigger>
        <DropdownMenuContent class="bg-white border rounded shadow-md">
          <DropdownMenuItem @click="() => handleRegionChange('all')">All Regions</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            v-for="region in regions"
            :key="region"
            @click="() => handleRegionChange(region)"
          >
            {{ region }}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <!-- Filter by Role -->
      <DropdownMenu>
        <DropdownMenuTrigger class="border p-2 rounded cursor-pointer">
          {{ selectedRole || "Filter by Role" }}
        </DropdownMenuTrigger>
        <DropdownMenuContent class="bg-white border rounded shadow-md">
          <DropdownMenuItem @click="() => handleRoleChange('all')">All Roles</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            v-for="role in roles"
            :key="role"
            @click="() => handleRoleChange(role)"
          >
            {{ role }}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>

    <!-- Tampilkan status loading, error, atau tabel data -->
    <div v-if="isLoading">Loading...</div>
    <div v-else-if="isError">Error: {{ error }}</div>
    <DataTable v-else :columns="columns" :data="data" />
  </div>
</template>
