<script setup lang="ts">
import { ref, watch } from "vue";
import { Icon } from "@iconify/vue";
import {
  PaginationEllipsis,
  PaginationFirst,
  PaginationLast,
  PaginationList,
  PaginationListItem,
  PaginationNext,
  PaginationPrev,
  PaginationRoot,
} from "radix-vue";

const props = defineProps({
  page: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits(["page-change"]);

const currentPage = ref(props.page); // Sinkronkan dengan properti page
watch(
  () => props.page,
  (newPage) => {
    currentPage.value = newPage;
  }
);

watch(currentPage, (newPage) => {
  emit("page-change", newPage);
});
</script>

<template>
  <PaginationRoot
    :total="100"
    :sibling-count="1"
    show-edges
    :page="currentPage" 
  >
    <PaginationList v-slot="{ items }" class="flex items-center gap-1 text-black">
      <PaginationFirst
        class="w-9 h-9 flex items-center justify-center disabled:opacity-50 focus-within:outline focus-within:outline-1 focus-within:outline-offset-1 rounded bg-black text-white hover:bg-gray-800"
        @click="currentPage = 1"
      >
        <Icon icon="radix-icons:double-arrow-left" />
      </PaginationFirst>
      <PaginationPrev
        class="w-9 h-9 flex items-center justify-center mr-4 disabled:opacity-50 focus-within:outline focus-within:outline-1 focus-within:outline-offset-1 rounded bg-black text-white hover:bg-gray-800"
        @click="currentPage = Math.max(1, currentPage - 1)"
      >
        <Icon icon="radix-icons:chevron-left" />
      </PaginationPrev>
      <template v-for="(page, index) in items" :key="index">
        <PaginationListItem
          v-if="page.type === 'page'"
          :value="page.value"
          class="w-9 h-9 border rounded bg-black text-white data-[selected]:bg-white data-[selected]:text-black hover:bg-gray-800 transition focus-within:outline focus-within:outline-1 focus-within:outline-offset-1"
          @click="currentPage = page.value"
        >
          {{ page.value }}
        </PaginationListItem>
        <PaginationEllipsis
          v-else
          :index="index"
          class="w-9 h-9 flex items-center justify-center text-black"
        >
          &#8230;
        </PaginationEllipsis>
      </template>
      <PaginationNext
        class="w-9 h-9 flex items-center justify-center ml-4 disabled:opacity-50 focus-within:outline focus-within:outline-1 focus-within:outline-offset-1 rounded bg-black text-white hover:bg-gray-800"
        @click="currentPage = Math.min(100, currentPage + 1)"
      >
        <Icon icon="radix-icons:chevron-right" />
      </PaginationNext>
      <PaginationLast
        class="w-9 h-9 flex items-center justify-center disabled:opacity-50 focus-within:outline focus-within:outline-1 focus-within:outline-offset-1 rounded bg-black text-white hover:bg-gray-800"
        @click="currentPage = 100"
      >
        <Icon icon="radix-icons:double-arrow-right" />
      </PaginationLast>
    </PaginationList>
  </PaginationRoot>
</template>