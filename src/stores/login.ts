import {defineStore} from 'pinia';
import { reactive } from 'vue';
import {type User } from '@/types'

export const useLoginStore = defineStore('login',() => {
    const loginedUser = reactive<User>({});
    return {loginedUser}
})