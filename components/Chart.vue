<script setup>
let props = defineProps(['currentCategory', 'data']);
let data = props.data || [];
let currentCategory = props.currentCategory || 'today';

// Kategori data untuk sumbu X
let categories = ref({
  today: Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`),
  week: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  year: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
});

// Konfigurasi chart
let options = computed(() => ({
  chart: { type: 'line', animation: { enabled: false } },
  title: { text: '' },
  xAxis: { gridLineColor: 'transparent', categories: categories.value[currentCategory] },
  yAxis: { gridLineColor: 'transparent', title: { text: '' } },
  legend: { enabled: false },
  plotOptions: {
    line: {
      marker: { enabled: false },
      dataLabels: { enabled: false },
      enableMouseTracking: false
    }
  },
  series: [{
    name: 'line',
    lineWidth: 4,
    color: {
      linearGradient: { y1: 0, y2: 0, y3: 0, y4: 0 },
      stops: [
        [0, 'rgba(252,176,69,1)'],
        [0.33, 'rgba(253,29,29,1)'],
        [0.66, 'rgba(131,58,180,1)'],
        [1, 'rgba(29,217,93,1)']
      ]
    },
    data
  }]
}));

// Fungsi untuk menghasilkan tanggal dalam bulan
function generateMonth() {
  let currentDate = new Date();
  let currentMonth = currentDate.getMonth() + 1;
  let currentYear = currentDate.getFullYear();

  let daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
  let monthDates = Array.from({ length: daysInMonth }, (_, i) => 
    `${currentMonth.toString().padStart(2, '0')}/${(i + 1).toString().padStart(2, '0')}`
  );

  categories.value = { ...categories.value, month: monthDates };
}

// Generate data bulan saat komponen dimuat
onMounted(() => {
  generateMonth();
});
</script>

<template>
  <div class="border rounded-lg p-4">
    <highchart :options="options" />
  </div>
</template>