<template>
  <div class="card">
    <h1>Gestion Categorias</h1>

     <Button label="Nueva Categoria" icon="pi pi-eye" @click="openModal" />
        <Dialog header="Categoria" v-model:visible="displayModal" :breakpoints="{'960px': '75vw', '640px': '90vw'}" :style="{width: '40vw'}" :modal="true" class="p-fluid">
            <pre>{{ errors }}</pre>
            <div class="field">
                <label for="nom">Nombre</label>
                <InputText id="nom" v-model.trim="categoria.nombre" required="true" autofocus :class="{'p-invalid': submitted && !categoria.nombre}" />
                <small class="p-error" v-if="submitted && !categoria.nombre">Nombre es requerido.</small>
            </div>
            <div class="field">
                <label for="det">Detalle</label>
                <Textarea id="det" v-model="categoria.detalle" rows="3" cols="20" />
            </div>

            {{ categoria }}
            
            <template #footer>
                <Button label="No" icon="pi pi-times" @click="closeModal" class="p-button-text"/>
                <Button label="Guardar Categoruia" icon="pi pi-check" @click="guardarCategoria" autofocus />
            </template>
        </Dialog>
    
    <DataTable :value="categorias" responsiveLayout="scroll">
            <Column field="id" header="ID"></Column>
            <Column field="nombre" header="NOMBRE CATEGORIA"></Column>
            <Column field="detalle" header="DETALLE"></Column>
            <Column :exportable="false" style="min-width:8rem">
                    <template #body="slotProps">
                        <Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2" @click="editarDialogModal(slotProps.data)" />
                        <Button icon="pi pi-trash" class="p-button-rounded p-button-warning"  />
                    </template>
                </Column>
        </DataTable>

 <Toast />
  </div>
</template>

<script>
import { useToast } from "primevue/usetoast";
import {ref, onMounted} from "vue"
import * as categoriaService from "@/service/CategoriaService.js"
export default {

  props: {
    guardar: {
      type: Function,
      required: true
    }
  },

  setup(){

     const toast = useToast();

    const categorias = ref([]);
    const categoria = ref({});
    const displayModal = ref(false)
    const submitted = ref(false);
    const errors = ref({})

    onMounted( () => {
      listarCategorias()
      
    })

    // metodos
    const listarCategorias = async () => {
      const {data} = await categoriaService.index()
      categorias.value = data
    }

    const guardarCategoria = async () => {
      try {
        if(categoria.value.id){
          await categoriaService.update(categoria.value, categoria.value.id)
          listarCategorias()
          closeModal()
          toast.add({severity:'success', summary: 'Categoria Actualizada', detail:'Modificado', life: 5000});
          
        }else{

          await categoriaService.store(categoria.value)
          // listarCategorias()
          categorias.value.push(categoria.value)
          closeModal()
          toast.add({severity:'success', summary: 'Categoria Registrada', detail:'Registrado', life: 3000});
          
        }
      } catch (error) {
        console.log("*********: ", error.response.data)
        errors.value = error.response.data
        toast.add({severity:'error', summary: 'Error al Guardar', detail:'Error al registrar la categoria', life: 3000});
      }
    }
    // metodos (template)
    const openModal = () => {
      displayModal.value = true
    }
    const closeModal = () => {
      displayModal.value = false
      categoria.value = {}
    }

    
    const editarDialogModal = (datos) => {
      categoria.value = datos
      displayModal.value = true
    }
    


    return { categorias, categoria, guardarCategoria, displayModal, openModal, closeModal, submitted, errors, editarDialogModal}
  }

}
</script>

<style>

</style>