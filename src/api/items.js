import { instance, instanceAuth } from './index';
import store from '@/store/index';

const getBrandInfo = apiKey => {
  return instance.get('/tenbyten/brandinfo', {
    headers: { Authorization: apiKey },
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

const getWaitItems = () => {
  return instanceAuth.get('/tenbyten/waitItems', {
    params: {
      brandId: store.state.brandId,
    },
  });
};

const updateItemInfo = updateData => {
  return instanceAuth.put('/tenbyten/item', updateData);
};

const getWaitItem = id => {
  return instanceAuth.get(`/tenbyten/waitItem/${id}`);
};

const updateWaitItemInfo = updateData => {
  return instanceAuth.put('/tenbyten/waitItem', updateData);
};

const updateItemStatus = (itemId, sellYN) => {
  return instanceAuth.put('/tenbyten/item/status', {
    itemId: itemId,
    brandId: store.state.brandId,
    sellYN: sellYN,
  });
};

const updateItemImages = (itemId, colorCode, images) => {
  return instanceAuth.put('/tenbyten/item/images', {
    itemId: itemId,
    colorCode: colorCode,
    images: images,
  });
};

export {
  getBrandInfo,
  getItems,
  getItem,
  getWaitItems,
  getWaitItem,
  updateItemInfo,
  updateItemImages,
  updateWaitItemInfo,
  updateItemStatus,
};
