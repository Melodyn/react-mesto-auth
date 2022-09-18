import { createContext } from 'react';
import avatarImg from '../images/avatar.gif';

const email = 'sergei.melodyn@yandex.ru';
export const defaultCurrentUser = {
  name: 'Меместо',
  about: 'Место ваших мемов',
  avatar: avatarImg,
  _id: '',
  cohort: '',
  isAuth: (email !== ''),
  email,
};
export const CurrentUserContext = createContext(defaultCurrentUser);
