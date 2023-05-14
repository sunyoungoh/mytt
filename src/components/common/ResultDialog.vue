<template>
  <v-dialog v-model="dialog" max-width="300">
    <v-card>
      <v-card-title class="justify-center pt-6">
        <p class="text-center mb-0">
          수정
          <span
            v-if="result == 'success'"
            class="font-weight-bold success--text"
          >
            완료!
          </span>
          <span
            v-else-if="'fail'"
            class="red--text font-weight-bold text--lighten-1"
          >
            실패
          </span>
        </p>
      </v-card-title>
      <v-card-text v-if="errorMsg" class="text-center">
        {{ errorMsg }}
      </v-card-text>
      <v-card-actions class="pb-4">
        <v-spacer></v-spacer>
        <v-btn color="grey darken-3" text @click="$emit('close')"> 닫기 </v-btn>
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    dialog: {
      type: Boolean,
      default: false,
    },
    result: {
      type: String,
      default: '',
    },
    errorMsg: {
      type: String,
      default: '',
    },
  },
};
</script>
