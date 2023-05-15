<template>
  <v-row class="px-3">
    <v-col
      cols="6"
      sm="4"
      md="3"
      lg="3"
      class="px-1 pt-0 pb-4 px-md-2"
      v-for="(item, i) in items"
      :key="i"
    >
      <router-link
        :to="'/item/' + item.itemId + '/' + item.salesCode"
        class="text-decoration-none"
      >
        <ItemCard
          :item-id="item.itemId"
          :item-name="item.name"
          :salesCode="item.salesCode"
        />
      </router-link>
    </v-col>
  </v-row>
</template>

<script>
import ItemCard from '@/components/item/ItemCard.vue';

export default {
  name: 'ItemList',
  components: {
    ItemCard,
  },
  props: {
    items: {
      type: [Array, Boolean],
    },
  },
};
</script>

<style></style>
