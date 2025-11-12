<script setup>
import { ref, onMounted, watch } from 'vue'
import Verify from './verify/index.vue'
import Map from './amap/index.vue'
import { getLocalStorage } from '@/utils/local'
import { useVerifyPassStore } from '@/store/verify'


const isPass = ref(false)
const verifyPassStore = useVerifyPassStore()

watch(() => verifyPassStore.isPass, (newVal) => {
    console.log('verifyPassStoreverifyPassStore', verifyPassStore.isPass)
    isPass.value = newVal
})

onMounted(() => {
    let isPassVerify = getLocalStorage('pass-verify')
    if (isPassVerify) {
        isPass.value = true
    } else {
        isPass.value = false
    }
})
</script>

<template>
    <Verify v-if="!isPass" />
    <Map v-if="isPass" />
</template>

<style scoped></style>