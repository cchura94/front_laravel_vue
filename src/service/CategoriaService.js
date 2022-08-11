import { http, urlBase } from "./Http"

export const index = () => {
    return http().get(`${urlBase}/categoria`);
}

export const store = (datos) => {
    return http().post(`${urlBase}/categoria`, datos);
}

export const show = (id) => {
    return http().get(`${urlBase}/categoria/${id}`);
}

export const update = (datos, id) => {
    return http().put(`${urlBase}/categoria/${id}`, datos);
}

export const destroy = (id) => {
    return http().delete(`${urlBase}/categoria/${id}`);
}
