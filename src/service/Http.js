import axios from "axios"
import { Buffer } from "buffer"

export const urlBase = "https://back-ventas.herokuapp.com/api";
// export const urlBase = "http://127.0.0.1:8000/api";
export const urlBaseAsset = "https://back-ventas.herokuapp.com";

/**
 * Configuracion de axios (Interceptor)
 * @returns Axios
 */
export function http(){
    let token ="";
    if(localStorage.getItem("token")){

        token = Buffer.from(localStorage.getItem("token"), 'base64').toString('ascii');
    }
    
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
            return Promise.reject(error);
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