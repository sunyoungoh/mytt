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

const editItem = (itemId, editHTML) => {
  return instanceAuth.put('/tenbyten/item', {
    itemId: itemId,
    content: editHTML,
  });
};

export { getBrandInfo, getItems, getItem, editItem };
