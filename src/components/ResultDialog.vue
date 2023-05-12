<template>
  <v-dialog v-model="dialog" max-width="290">
    <v-card>
      <v-card-title class="text-h6">
        <span class="mr-1">수정을</span>
        <span v-if="result == 'success'" class="font-weight-bold success--text">
          성공
        </span>
        <span v-else class="red--text text--lighten-1">실패</span>
        하였습니다.
      </v-card-title>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="grey darken-3" text @click="$emit('close')"> 닫기 </v-btn>
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
  },
};
</script>
