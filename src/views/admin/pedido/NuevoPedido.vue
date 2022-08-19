<template>
  <div class="grid">
    <div class="col-12">
      <div class="card">Datos de Pedido</div>
    </div>

    <div class="col-8">
      <div class="card">
        <ListaProducto
          :products="products"
          :filters="filters"
          :totalRecords="totalRecords"
          :loading="loading"
          :asset="asset"
          :formatCurrency="formatCurrency"
          :addCarrito="addCarrito"
          :buscar="buscar"
        />
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
          <h5>CLIENTE</h5>
          <div class="grid">
            <div class="col-8">
              <span class="p-input-icon-left">
                <i class="pi pi-search" />
                <InputText
                  v-model="buscarCliente"
                  @keydown.enter="buscar()"
                  placeholder="buscar..."
                />
              </span>
                <template v-if="cliente_preview.id">
                  <h6>NOMBRE CLIENTE:</h6>
                  <p>{{ cliente_preview.nombre_completo }}</p>
                  <h6>CI/NIT: </h6>
                  <p>{{ cliente_preview.ci_nit }}</p>
                </template>
                <template v-else>
                  <h6>CLIENTE NO ENCOTRADO</h6>
                </template>
            </div>
            <div class="col-4">
              <Button
                class="p-button-sm"
                label="Nuevo Cliente"
                icon="pi pi-user"
                @click="openNuevoCLienteModal"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="col-12">
        <div class="card">
          <Button
                label="Guardar Pedido"
                icon="pi pi-user"
                @click="guardarPedido"
              />
        </div>
      </div>
    </div>
  </div>

  <Dialog
    header="Nuevo Cliente"
    v-model:visible="displayClienteModal"
    :breakpoints="{ '960px': '75vw', '640px': '90vw' }"
    :style="{ width: '50vw' }"
    :modal="true"
    class="p-fluid"
  >
    <div class="field">
      <label for="name">Nombre Cliente</label>

      <InputText
        id="name"
        v-model.trim="cliente.nombre_completo"
        required="true"
        autofocus
        :class="{ 'p-invalid': submitted && !cliente.nombre_completo }"
      />
      <small class="p-error" v-if="submitted && !cliente.nombre_completo"
        >El nombre_completo es Obligatorio.</small
      >
    </div>
    <div class="field">
      <label for="tel">Telefono</label>
      <InputText
        id="tel"
        v-model.trim="cliente.telefono"
        required="true"
        autofocus
        :class="{ 'p-invalid': submitted && !cliente.telefono }"
      />
    </div>
    <div class="field">
      <label for="tel">Correo</label>
      <InputText
        id="tel"
        v-model.trim="cliente.correo"
        required="true"
        autofocus
        :class="{ 'p-invalid': submitted && !cliente.correo }"
      />
    </div>
    <div class="field">
      <label for="tel">CI/NIT</label>
      <InputText
        id="tel"
        v-model.trim="cliente.ci_nit"
        required="true"
        autofocus
        :class="{ 'p-invalid': submitted && !cliente.ci_nit }"
      />
    </div>

    {{ cliente }}

    <template #footer>
      <Button
        label="No"
        icon="pi pi-times"
        @click="closeModal"
        class="p-button-text"
      />
      <Button label="Guardar Cliente" icon="pi pi-check" @click="guardarCliente" autofocus />
    </template>
  </Dialog>
</template>

<script>
import { FilterMatchMode } from "primevue/api";
import { ref, onMounted } from "vue";
import * as productoService from "@/service/ProductoService.js";
import * as clienteService from "@/service/ClienteService.js"
import * as pedidoService from "@/service/PedidoService.js"

import { urlBaseAsset } from "@/service/Http.js";
import { useToast } from "primevue/usetoast";
import ListaProducto from "@/components/pedido/ListaProductoPedido.vue";
import Test from "@/components/pedido/Prueba.vue";

export default {
  components: {
    ListaProducto,
    Test,
  },
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
    const products = ref([]);
    const cliente_preview = ref({})

    const dt = ref();
    const filters = ref({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });
    const buscarCliente = ref()

    const loading = ref(false);
    const totalRecords = ref(0);
    const lazyParams = ref({});
    const id_producto = ref(null);

    //cliente
    const displayClienteModal = ref(false);

    // carrito
    const carrito = ref([]);

    const onPage = (event) => {
      console.log(lazyParams.value);
      lazyParams.value = event;
      getProductos();
    };

    const onFilter = () => {
      lazyParams.value.filters = filters.value;
      getProductos();
    };

    const buscar = async () => {
      console.log(buscarCliente.value);
      const {data} = await clienteService.index(buscarCliente.value)
      cliente_preview.value = data
    };

    const getProductos = async () => {
      try {
        loading.value = true;
        let rows = lazyParams.value.rows;
        let q =
          filters.value.global.value == null ? "" : filters.value.global.value;
        let page = lazyParams.value.page == null ? 0 : lazyParams.value.page;

        const { data } = await productoService.index(page + 1, rows, q);
        products.value = data.data;
        totalRecords.value = data.total;

        loading.value = false;
      } catch (error) {
        console.log(error);
      }
    };

    const formatCurrency = (value) => {
      if (value)
        return value.toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
        });
      return;
    };

    const addCarrito = (prod) => {
      const { id, nombre, precio } = prod;
      carrito.value.push({
        id,
        nombre,
        precio,
        cantidad: 1,
      });
    };

    const openNuevoCLienteModal = () => {
      displayClienteModal.value = true;
    };

    const guardarCliente = async() => {
      const {data} = await clienteService.store(cliente.value)
      cliente_preview.value = data
    }

    const guardarPedido = async () => {
      let pedido = {
        cliente_id: cliente_preview.value.id,
        productos: carrito.value
      }

      const {data}= await pedidoService.store(pedido);
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
      cliente,
      guardarPedido,
      cliente_preview,
      guardarCliente,
      buscarCliente
    };
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