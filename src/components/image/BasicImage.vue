<template>
  <v-img class="grey lighten-2" :src="src" aspect-ratio="1">
    <template v-slot:placeholder>
      <LoadingImage />
    </template>
  </v-img>
</template>

<script>
import LoadingImage from '@/components/image/LoadingImage.vue';

export default {
  components: {
    LoadingImage,
  },
  props: {
    src: {
      type: String,
      default: '',
    },
  },
};
</script>

<style>
.v-image {
  border-radius: 0.25rem;
}

.item-container .basic-img {
  width: 150px;
  height: 150px;
}

.item-container .content-img {
  width: 100px;
  height: 100px;
  overflow: hidden;
  position: relative;
  border: 1px solid #eee;
}

@media screen and (max-width: 376px) {
  .item-container .basic-img {
    width: 120px;
    height: 120px;
  }
}
</style>
