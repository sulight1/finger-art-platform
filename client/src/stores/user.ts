import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { UserInfo } from '../api/user';
import { getProfile, addCoins } from '../api/user';

export const useUserStore = defineStore('user', () => {
  const user = ref<UserInfo | null>(null);

  const isLoggedIn = computed(() => !!user.value);
  const isAdmin = computed(() => user.value?.role === 'ADMIN');
  const canCreateProduct = computed(() => isLoggedIn.value && !isAdmin.value);

  const userAvatar = computed(() => {
    const avatar = user.value?.avatar;
    if (avatar) {
      if (avatar.startsWith('http')) return avatar;
      return `http://localhost:3000${avatar}`;
    }
    // Default avatars based on role
    if (isAdmin.value) {
      return 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin&backgroundColor=b6e3f4';
    }
    return 'https://api.dicebear.com/7.x/avataaars/svg?seed=User&backgroundColor=ffdfbf';
  });

  function setLogin(userInfo: UserInfo) {
    user.value = userInfo;
    localStorage.setItem('user', JSON.stringify(userInfo));
  }

  function updateUserInfo(userInfo: Partial<UserInfo>) {
    if (user.value) {
      user.value = { ...user.value, ...userInfo };
      localStorage.setItem('user', JSON.stringify(user.value));
    }
  }

  async function fetchProfile() {
    if (!user.value?.id) return;
    try {
      const userInfo = await getProfile(user.value.id);
      setLogin(userInfo);
    } catch (err) {
      console.error('Failed to fetch profile', err);
    }
  }

  async function addCoinsToUser(amount: number) {
    if (!user.value?.id) return;
    try {
      const userInfo = await addCoins(user.value.id, amount);
      setLogin(userInfo);
      return userInfo;
    } catch (err) {
      console.error('Failed to add coins', err);
      throw err;
    }
  }

  function logout() {
    user.value = null;
    localStorage.removeItem('user');
  }

  function restore() {
    const saved = localStorage.getItem('user');
    if (saved) {
      try {
        user.value = JSON.parse(saved);
      } catch {
        logout();
      }
    }
  }

  return {
    user,
    isLoggedIn,
    isAdmin,
    userAvatar,
    canCreateProduct,
    setLogin,
    updateUserInfo,
    fetchProfile,
    addCoinsToUser,
    logout,
    restore
  };
});
