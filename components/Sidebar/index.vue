<script setup>
import { AvatarFallback, AvatarRoot } from 'radix-vue';
const open = ref(true);
const name = "ricky-firmansyah.site";
</script>

<template>
  <div>
    <div class="z-50 flex items-center justify-between w-full p-4 lg:hidden">
      <Logo />
      <Icon 
        class="z-50 cursor-pointer left-2 top-2" 
        size="30" 
        name="iconamoon:menu-burger-horizontal"
        @click="open = true" 
      />
      <div 
        v-if="open" 
        class="fixed bg-white top-0 left-0 z-[999] w-full min-h-screen"
      >
        <Icon 
          class="absolute z-50 cursor-pointer right-4 top-4" 
          size="30" 
          name="material-symbols:close"
          @click="open = false" 
        />
        <SidebarMenu />
      </div>
    </div>
    <div class="hidden lg:flex w-[250px] min-h-screen flex-col justify-between border-r">
      <SidebarMenu />

      <div class="p-4">
        <a :href="`https://${name}`" target="_blank" rel="noopener noreferrer" class="flex items-center gap-3">
          <AvatarRoot class="bg-blackA3 inline-flex h-[45px] w-[45px] select-none items-center justify-center overflow-hidden rounded-full align-middle cursor-pointer hover:opacity-80 transition-opacity">
            <AvatarFallback class="text-black leading-1 flex h-full w-full items-center justify-center bg-green-200 text-[15px] font-medium">
              RF
            </AvatarFallback>
          </AvatarRoot>
          <span class="text-sm font-medium">Ricky Firmansyah</span>
        </a>
      </div>
    </div>
  </div>
</template>