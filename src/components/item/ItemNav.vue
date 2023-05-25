<template>
  <v-navigation-drawer
    absolute
    permanent
    hide-overlay
    width="200"
    class="d-none d-md-flex py-16"
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
      this.fetchItems();
    },
  },

  methods: {
    async fetchItems() {
      if (this.$store.getters.isLogin) {
        await this.$store.dispatch('fetchItems');
        this.items = this.$store.state.items;
        // list active 속성 반영
        this.selectedItem = this.items
          .map(item => item.itemId)
          .indexOf(this.$route.params.id);
      }
    },
  },
};
</script>
