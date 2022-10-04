import { createContext } from 'react';
import avatarImg from '../images/avatar.gif';

export const defaultCurrentUser = {
  name: 'Меместо',
  about: 'Место ваших мемов',
  avatar: avatarImg,
  _id: '',
  cohort: '',
  email: '',
  token: '',
  isAuth: function isAuth() {
    return (typeof this.token === 'string') && (this.token.length > 0);
  },
};
export const CurrentUserContext = createContext(defaultCurrentUser);
