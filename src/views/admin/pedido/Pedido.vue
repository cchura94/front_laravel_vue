<template>
  <div class="card">
    <h1>Lista Pedido</h1>
     <DataTable :value="pedidos" responsiveLayout="scroll">
            <Column field="id" header="Code"></Column>
            <Column field="fecha_pedido" header="FECHA"></Column>
            <Column field="cliente.nombre_completo" header="Cliente"></Column>
            <Column field="productos" header="PRODUCTOS" >
            <template #body="slotProps">
                <Button label="Show" icon="pi pi-external-link" @click="openModal(slotProps.data.productos)" />
            </template>
        
            </Column>
        </DataTable>

        <Dialog header="Header" v-model:visible="displayModal" :breakpoints="{'960px': '75vw', '640px': '90vw'}" :style="{width: '50vw'}" :modal="true">
            <DataTable :value="productos" responsiveLayout="scroll">
                <Column field="id" header="ID"></Column>
                <Column field="nombre" header="NOMBRE"></Column>
                <Column field="precio" header="PRECIO"></Column>
            </DataTable>

            
            <template #footer>
                <Button label="No" icon="pi pi-times" @click="closeModal" class="p-button-text"/>
                <Button label="Yes" icon="pi pi-check" @click="closeModal" autofocus />
            </template>
        </Dialog>
  </div>
</template>

<script>
import * as pedidoService from "@/service/PedidoService.js"
export default {
    data(){
        return {
            pedidos: [],
            displayModal: false,
            productos: []
        }
    },
    async mounted(){
        const {data} = await pedidoService.index();
        this.pedidos = data.data
    },
    methods:{
        openModal(datos){
            this.productos = datos
            this.displayModal = true
        }
    }
}
</script>

<style>

</style>