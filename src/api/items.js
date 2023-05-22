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

const updateItemImages = (itemId, colorCode, images) => {
  return instanceAuth.put('/tenbyten/item/images', {
    itemId: itemId,
    colorCode: colorCode, // 컬러코드 에러로 실행못함
    images: images,
  });
};

export {
  getBrandInfo,
  getItems,
  getItem,
  updateItemInfo,
  updateItemImages,
  updateItemStatus,
};
