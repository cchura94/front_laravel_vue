import { http, urlBase } from "./Http"

export const index = (q='') => {
    return http().get(`${urlBase}/cliente?q=${q}`);
}

export const store = (datos) => {
    return http().post(`${urlBase}/cliente`, datos);
}

export const show = (id) => {
    return http().get(`${urlBase}/cliente/${id}`);
}

export const update = (datos, id) => {
    return http().put(`${urlBase}/cliente/${id}`, datos);
}

export const destroy = (id) => {
    return http().delete(`${urlBase}/cliente/${id}`);
}
