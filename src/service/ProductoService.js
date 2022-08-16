import { http, urlBase } from "./Http"

export const index = (page=1, rows=5, q=null) => {
    return http().get(`${urlBase}/producto?page=${page}&rows=${rows}&q=${q}`);
}

export const store = (datos) => {
    return http().post(`${urlBase}/producto`, datos);
}

export const show = (id) => {
    return http().get(`${urlBase}/producto/${id}`);
}

export const update = (datos, id) => {
    return http().put(`${urlBase}/producto/${id}`, datos);
}

export const destroy = (id) => {
    return http().delete(`${urlBase}/producto/${id}`);
}

export const actualizarImagen = (formData, id) => {
    return http().post(`${urlBase}/producto/${id}/actualizar-img`, formData);
}