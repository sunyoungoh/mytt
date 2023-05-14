<template>
  <v-img class="title-img grey lighten-2" :src="src" aspect-ratio="1">
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
.title-img {
  width: 600px;
}
@media screen and (min-width: 600px) {
  .title-img {
    width: 500px;
  }
}
</style>
