import { defineStore } from 'pinia'

export const useVerifyPassStore = defineStore('verify', {
    state() {
        return {
            isPass: false
        }
    },
    actions: {
        setIsPass(value) {
            this.isPass = value
        }
    }
})