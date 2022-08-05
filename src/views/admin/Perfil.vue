<template>
    <div class="card">
        <h1>PERFIL</h1>
        <div v-if="datosPerfil">
            {{ datosPerfil }}

        </div>
    </div>
</template>

<script>
import * as authService from "@/service/AuthService.js"
import { ref, onMounted } from 'vue'

export default {
    setup(){

        const datosPerfil = ref(null)
        
        onMounted(async () => {
            const { data } = await authService.getPerfil()
            datosPerfil.value = data
            
        })

        return {
            datosPerfil
        }

    }

}
</script>

<style>

</style>