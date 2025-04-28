<script setup lang="ts">
import { h } from "vue";
import { useGetSalesReps } from "@/lib/transaction-service";
import { computed } from "vue";
import { pickBy, get } from "lodash";
import { column_data_sales_transaction } from "./constant";

const params = { region: null, role: null };
const cleanedParams = pickBy(params);

const { data: responseData, isLoading, isError, error } = useGetSalesReps(cleanedParams);

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
</script>

<template>
  <div class="grid w-full gap-4">
    <header class="flex items-start justify-between">
      <div class="grow">
        <p>All your transactions</p>
        <h1>Transactions</h1>
      </div>
    </header>

    <!-- Tampilkan status loading, error, atau tabel data -->
    <div v-if="isLoading">Loading...</div>
    <div v-else-if="isError">Error: {{ error.message }}</div>
    <DataTable v-else :columns="columns" :data="data" />
  </div>
</template>