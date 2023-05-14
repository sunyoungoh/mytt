<template>
  <v-img
    class="title-img grey lighten-2"
    :src="src"
    aspect-ratio="1"
    width="500"
  >
    <template v-slot:placeholder>
      <LoadingImage />
    </template>
  </v-img>
</template>

<script>
import LoadingImage from '@/components/LoadingImage.vue';

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

<style></style>
