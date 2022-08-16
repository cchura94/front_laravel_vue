<template>
<div>
  <div class="card">
        <Toolbar class="mb-4">
                <template #start>
                    <Button label="Nuevo Producto" icon="pi pi-plus" class="p-button-success mr-2" @click="openDialogNuevo" />
                    <Button label="Eliminar" icon="pi pi-trash" class="p-button-danger" @click="confirmDeleteSelected" :disabled="!selectedProducts || !selectedProducts.length" />
                </template>

                <template #end>
                    <FileUpload mode="Import" accept="image/*" :maxFileSize="1000000" label="Import" chooseLabel="Import" class="mr-2 inline-block" />
                    <Button label="Exportar" icon="pi pi-upload" class="p-button-help" @click="exportCSV($event)"  />
                </template>
        </Toolbar>

        <DataTable ref="dt" :value="products" :lazy="true" v-model:selection="selectedProducts" dataKey="id" 
                :paginator="true" :rows="5" :filters="filters" :totalRecords="totalRecords" :loading="loading"
                @page="onPage($event)" @filter="onFilter($event)"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" :rowsPerPageOptions="[5,10,25]"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products" responsiveLayout="scroll">
                <template #header>
                    <div class="table-header flex flex-column md:flex-row md:justiify-content-between">
						<h5 class="mb-2 md:m-0 p-as-md-center">Gestión Productos</h5>
						<span class="p-input-icon-left">
                            <i class="pi pi-search" />
                            <InputText v-model="filters['global'].value" @keydown.enter="buscar()" placeholder="Buscar..." />
                        </span>
					</div>
                </template>

                <Column selectionMode="multiple" style="width: 3rem" :exportable="false"></Column>
                <Column field="id" header="ID" :sortable="true" style="min-width:12rem"></Column>
                <Column field="nombre" header="NOMBRE" :sortable="true" style="min-width:16rem"></Column>
                <Column header="Image">
                     <template #body="slotProps">
                        <img :src="`${asset}/${slotProps.data.imagen}`" :alt="slotProps.data.image" class="product-image" />
                    </template>
                </Column>
                <Column field="precio" header="PRECIO" :sortable="true" style="min-width:8rem">
                    <template #body="slotProps">
                        {{formatCurrency(slotProps.data.precio)}}
                    </template>
                </Column>
                <Column field="categoria.nombre" header="Categoria" :sortable="true" style="min-width:10rem"></Column>
               
                <Column :exportable="false" style="min-width:8rem">
                    <template #body="slotProps">
                        <Button label="IMG" icon="pi pi-external-link" @click="openModalImagen(slotProps.data)" />
                        <Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2" @click="editProduct(slotProps.data)" />
                        <Button icon="pi pi-trash" class="p-button-rounded p-button-warning" @click="confirmDeleteProduct(slotProps.data)" />
                    </template>
                </Column>
            </DataTable>

        <Dialog v-model:visible="productDialog" :style="{width: '450px'}" header="Product Details" :modal="true" class="p-fluid">
            <img src="https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png" :alt="product.image" class="product-image" v-if="product.image" />
            <div class="field">
                <label for="name">Nombre</label>
                <InputText id="name" v-model.trim="product.nombre" required="true" autofocus :class="{'p-invalid': submitted && !product.nombre}" />
                <small class="p-error" v-if="submitted && !product.nombre">El Nombre es Obligatorio.</small>
            </div>
            <div class="field">
                <label for="description">Descripción</label>
                <Textarea id="description" v-model="product.descripcion" required="true" rows="3" cols="20" />
            </div>


            <div class="field">
                <label class="mb-3">Categoria</label>
                <div class="formgrid grid">
                    <div class="field-radiobutton col-6" v-for="cat in categorias" :key="cat.id">
                        <RadioButton id="category1" name="category" :value="cat.id" v-model="product.categoria_id" />
                        <label for="category1">{{ cat.nombre }}</label>
                    </div>
                    
                </div>
            </div>

            <div class="formgrid grid">
                <div class="field col">
                    <label for="price">Precio</label>
                    <InputNumber id="price" v-model="product.precio" mode="currency" currency="USD" locale="en-US" />
                </div>
                <div class="field col">
                    <label for="quantity">Cantidad</label>
                    <InputNumber id="quantity" v-model="product.stock" integeronly />
                </div>
            </div>
            <template #footer>
                <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialog"/>
                <Button label="Save" icon="pi pi-check" class="p-button-text" @click="guardarProducto" />
            </template>
            <pre>{{product}}</pre>
        </Dialog>

        
        <Dialog header="Header" v-model:visible="displayModalImg" :breakpoints="{'960px': '75vw', '640px': '90vw'}" :style="{width: '50vw'}" :modal="true">
           <FileUpload name="demo[]" @upload="onUpload" :customUpload="true" @uploader="onImagenSeleccionada" accept="image/*" :maxFileSize="1000000">
                <template #empty>
                    <p>Drag and drop files to here to upload.</p>
                </template>
            </FileUpload>

        </Dialog>
  </div>
<Toast />
</div>
</template>

<script>
import { FilterMatchMode } from 'primevue/api';
import {ref, onMounted} from "vue"
import * as productoService from "@/service/ProductoService.js"
import * as categoriaService from "@/service/CategoriaService"
import { urlBaseAsset } from "@/service/Http.js"
import { useToast } from 'primevue/usetoast';

export default {
    data(){
        return {
            asset: urlBaseAsset
        }
    },
    setup(){

        const toast = useToast();

        onMounted(() => {
            // productService.value.getProducts().then(data => products.value = data);
            getProductos()
            getCategorias()
        })


        const productDialog = ref(false);
        const displayModalImg = ref(false)
        const product = ref({})
        const products = ref()
        const categorias = ref([])

         const dt = ref();
        const deleteProductDialog = ref(false);
        const deleteProductsDialog = ref(false);
        const selectedProducts = ref();
        const filters = ref({
            'global': {value: null, matchMode: FilterMatchMode.CONTAINS},
        });
        const submitted = ref(false);

        const loading = ref(false);
        const totalRecords = ref(0);
        const lazyParams = ref({});
        const id_producto = ref(null)


        const getCategorias = async () => {
            try {
                const {data} = await categoriaService.index();
                categorias.value = data
                
            } catch (error) {
                console.log(error)
            }
        }

        const onPage = (event) => {
            console.log(lazyParams.value)
            lazyParams.value = event;
            getProductos();
        };

         const onFilter = () => {
            lazyParams.value.filters = filters.value ;
            getProductos();
        }

        const buscar = () => {
            console.log(filters.value.global.value)
            getProductos();
        }

        const getProductos = async () => {
            try {
                loading.value=true
                let rows = lazyParams.value.rows
                let q = filters.value.global.value == null?'':filters.value.global.value;
                let page = (lazyParams.value.page == null)?0:lazyParams.value.page
                
                const {data} = await productoService.index(page + 1, rows, q);
                products.value = data.data
                totalRecords.value = data.total

                loading.value = false;
                
            } catch (error) {
                console.log(error)
            }
        }

        const openDialogNuevo = () => {
            productDialog.value = true
        }

        const guardarProducto = async () =>{

            try {
                const {data} = await productoService.store(product.value)

                productDialog.value = false;
                product.value = {};

                getProductos()

             } catch (error) {
                console.log(error)
            }
        }

        const formatCurrency = (value) => {
            if(value)
				return value.toLocaleString('en-US', {style: 'currency', currency: 'USD'});
			return;
        };

const openModalImagen = (prod) => {
            id_producto.value = prod.id
            displayModalImg.value = true;
        };
        const closeModalImagen = () => {
            id_producto.value = null
            displayModalImg.value = false;
        }

        const onUpload = () => {
            toast.add({severity: 'info', summary: 'Success', detail: 'File Uploaded', life: 3000});
        }

        const onImagenSeleccionada = async (event) => {
            console.log(event.files[0])
            let fd = new FormData();
            fd.append("imagen", event.files[0])
            fd.append("_method", 'PUT')

            await productoService.actualizarImagen(fd, id_producto.value)

            getProductos()
            closeModalImagen()
            toast.add({severity: 'info', summary: 'Success', detail: 'File Uploaded', life: 3000});
        }

        return {
            openDialogNuevo,
            productDialog,
            product,
            categorias,
            products,
            guardarProducto,
            dt,
            deleteProductDialog,
            deleteProductsDialog,
            selectedProducts,
            filters,
            submitted,
            formatCurrency,
            loading,
            totalRecords,
            onPage,
            lazyParams,
            onFilter,
            buscar,
            openModalImagen,
            closeModalImagen,
            displayModalImg,
            onUpload,
            onImagenSeleccionada
        }
    }
}
</script>

<style lang="scss" scoped>
.table-header {
    display: flex;
    align-items: center;
    justify-content: space-between;

    @media screen and (max-width: 960px) {
        align-items: start;
	}
}

.product-image {
    width: 50px;
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
}

.p-dialog .product-image {
    width: 50px;
    margin: 0 auto 2rem auto;
    display: block;
}

.confirmation-content {
    display: flex;
    align-items: center;
    justify-content: center;
}
@media screen and (max-width: 960px) {
	::v-deep(.p-toolbar) {
		flex-wrap: wrap;
        
		.p-button {
            margin-bottom: 0.25rem;
        }
	}
}
</style>