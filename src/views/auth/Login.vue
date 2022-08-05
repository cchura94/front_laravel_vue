<template>
    <h1>Login</h1>
  <h1>{{ credenciales }}</h1>

  <input type="email" v-model="credenciales.email">
  <br>
  <input type="password" v-model="credenciales.password">
  <br>
  <button type="button" @click="login()" >INGRESAR</button>

</template>

<script>
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router'
import * as authService from "@/service/AuthService.js";
export default {
    
    setup(){
        const router = useRouter()

        const credenciales = ref({email: '', password: ''});

        const login = async () => {
            /*
            authService.loginConLaravel(credenciales.value).then(res => {
                console.log(res)
            }).catch(error => {
                console.log(error)
            })
            */
           try {
               const res = await authService.loginConLaravel(credenciales.value)
               console.log(res)
               localStorage.setItem("token", res.data.access_token)
               router.push({name: 'Perfil'})
           } catch (error) {
                console.log("***************", error)
           }

        }

        return {
            credenciales,
            login
        }
    }
}
</script>
