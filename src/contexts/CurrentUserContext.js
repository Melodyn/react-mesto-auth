import { createContext } from 'react';
import avatarImg from '../images/avatar.gif';

const email = '';
const token = '';
export const defaultCurrentUser = {
  name: 'Меместо',
  about: 'Место ваших мемов',
  avatar: avatarImg,
  _id: '',
  cohort: '',
  isAuth: (token !== ''),
  email,
  password: '',
  token: '',
};
export const CurrentUserContext = createContext(defaultCurrentUser);
