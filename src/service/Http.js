import axios from "axios"

export const urlBase = "http://127.0.0.1:8000/api";
// export const urlBaseAsset = "http://127.0.0.1:8000";

/**
 * Configuracion de axios (Interceptor)
 * @returns Axios
 */
export function http(){
    let token = localStorage.getItem("token")
    
    const interceptor = axios.create({
        baseURL: urlBase,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        timeout: 15000
    });

    // interceptar errores (401, 403)
    interceptor.interceptors.response.use(
        (response) => {
            return response
        },
        (error) => {
            // alert(error.response.status)
            if(error.response.status === 401) {
                localStorage.removeItem("token")
                window.location.href = "/login"
            }
        }

    );


    return interceptor;
}
















/*
const http = function(){

}

const http = () => {

}

*/