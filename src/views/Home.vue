<template>
  <div class="home">
    <v-container class="mb-8">
      <PageTitle v-if="$store.state.brandName !== ''">
        <template v-if="!isSearch">
          {{ $store.state.brandName }}님, 등록된 상품은 총
          <span class="red--text text--light-1"> {{ itemsCount }}</span
          >개입니다.
        </template>
        <template v-else>
          '{{ searchTerm }}'로 검색된 상품은 총
          <span class="red--text text--light-1"> {{ itemsCount }}</span
          >개입니다.
        </template>
      </PageTitle>
      <div class="px-md-2 px-1 pt-0 pt-md-2 pb-4 col-12 col-md-7 mx-auto">
        <v-text-field
          prepend-inner-icon="mdi-magnify"
          class="search-bar pt-0"
          @keyup.enter="searchItem"
          v-model="searchTerm"
        ></v-text-field>
      </div>
      <ItemList :items="searchItems" />
    </v-container>
  </div>
</template>

<script>
import PageTitle from '@/components/common/PageTitle.vue';
import ItemList from '@/components/item/ItemList.vue';

export default {
  name: 'Home',
  components: {
    PageTitle,
    ItemList,
  },
  async mounted() {
    if (this.$store.getters.isLogin) {
      this.originItems = await this.$store.dispatch('fetchItems');
      this.searchItems = this.originItems;
      this.itemsCount = this.originItems.length;
    } else {
      this.$router.push({ path: '/login' });
    }
  },
  data() {
    return {
      originItems: [],
      itemsCount: '',
      searchTerm: '',
      searchItems: [],
      isSearch: false,
    };
  },
  methods: {
    searchItem() {
      if (this.searchTerm) {
        this.searchItems = this.originItems.filter(item =>
          item.name.includes(this.searchTerm),
        );
        this.isSearch = true;
        this.itemsCount = this.searchItems.length;
      } else {
        this.isSearch = false;
        this.searchItems = this.originItems;
        this.itemsCount = this.originItems.length;
      }
    },
  },
};
</script>
