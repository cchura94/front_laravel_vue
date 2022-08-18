<template>
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
</template>

<script>
export default {
    props: {
        products: {
            type: Array,
            required: true
        },
        filters: Object,
        totalRecords: Number,
        loading: {
            type: Boolean
        },
        asset: String,
        formatCurrency: Function,
        addCarrito: Function,
        buscar: Function
    }

}
</script>

<style>

</style>