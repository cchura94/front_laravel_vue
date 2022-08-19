import { http, urlBase } from "./Http"

export const index = () => {
    return http().get(`${urlBase}/pedido`);
}

export const store = (datos) => {
    return http().post(`${urlBase}/pedido`, datos);
}

export const show = (id) => {
    return http().get(`${urlBase}/pedido/${id}`);
}

export const update = (datos, id) => {
    return http().put(`${urlBase}/pedido/${id}`, datos);
}

export const destroy = (id) => {
    return http().delete(`${urlBase}/pedido/${id}`);
}
