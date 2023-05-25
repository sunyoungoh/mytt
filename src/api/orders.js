import { instance, instanceAuth } from './index';
import store from '@/store/index';
import { getToday, getThreedaysAgo } from '@/utils/getDays';

const getNewOrders = () => {
  return instanceAuth.get('/tenbyten/orders', {
    params: {
      brandId: store.state.brandId,
      startdate: getThreedaysAgo(),
      enddate: getToday(),
    },
  });
};

const getReadyOrders = () => {
  return instanceAuth.get('/tenbyten/orders/ready', {
    params: {
      brandId: store.state.brandId,
      startdate: getThreedaysAgo(),
      enddate: getToday(),
    },
  });
};

const getDispatchOrderHistory = () => {
  return instanceAuth.get('/tenbyten/orders/orderconfirm');
};

const dispatchOrder = dispatchData => {
  return instanceAuth.post('/tenbyten/orders/orderconfirm/mytt', dispatchData);
};

const sendMail = mailData => {
  return instance.post('/mail/mytt', mailData);
};

export {
  getNewOrders,
  getReadyOrders,
  getDispatchOrderHistory,
  dispatchOrder,
  sendMail,
};
