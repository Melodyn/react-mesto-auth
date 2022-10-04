import '../vendor/normalize.css';
import '../blocks/index.css';
import { useEffect, useState } from 'react';
import { Api } from '../utils/Api';
import { apiConfig, enumPopupName } from '../utils/constants';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
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

const App = () => {
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
      message: err.message || `Что-то пошло не так${onAction ? ` ${onAction}`: ''}! Попробуйте ещё раз.`,
    });
    setOpenPopupName(enumPopupName.info);
  };

  useEffect(() => {
    apiMesto.setToken(currentUser.token);
    if (currentUser.token) {
      apiMesto.checkToken()
        .then((result) => {
          if (result && result.data) {
            return Promise
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

  const onOpenPopupEditProfile = () => {
    setOpenPopupName(enumPopupName.profile);
  };
  const onOpenPopupEditAvatar = () => {
    setOpenPopupName(enumPopupName.avatar);
  };
  const onOpenPopupCard = () => {
    setOpenPopupName(enumPopupName.card);
  };

  const onCardClick = (card) => {
    setSelectedCard(card);
    setOpenPopupName(enumPopupName.preview);
  };
  const onCardLike = (card) => {
    apiMesto
      .likeCard({ cardId: card._id, liked: card.liked })
      .then((updatedCard) => {
        const updatedCards = cards.map((crd) => ((crd._id === card._id) ? updatedCard : crd));
        updateCards(updatedCards);
      })
      .catch(showErrorInPopup());
  };
  const onCardRemove = (card) => {
    apiMesto
      .removeCard({ cardId: card._id })
      .then(() => {
        const updatedCards = cards.filter(({ _id }) => _id !== card._id);
        updateCards(updatedCards);
      })
      .catch(showErrorInPopup());
  };
  const onCardAdd = (data) => {
    apiMesto
      .createCard(data)
      .then((card) => {
        onClosePopup();
        updateCards([card, ...cards]);
      })
      .catch(showErrorInPopup());
  };

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

  const updateUser = (user) => {
    const updatedUser = {
      ...currentUser,
      ...user,
    };
    console.log({ currentUser, user, updatedUser });
    saveToken(updatedUser.token);
    setCurrentUser(updatedUser);
  };
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
          setOpenPopupName(enumPopupName.info);
          navigate('/signin');
        } else {
          showErrorInPopup('при регистрации');
        }
      })
      .catch(showErrorInPopup());
  };
  const onLogout = () => {
    updateUser({
      token: '',
    });
    navigate('/signin');
  };

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <Header onClickAuthButton={onLogout}/>

      <Routes>
        <Route
          path="/"
          element={
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
          }
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
        isOpen={enumPopupName.profile === openPopupName}
        onSave={onEditProfile}
        onClose={onClosePopup}
      />

      <PopupEditAvatar
        isOpen={enumPopupName.avatar === openPopupName}
        onSave={onEditAvatar}
        onClose={onClosePopup}
      />

      <PopupAddCard
        isOpen={enumPopupName.card === openPopupName}
        onSave={onCardAdd}
        onClose={onClosePopup}
      />

      <PopupWithImage
        card={selectedCard}
        isOpen={enumPopupName.preview === openPopupName}
        onClose={() => {
          onClosePopup();
          setSelectedCard({});
        }}
      />

      <PopupWithInfo
        {...lastOperationResult}
        isOpen={enumPopupName.info === openPopupName}
        onClose={onClosePopup}
      />
    </CurrentUserContext.Provider>
  );
};

export default App;
