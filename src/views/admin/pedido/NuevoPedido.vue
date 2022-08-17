<template>
  <div class="grid">
    <div class="col-12">
      <div class="card">Datos de Pedido</div>
    </div>

    <div class="col-8">
      <div class="card">
        <DataTable
          ref="dt"
          :value="products"
          :lazy="true"
          dataKey="id"
          :paginator="true"
          :rows="5"
          :filters="filters"
          :totalRecords="totalRecords"
          :loading="loading"
          @page="onPage($event)"
          @filter="onFilter($event)"
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          :rowsPerPageOptions="[5, 10, 25]"
          currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} productos"
          responsiveLayout="scroll"
        >
          <template #header>
            <div
              class="
                table-header
                flex flex-column
                md:flex-row md:justiify-content-between
              "
            >
              <h5 class="mb-2 md:m-0 p-as-md-center">Productos</h5>
              <span class="p-input-icon-left">
                <i class="pi pi-search" />
                <InputText
                  v-model="filters['global'].value"
                  @keydown.enter="buscar()"
                  placeholder="Buscar..."
                />
              </span>
            </div>
          </template>

          <Column
            field="nombre"
            header="NOMBRE"
            :sortable="true"
            style="min-width: 16rem"
          ></Column>
          <Column header="Image">
            <template #body="slotProps">
              <img
                :src="`${asset}/${slotProps.data.imagen}`"
                :alt="slotProps.data.image"
                class="product-image"
              />
            </template>
          </Column>
          <Column
            field="precio"
            header="PRECIO"
            :sortable="true"
            style="min-width: 8rem"
          >
            <template #body="slotProps">
              {{ formatCurrency(slotProps.data.precio) }}
            </template>
          </Column>
          <Column
            field="categoria.nombre"
            header="Categoria"
            :sortable="true"
            style="min-width: 10rem"
          ></Column>

          <Column :exportable="false" style="min-width: 8rem">
            <template #body="slotProps">
              <Button
                label="+"
                icon="pi pi-add"
                @click="addCarrito(slotProps.data)"
              />
            </template>
          </Column>
        </DataTable>
      </div>
    </div>
    <div class="col-4">
      <div class="col-12">
        <div class="card">
            <h5>Carrito</h5>
            <DataTable :value="carrito" responsiveLayout="scroll">
            <Column field="nombre" header="NOM"></Column>
            <Column field="precio" header="PRECIO"></Column>
            <Column field="cantidad" header="CANT"></Column>
            <Column>
                <template #body="slotProps">
                <Button
                    label="x"
                    icon="pi pi-quit"
                    @click="quitarCarrito(slotProps.data.id)"
                />
                </template>
            </Column>
            
        </DataTable>
        </div>
      </div>
      <div class="col-12">
        <div class="card">
            <h5>CLIENTE
            </h5><span class="p-input-icon-left">
                <i class="pi pi-search" />
                <InputText v-model="filters['global'].value" @keydown.enter="buscar()" placeholder="buscar..." />
                
                 <Button label="Nuevo Cliente" icon="pi pi-user" @click="openNuevoCLienteModal" />
        
            </span>
        </div>
      </div>
      <div class="col-12">
        <div class="card">Boton Guardar</div>
      </div>
    </div>
  </div>
  
  <Dialog header="Nuevo Cliente" v-model:visible="displayClienteModal" :breakpoints="{'960px': '75vw', '640px': '90vw'}" :style="{width: '50vw'}" :modal="true">
            
            <div class="field">
                <label for="name">Nombre Cliente</label>

                <InputText id="name" v-model.trim="cliente.nombre_completo" required="true" autofocus :class="{'p-invalid': submitted && !cliente.nombre_completo}" />
                <small class="p-error" v-if="submitted && !cliente.nombre_completo">El nombre_completo es Obligatorio.</small>
            </div>
            <div class="field">
                <label for="tel">Telefono</label>
                <InputText id="tel" v-model.trim="cliente.telefono" required="true" autofocus :class="{'p-invalid': submitted && !cliente.telefono}" />
            </div>
            <div class="field">
                <label for="tel">Correo</label>
                <InputText id="tel" v-model.trim="cliente.correo" required="true" autofocus :class="{'p-invalid': submitted && !cliente.correo}" />
            </div>
            <div class="field">
                <label for="tel">CI/NIT</label>
                <InputText id="tel" v-model.trim="cliente.ci_nit" required="true" autofocus :class="{'p-invalid': submitted && !cliente.ci_nit}" />
            </div>

            {{cliente}}



            <template #footer>
                <Button label="No" icon="pi pi-times" @click="closeModal" class="p-button-text"/>
                <Button label="Yes" icon="pi pi-check" @click="closeModal" autofocus />
            </template>
        </Dialog>
</template>

<script>
import { FilterMatchMode } from "primevue/api";
import { ref, onMounted } from "vue";
import * as productoService from "@/service/ProductoService.js";
import { urlBaseAsset } from "@/service/Http.js";
import { useToast } from "primevue/usetoast";

export default {
  data() {
    return {
      asset: urlBaseAsset,
    };
  },
  setup() {
    const toast = useToast();

    onMounted(() => {
      // productService.value.getProducts().then(data => products.value = data);
      getProductos();
    });

    const product = ref({});
    const cliente = ref({});
    const products = ref();

    const dt = ref();
    const filters = ref({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });

    const loading = ref(false);
    const totalRecords = ref(0);
    const lazyParams = ref({});
    const id_producto = ref(null);

    //cliente
    const displayClienteModal = ref(false)
    

    // carrito
    const carrito = ref([]);



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


 const formatCurrency = (value) => {
            if(value)
				return value.toLocaleString('en-US', {style: 'currency', currency: 'USD'});
			return;
        };

        const addCarrito = (prod) => {
            const { id, nombre, precio } = prod
            carrito.value.push({
                id,
                nombre,
                precio,
                cantidad: 1
            })
        }

        const openNuevoCLienteModal = () => {
            displayClienteModal.value = true
        }


    return {
        product,
        products,
        dt,
        filters,
        loading,
        totalRecords,
        lazyParams,
        id_producto,
        onPage,
        onFilter,
        buscar,
        getProductos,
        formatCurrency,
        addCarrito,
        carrito,
        displayClienteModal,
        openNuevoCLienteModal,
        cliente
    }
  },
};
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