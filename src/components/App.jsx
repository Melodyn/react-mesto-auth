import '../vendor/normalize.css';
import '../blocks/index.css';
import { useEffect, useState } from 'react';
import {
  Routes, Route, Navigate, useNavigate,
} from 'react-router-dom';
import { Api } from '../utils/Api';
import { apiConfig, POPUP_NAME } from '../utils/constants';
// components
import { Header } from './Header';
import { Footer } from './Footer';
import { Main } from './Main';
import { Login } from './Page/Login';
import { Register } from './Page/Register';
import { ProtectedRoute } from './ProtectedRoute';
import { PopupWithImage } from './Popup/PopupWithImage';
import { PopupEditProfile } from './Popup/PopupEditProfile';
import { PopupEditAvatar } from './Popup/PopupEditAvatar';
import { PopupAddCard } from './Popup/PopupAddCard';
import { PopupWithInfo } from './Popup/PopupWithInfo';
import { useStorageToken } from '../hooks/useStorage';
// contexts
import { defaultCurrentUser, CurrentUserContext } from '../contexts/CurrentUserContext';

export const App = () => {
  const apiMesto = new Api(apiConfig);
  const navigate = useNavigate();
  const [openPopupName, setOpenPopupName] = useState('');
  const [selectedCard, setSelectedCard] = useState({});
  const [lastOperationResult, setLastOperationResult] = useState({
    isSuccess: true,
    message: 'Успешно',
  });
  const [token, saveToken] = useStorageToken();
  const [currentUser, setCurrentUser] = useState({
    ...defaultCurrentUser,
    token,
  });
  const [cards, updateCards] = useState([]);

  const showErrorInPopup = (onAction = '') => (err) => {
    setLastOperationResult({
      isSuccess: false,
      message: err.message || `Что-то пошло не так${onAction ? ` ${onAction}` : ''}! Попробуйте ещё раз.`,
    });
    setOpenPopupName(POPUP_NAME.INFO);
  };

  const updateUser = (user) => {
    const updatedUser = {
      ...currentUser,
      ...user,
    };
    saveToken(updatedUser.token);
    setCurrentUser(updatedUser);
  };

  useEffect(() => {
    apiMesto.setToken(currentUser.token);
    if (currentUser.token) {
      apiMesto.checkToken()
        .then((result) => {
          if (result && result.data) {
            Promise
              .all([
                apiMesto.getCards(),
                apiMesto.getProfile(),
              ])
              .then(([initCards, user]) => {
                updateCards(initCards.slice().reverse());
                updateUser({
                  ...result.data,
                  ...user,
                });
                navigate('/');
              })
              .catch(showErrorInPopup('при получении данных с сервера'));
          }
        })
        .catch((showErrorInPopup('при проверке токена')));
    } else {
      updateUser(defaultCurrentUser);
      updateCards([]);
    }
  }, [currentUser.token]);

  // popup
  const onClosePopup = () => {
    setOpenPopupName('');
  };

  const closeByEscape = (e) => (e.key === 'Escape') && onClosePopup();

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (openPopupName !== '') {
      document.addEventListener('keydown', closeByEscape);
      return () => {
        document.removeEventListener('keydown', closeByEscape);
      };
    }
  }, [openPopupName]);

  // button
  const onOpenPopupEditProfile = () => {
    setOpenPopupName(POPUP_NAME.PROFILE);
  };

  const onOpenPopupEditAvatar = () => {
    setOpenPopupName(POPUP_NAME.AVATAR);
  };

  const onOpenPopupCard = () => {
    setOpenPopupName(POPUP_NAME.CARD);
  };

  // card
  const onCardClick = (card) => {
    setSelectedCard(card);
    setOpenPopupName(POPUP_NAME.PREVIEW);
  };

  const onCardLike = (card) => {
    apiMesto
      .likeCard({ cardId: card._id, liked: card.liked })
      .then((updatedCard) => {
        updateCards((state) => state
          .map((crd) => ((crd._id === card._id) ? updatedCard : crd)));
      })
      .catch(showErrorInPopup());
  };

  const onCardRemove = (card) => {
    apiMesto
      .removeCard({ cardId: card._id })
      .then(() => {
        updateCards((state) => state
          .filter(({ _id }) => _id !== card._id));
      })
      .catch(showErrorInPopup());
  };

  const onCardAdd = (data) => {
    apiMesto
      .createCard(data)
      .then((card) => {
        onClosePopup();
        updateCards((state) => [card, ...state]);
      })
      .catch(showErrorInPopup());
  };

  // profile
  const onEditProfile = (updatedInfo) => {
    apiMesto
      .setInfo(updatedInfo)
      .then((updatedUser) => {
        onClosePopup();
        updateUser(updatedUser);
      })
      .catch(showErrorInPopup());
  };

  const onEditAvatar = (updatedInfo) => {
    apiMesto
      .setAvatar(updatedInfo)
      .then((updatedUser) => {
        onClosePopup();
        updateUser(updatedUser);
      })
      .catch(showErrorInPopup());
  };

  // auth
  const onLogin = (user) => {
    apiMesto.login(user)
      .then((result) => {
        if (result && result.token) {
          updateUser({
            email: user.email,
            token: result.token,
          });
        } else {
          showErrorInPopup('при входе');
        }
      })
      .catch(showErrorInPopup());
  };

  const onRegister = (user) => {
    apiMesto.register(user)
      .then((result) => {
        if (result && result.data) {
          setLastOperationResult({
            isSuccess: true,
            message: 'Вы успешно зарегистрировались!',
          });
          setOpenPopupName(POPUP_NAME.INFO);
          navigate('/signin');
        } else {
          showErrorInPopup('при регистрации');
        }
      })
      .catch(showErrorInPopup());
  };

  const onLogout = () => {
    updateUser(defaultCurrentUser);
    navigate('/signin');
  };

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <Header onClickAuthButton={onLogout} />

      <Routes>
        <Route
          path="/"
          element={(
            <ProtectedRoute>
              <Main
                cards={cards}
                onEditProfile={onOpenPopupEditProfile}
                onAddCard={onOpenPopupCard}
                onEditAvatar={onOpenPopupEditAvatar}
                onCardClick={onCardClick}
                onCardLike={onCardLike}
                onCardRemove={onCardRemove}
              />
            </ProtectedRoute>
          )}
        />

        <Route
          path="/signin"
          element={
            currentUser.isAuth()
              ? <Navigate to="/" />
              : <Login onSave={onLogin} />
          }
        />

        <Route
          path="/signup"
          element={
            currentUser.isAuth()
              ? <Navigate to="/" />
              : <Register onSave={onRegister} />
          }
        />
      </Routes>

      <Footer />

      <PopupEditProfile
        isOpen={POPUP_NAME.PROFILE === openPopupName}
        onSave={onEditProfile}
        onClose={onClosePopup}
      />

      <PopupEditAvatar
        isOpen={POPUP_NAME.AVATAR === openPopupName}
        onSave={onEditAvatar}
        onClose={onClosePopup}
      />

      <PopupAddCard
        isOpen={POPUP_NAME.CARD === openPopupName}
        onSave={onCardAdd}
        onClose={onClosePopup}
      />

      <PopupWithImage
        card={selectedCard}
        isOpen={POPUP_NAME.PREVIEW === openPopupName}
        onClose={() => {
          onClosePopup();
          setSelectedCard({});
        }}
      />

      <PopupWithInfo
        isSuccess={lastOperationResult.isSuccess}
        message={lastOperationResult.message}
        isOpen={POPUP_NAME.INFO === openPopupName}
        onClose={onClosePopup}
      />
    </CurrentUserContext.Provider>
  );
};
