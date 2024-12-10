import { ref, computed } from 'vue'

export function useDateRange() {
  const time = ref([])

  const timeRange = computed(() => {
    return {
      timeBegin: time.value?.[0] || '',
      timeEnd: time.value?.[1] || ''
    }
  })

  return {
    time,
    timeRange
  }
}
