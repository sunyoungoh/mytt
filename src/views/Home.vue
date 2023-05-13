<template>
  <div class="home">
    <v-container>
      <v-row justify="center" class="mt-6">
        <template v-if="$store.state.brandName !== ''">
          <v-col cols="12">
            <h2 class="text-center">
              {{ $store.state.brandName }}님, 전시상품은 총
              <span class="red--text text--light-1">{{ itemsCount }}</span
              >개입니다.
            </h2>
          </v-col>
        </template>
      </v-row>
      <v-row justify="center" class="px-2">
        <v-col
          cols="6"
          sm="4"
          md="3"
          lg="3"
          class="pa-2"
          v-for="(item, i) in items"
          :key="i"
        >
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
      // 한 페이지당 100개씩 가져오기 때문에 페이지수로 호출
      let count = 1;
      let { data } = await getItems(count);
      this.items = data;

      //100개가 넘으면 다음페이지 호출
      while (this.items.length % 100 == 0) {
        count++;
        let { data } = await getItems(count);
        this.items.push(...data);
      }
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
@media screen and (max-width: 768px) {
  h2 {
    font-size: 1.375rem;
  }
}
a {
  text-decoration: none;
  color: #222222 !important;
}
</style>
