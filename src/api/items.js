import { instance, instanceAuth } from './index';
import store from '@/store/index';

const getBrandInfo = apiKey => {
  return instance.get('/tenbyten/brandinfo', {
    headers: { Authorization: `bearer ${apiKey}` },
  });
};

const getItems = count => {
  return instanceAuth.get('/tenbyten/items', {
    params: {
      brandId: store.state.brandId,
      count: count,
    },
  });
};
const getItem = id => {
  return instanceAuth.get(`/tenbyten/items/${id}`);
};

const updateItemInfo = updateData => {
  return instanceAuth.put('/tenbyten/item', updateData);
};
const updateItemStatus = (itemId, sellYN) => {
  return instanceAuth.put('/tenbyten/item/status', {
    itemId: itemId,
    brandId: store.state.brandId,
    sellYN: sellYN,
  });
};

export { getBrandInfo, getItems, getItem, updateItemInfo, updateItemStatus };
