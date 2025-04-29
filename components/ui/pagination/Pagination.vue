<script setup lang="ts">
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
  total: {
    type: Number,
    required: true,
  },
  siblingCount: {
    type: Number,
    default: 1,
  },
});

const emit = defineEmits(["page-change"]);
</script>

<template>
  <PaginationRoot
    :total="props.total"
    :sibling-count="props.siblingCount"
    show-edges
    :page="props.page"
  >
    <PaginationList v-slot="{ items }" class="flex items-center gap-1 text-black">
      <PaginationFirst
        class="w-9 h-9 flex items-center justify-center disabled:opacity-50 focus-within:outline focus-within:outline-1 focus-within:outline-offset-1 rounded bg-black text-white hover:bg-gray-800"
        @click="$emit('page-change', 1)"
      >
        <Icon icon="radix-icons:double-arrow-left" />
      </PaginationFirst>
      <PaginationPrev
        class="w-9 h-9 flex items-center justify-center mr-4 disabled:opacity-50 focus-within:outline focus-within:outline-1 focus-within:outline-offset-1 rounded bg-black text-white hover:bg-gray-800"
        @click="$emit('page-change', Math.max(1, props.page - 1))"
      >
        <Icon icon="radix-icons:chevron-left" />
      </PaginationPrev>
      <template v-for="(page, index) in items" :key="index">
        <PaginationListItem
          v-if="page.type === 'page'"
          :value="page.value"
          class="w-9 h-9 border rounded bg-black text-white data-[selected]:bg-white data-[selected]:text-black hover:bg-gray-800 transition focus-within:outline focus-within:outline-1 focus-within:outline-offset-1"
          @click="$emit('page-change', page.value)"
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
        @click="$emit('page-change', Math.min(props.total, props.page + 1))"
      >
        <Icon icon="radix-icons:chevron-right" />
      </PaginationNext>
      <PaginationLast
        class="w-9 h-9 flex items-center justify-center disabled:opacity-50 focus-within:outline focus-within:outline-1 focus-within:outline-offset-1 rounded bg-black text-white hover:bg-gray-800"
        @click="$emit('page-change', props.total)"
      >
        <Icon icon="radix-icons:double-arrow-right" />
      </PaginationLast>
    </PaginationList>
  </PaginationRoot>
</template>