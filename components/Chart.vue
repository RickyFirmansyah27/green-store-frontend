<script setup>
let props = defineProps(['currentCategory', 'data']);
let data = props.data || [];
let currentCategory = props.currentCategory || 'today';
const isDarkMode = ref(false);

onMounted(() => {
  checkDarkMode();
  
  const observer = new MutationObserver(() => {
    checkDarkMode();
  });
  
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class']
  });
});

const checkDarkMode = () => {
  isDarkMode.value = document.documentElement.classList.contains('dark');
};

let categories = ref({
  today: Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`),
  week: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  year: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
});

let options = computed(() => ({
  chart: {
    type: 'line',
    animation: { enabled: false },
    backgroundColor: 'transparent',
    style: {
      fontFamily: 'inherit'
    }
  },
  title: { text: '' },
  xAxis: {
    categories: categories.value[currentCategory],
    gridLineWidth: isDarkMode.value ? 1 : 0,
    gridLineColor: isDarkMode.value ? '#333333' : '#e5e5e5',
    lineColor: isDarkMode.value ? '#666666' : '#e5e5e5',
    labels: {
      style: {
        color: isDarkMode.value ? '#ffffff' : '#666666'
      }
    }
  },
  yAxis: {
    gridLineWidth: isDarkMode.value ? 1 : 0,
    gridLineColor: isDarkMode.value ? '#333333' : '#e5e5e5',
    lineColor: isDarkMode.value ? '#666666' : '#e5e5e5',
    title: { text: '' },
    labels: {
      style: {
        color: isDarkMode.value ? '#ffffff' : '#666666'
      }
    }
  },
  legend: { enabled: false },
  plotOptions: {
    line: {
      marker: {
        enabled: isDarkMode.value,
        radius: 4,
        symbol: 'circle'
      },
      dataLabels: { enabled: false },
      enableMouseTracking: true,
      states: {
        hover: {
          lineWidth: 5
        }
      }
    }
  },
  tooltip: {
    backgroundColor: isDarkMode.value ? 'rgba(30, 30, 30, 0.9)' : 'rgba(255, 255, 255, 0.9)',
    style: {
      color: isDarkMode.value ? '#ffffff' : '#333333'
    },
    borderWidth: 0,
    shadow: false
  },
  series: [{
    name: 'Value',
    lineWidth: 3,
    color: {
      linearGradient: { x1: 0, y1: 0, x2: 1, y2: 0 },
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

onMounted(() => {
  generateMonth();
});
</script>

<template>
  <div class="border rounded-lg p-4">
    <highchart :options="options" />
  </div>
</template>