<template>
  <div class="home">
    <v-container>
      <v-row justify="center">
        <v-spacer></v-spacer>
        <v-col>
          <v-input v-model="apiKey"></v-input>
          <v-btn
            class="mt-6 font-weight-bold"
            @click="getItems"
            x-large
            outlined
            height="56"
            min-width="300"
            max-width="400"
            >조회하기
          </v-btn>
        </v-col>
        <v-spacer></v-spacer>
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
import { getBrandInfo, getItems } from '@/api/items';

export default {
  name: 'Home',
  components: {
    ItemCard,
  },
  data() {
    return {
      apiKey: '',
      items: '',
    };
  },
  methods: {
    async getItems() {
      let res = await getBrandInfo(this.apiKey);
      if (res.status == 200) {
        this.$store.commit('setBrandId', res.data.brandid);
        let { data } = await getItems();
        this.items = data.outPutValue.items;
      }
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
