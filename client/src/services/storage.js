import localForage from 'localforage';

// Настройка localForage
localForage.config({
  name: 'SocialNetworkApp',
  storeName: 'auth_data', // по умолчанию 'keyvaluepairs'
  description: 'Хранилище для токена и данных пользователя'
});

const storage = {
  async getItem(key) {
    try {
      return await localForage.getItem(key);
    } catch (error) {
      console.error('Error reading from storage', error);
      return null;
    }
  },
  async setItem(key, value) {
    try {
      await localForage.setItem(key, value);
    } catch (error) {
      console.error('Error writing to storage', error);
    }
  },
  async removeItem(key) {
    try {
      await localForage.removeItem(key);
    } catch (error) {
      console.error('Error removing from storage', error);
    }
  },
  async clear() {
    try {
      await localForage.clear();
    } catch (error) {
      console.error('Error clearing storage', error);
    }
  }
};

export default storage;