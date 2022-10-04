export const useStorageToken = (initToken = '') => {
  const savedToken = localStorage.getItem('token') || initToken;
  const saveToken = (token) => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  };
  return [savedToken, saveToken];
};
