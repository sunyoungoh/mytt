<template>
  <div>
    <button
      class="btn-send-all"
      v-if="$route.path == '/ready'"
      @click="clickSendAll"
    >
      모두 메일 발송하기
    </button>
    <div class="table-container" id="no-more-tables">
      <table>
        <thead>
          <TableTitle
            :titles="tableTitles"
            :click-field="clickField"
            :order-by="orderBy"
            @sort-list="sortList"
          />
        </thead>
        <tbody>
          <OrderItem
            v-for="(item, i) in orderList"
            :key="i"
            :item="item"
            :titles="tableTitles"
            :clickField="clickField"
            :send-all="sendAll"
          />
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import TableTitle from '@/components/common/table/TableTitle.vue';
import OrderItem from '@/components/order/OrderItem.vue';
// import { sortOrderList } from '@/utils/sortArr';

export default {
  components: {
    TableTitle,
    OrderItem,
  },

  props: {
    items: {
      type: Array,
    },
  },
  data() {
    return {
      sendAll: false,
      tableTitles: [
        { key: 'orderDate', value: '주문일' },
        { key: 'ordererId', value: '아이디' },
        { key: 'ordererName', value: '이름' },
        { key: 'ordererEmail', value: '이메일' },
        { key: 'ordererCellPhone', value: '휴대폰' },
        { key: 'itemName', value: '상품명' },
        { key: 'itemOptionOrigin', value: '옵션' },
        { key: 'itemRequireMemo', value: '주문메모' },
        { key: 'file', value: '파일확인' },
        { key: 'sendMail', value: '메일발송' },
      ],
      orderBy: 'desc',
      clickField: '',
    };
  },
  computed: {
    orderList: {
      get() {
        return this.items;
      },
      set() {},
    },
  },
  methods: {
    clickSendAll() {
      this.sendAll = true;
    },
    sortList(title) {
      this.clickField = title;
      this.orderBy = this.orderBy == 'desc' ? 'asc' : 'desc';
      // this.orderList = sortOrderList(this.orderList, title, this.orderBy);
    },
  },
};
</script>

<style></style>
