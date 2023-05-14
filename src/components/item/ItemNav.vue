<template>
  <v-navigation-drawer
    absolute
    permanent
    hide-overlay
    width="200"
    class="d-none d-md-flex"
  >
    <v-list dense nav>
      <v-list-item-group v-model="selectedItem">
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          link
          :to="'/item/' + item.itemId + '/' + item.salesCode"
          class="text-decoration-none"
        >
          <v-list-item-content>
            <v-list-item-title class="font-weight-regular">
              {{ item.name }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import { getItems } from '@/api/items';

export default {
  async mounted() {
    this.fetchItems();
  },
  data() {
    return {
      items: [],
      selectedItem: '',
    };
  },
  watch: {
    $route() {
      console.log('변경');
      this.fetchItems();
    },
  },

  methods: {
    async fetchItems() {
      if (this.$store.getters.isLogin) {
        let count = 1;
        let { data } = await getItems(count);
        this.items = data;

        //100개가 넘으면 다음페이지 호출
        while (this.items.length % 100 == 0) {
          count++;
          let { data } = await getItems(count);
          this.items.push(...data);
        }
        this.selectedItem = this.items
          .map(item => item.itemId)
          .indexOf(this.$route.params.id);
      }
    },
  },
};
</script>
