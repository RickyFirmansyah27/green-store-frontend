<script setup lang="ts">
import { ref, computed } from "vue";
import { Pagination } from '@/components/ui/pagination';
import AdvanceFilter from "./DialogFilter.vue";
import { useGetSalesReps } from "@/lib/transaction-service";
import lodash from "lodash";
import { column_data_sales_transaction } from "./constant";
import {
  DialogRoot,
  DialogTrigger
} from 'radix-vue'

const { get, pickBy } = lodash;
const selectedRegion = ref<string | null>(null);
const selectedRole = ref<string | null>(null);
const selectedName = ref<string | null>(null);
const selectedEmail = ref<string | null>(null);

const regions = ref(["North", "Europe", "Asia-Pacific", "Middle East", "South America"]);
const roles = ref(["Account Manager", "Senior Sales Executive", "Regional Sales Manager"]);

const currentPage = ref(1);
const limit = ref(10);

const showFilterModal = ref(false)
const filterForm = ref({
  region: selectedRegion.value = "",
  role: selectedRole.value = "",
  name: selectedName.value = "",
  email: selectedEmail.value = "",
})

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
  filterForm.value = {
    region: "",
    role: "",
    name: "",
    email: "",
  };
  showFilterModal.value = false;
};

const handlePageChange = (page: number) => {
  currentPage.value = page;
};

const applyFilters = () => {
  selectedRegion.value = filterForm.value.region
  selectedRole.value = filterForm.value.role
  selectedName.value = filterForm.value.name
  selectedEmail.value = filterForm.value.email
  currentPage.value = 1
  showFilterModal.value = false
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
          <AdvanceFilter :isModalOpen="showFilterModal" :regions="regions" :roles="roles"
            v-model:filterForm="filterForm" @apply="applyFilters" @reset="resetFilters" />
        </DialogTrigger>
      </DialogRoot>

      <button
        class="ml-auto flex items-center gap-2 border p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 dark:border-gray-600"
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
      <Pagination :page="currentPage" :total="totalData" :limit="limit" @page-change="handlePageChange" />
    </div>
  </div>
</template>
