<template>
  <v-navigation-drawer
    absolute
    permanent
    hide-overlay
    width="200"
    class="d-none d-md-flex"
  >
    <v-list dense nav>
      <v-list-item
        v-for="(item, i) in items"
        :key="i"
        link
        :href="'/item/' + item.itemId + '/' + item.salesCode"
        class="text-decoration-none"
      >
        <v-list-item-content>
          <v-list-item-title class="font-weight-regular">{{
            item.name
          }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import { getItems } from '@/api/items';

export default {
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
    }
  },
  data() {
    return {
      items: [],
    };
  },
};
</script>

<style></style>
