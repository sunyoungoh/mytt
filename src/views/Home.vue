<template>
  <div class="home">
    <v-container>
      <v-row justify="center" class="mt-6">
        <template v-if="$store.state.brandName !== ''">
          <v-col cols="12">
            <h2 class="text-center">
              {{ $store.state.brandName }}님, 등록된 상품은 총
              {{ itemsCount }}개입니다.
            </h2>
          </v-col>
        </template>
      </v-row>
      <v-row justify="center">
        <v-col cols="auto" v-for="(item, i) in items" :key="i">
          <router-link :to="'/item/' + item.itemId">
            <ItemCard :item-id="item.itemId" :item-name="item.name" />
          </router-link>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import ItemCard from '@/components/ItemCard.vue';
import { getItems } from '@/api/items';

export default {
  name: 'Home',
  components: {
    ItemCard,
  },
  async mounted() {
    if (this.$store.getters.isLogin) {
      let { data } = await getItems();
      this.items = data.outPutValue.items;
    } else {
      this.$router.push({ path: '/login' });
    }
  },
  data() {
    return {
      items: '',
    };
  },
  computed: {
    itemsCount() {
      return this.items.length;
    },
  },
};
</script>

<style scoped>
a {
  text-decoration: none;
  color: #222222 !important;
}
</style>
