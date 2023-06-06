<template>
  <div>
    <v-container class="mb-8 order px-4" fluid>
      <PageTitle>
        주문내역
        <template v-if="orderListCount">
          <span class="red--text text--lighten-1">{{ orderListCount }}</span
          >건
        </template>
      </PageTitle>
      <div class="order-page-desc">
        <ul>
          <li>텐바이텐 주문내역을 조회하여 보여주는 페이지입니다.</li>
          <li>주문내역 확인 시 주문상태가 배송 준비 중 상태로 바뀝니다.</li>
          <li>상품 수정 페이지에서 등록한 파일을 메일로 보낼 수 있습니다.</li>
        </ul>
        <v-btn
          small
          text
          color="red"
          class="px-2 ml-2"
          href="https://www.craft.do/s/O3QCKFdW2Ip10m"
          target="_blank"
          >메일 발송 기능 관련 안내 보러 가기 >
        </v-btn>
      </div>
      <OrderList class="order-list" v-if="orderListCount" :items="orderList" />
    </v-container>
  </div>
</template>

<script>
import PageTitle from '@/components/common/PageTitle.vue';
import { getNewOrders, getReadyOrders } from '@/api/orders';
import OrderList from '@/components/order/OrderList.vue';

export default {
  components: {
    PageTitle,
    OrderList,
  },
  mounted() {
    this.$nextTick(async () => {
      this.$store.dispatch('fetchNaverAuth'); // 발송 메일 정보 패치
      await getNewOrders(); // 신규 주문 조회
      let { data } = await getReadyOrders(); // 배송 준비 중 주문 조회
      this.orderList = data;
    });
  },
  data() {
    return {
      naverEmail: '',
      naverPass: '',
      orderList: [],
      valid: true,
      loading: false,
      errorMsg: '',
      headers: [
        { value: 'orderDate', text: '주문일' },
        { value: 'ordererId', text: '아이디' },
        { value: 'ordererName', text: '이름' },
        { value: 'ordererEmail', text: '이메일' },
        { value: 'itemName', text: '상품명' },
        { value: 'itemOptionOrigin', text: '옵션' },
        { value: 'itemRequireMemo', text: '주문메모' },
        { value: 'file', text: '파일' },
      ],
    };
  },
  computed: {
    orderListCount() {
      return this.orderList.length;
    },
  },
};
</script>
