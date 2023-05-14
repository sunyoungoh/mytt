<template>
  <v-img class="basic-img grey lighten-2" :src="src" aspect-ratio="1">
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
.basic-img {
  border-radius: 0.25rem;
}
.item .basic-img {
  width: 150px;
  height: 150px;
}
@media screen and (max-width: 376px) {
  .item .basic-img {
    width: 120px;
    height: 120px;
  }
}
/* .basic-img {
  width: 600px;
  border-radius: 0.3rem;
}
@media screen and (min-width: 600px) {
  .item .basic-img {
    width: 150px;
  }
} */
</style>
