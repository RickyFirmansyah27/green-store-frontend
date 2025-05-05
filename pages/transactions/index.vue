<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { toast } from 'vue3-toastify';
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

// Add a watch effect for error state
watch(() => isError.value, (newValue) => {
  if (newValue && error.value) {
    toast.error(error.value instanceof Error ? error.value.message : String(error.value), {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
    });
  }
});
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

    <div v-if="isLoading" class="relative h-[400px] w-full bg-white/80 dark:bg-gray-900/80 rounded-lg">
      <div class="absolute top-1/2 left-[50%] transform -translate-x-1/2 -translate-y-1/2">
        <div class="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    </div>
    <div v-else-if="!data.length || isError" class="flex flex-col items-center justify-center h-[400px] bg-white dark:bg-gray-900 rounded-lg">
      <Icon name="mdi-database-off-outline" class="w-12 h-12 text-gray-400 mb-2" />
      <p class="text-gray-500 dark:text-gray-400">No data available</p>
    </div>
    <DataTable v-else :columns="columns" :data="data" />
    <div class="flex justify-between items-center mt-4">
      <p>Total: {{ totalData || 0 }}</p>
      <Pagination :page="currentPage" :total="totalData" :limit="limit" @page-change="handlePageChange" />
    </div>
  </div>
</template>
