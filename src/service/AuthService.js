// import * as httpInter from "./Http"
import { http } from "./Http"

/**
 * para conectar con Laravel (LOGIN)
 * @param {email, password} datosUsuario 
 */
export function loginConLaravel(datosUsuario){
    return http().post("/v1/auth/login", datosUsuario);
}

export const getPerfil = function(){
    return http().get("/v1/auth/perfil");
}

export const logout = () => {
    return http().post("/v1/auth/logout");
}

