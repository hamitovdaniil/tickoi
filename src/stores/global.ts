import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { defineStore } from 'pinia'

export const useGlobalStore = defineStore('global', () => {
    const isLoading = ref<boolean>(false)
    const isMenuCollapsed = ref<boolean>(false)
    const isMenuOpened = ref<boolean>(false)
    const isMobile = ref<boolean>(false)
    const toggleLoading = (value: boolean) => {
        isLoading.value = value
    }
    const selectedDate = ref(new Date())
    const viewDate = ref(new Date())
    const toggleMenu = () => {
        isMenuCollapsed.value = !isMenuCollapsed.value
    }

    const toggleMenuOpened = (value: boolean) => {
        isMenuOpened.value = value ? value : !isMenuOpened.value
    }

    onMounted(() => {
        const mediaQuery = window.matchMedia('(min-width: 992px)')

        const handler = (e: MediaQueryListEvent | MediaQueryList) => {
            if (!e.matches) {
                isMenuCollapsed.value = false
                isMobile.value = true
            } else {
                isMobile.value = false
                isMenuOpened.value = false
            }
        }

        handler(mediaQuery) // сразу проверяем
        mediaQuery.addEventListener('change', handler)

        onBeforeUnmount(() => {
            mediaQuery.removeEventListener('change', handler)
        })
    })
    return {
        isLoading,
        toggleLoading,
        isMenuCollapsed,
        toggleMenu,
        isMenuOpened,
        toggleMenuOpened,
        isMobile,
        selectedDate,
        viewDate,
    }
})
