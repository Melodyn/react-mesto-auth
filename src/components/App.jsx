import '../vendor/normalize.css';
import '../blocks/index.css';
import { useEffect, useState } from 'react';
import { Api } from '../utils/Api';
import { apiConfig, dataJSON, enumPopupName } from '../utils/constants';
import { Routes, Route, useNavigation } from 'react-router-dom';
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
// contexts
import { defaultCurrentUser, CurrentUserContext } from '../contexts/CurrentUserContext';

const App = () => {
  const apiMesto = new Api(apiConfig);
  const [openPopupName, setOpenPopupName] = useState('');
  const [selectedCard, setSelectedCard] = useState({});
  const [lastOperationResult, setLastOperationResult] = useState({
    isSuccess: true,
    message: 'Успешно',
  });
  const [currentUser, setCurrentUser] = useState(defaultCurrentUser);
  const [cards, updateCards] = useState(dataJSON.places.slice().reverse());

  useEffect(() => {
    // Promise
    //   .all([
    //     apiMesto.getCards(),
    //     apiMesto.getProfile(),
    //   ])
    //   .then(([initCards, user]) => {
    //     updateCards(initCards.slice().reverse());
    //     setCurrentUser(user);
    //   })
    //   .catch(console.error);

    const savedUserJSON = localStorage.getItem('user') || '{}';
    const savedUser = JSON.parse(savedUserJSON);
    if (savedUser && savedUser.token) {
      setCurrentUser(savedUser);
    }
  }, []);

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
      .catch(console.error);
  };
  const onCardRemove = (card) => {
    apiMesto
      .removeCard({ cardId: card._id })
      .then(() => {
        const updatedCards = cards.filter(({ _id }) => _id !== card._id);
        updateCards(updatedCards);
      })
      .catch(console.error);
  };
  const onCardAdd = (data) => {
    apiMesto
      .createCard(data)
      .then((card) => {
        onClosePopup();
        updateCards([card, ...cards]);
      })
      .catch(console.error);
  };

  const onEditProfile = (updatedInfo) => {
    apiMesto
      .setInfo(updatedInfo)
      .then((updatedUser) => {
        onClosePopup();
        setCurrentUser(updatedUser);
      })
      .catch(console.error);
  };
  const onEditAvatar = (updatedInfo) => {
    apiMesto
      .setAvatar(updatedInfo)
      .then((updatedUser) => {
        onClosePopup();
        setCurrentUser(updatedUser);
      })
      .catch(console.error);
  };

  const updateUser = (user) => {
    const updatedUser = {
      ...currentUser,
      ...user,
    };
    if (user.isAuth) {
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } else {
      localStorage.removeItem('user');
    }
    setCurrentUser(updatedUser);
  };
  const onLogin = (user) => {
    user.token = 'token';
    user.isAuth = true;
    updateUser(user);
  };
  const onRegister = (user) => {
    user.token = 'token';
    user.isAuth = true;
    updateUser(user);
    setLastOperationResult({
      isSuccess: true,
      message: 'Вы успешно зарегистрировались!',
    });
    setOpenPopupName(enumPopupName.info);
  };
  const onLogout = () => {
    updateUser({
      token: '',
      isAuth: false,
    });
  };

  const Comp = () => {
    const navigation = useNavigation();
    console.log('navigation', navigation);
    return (
      <h1>Hello World</h1>
    );
  };

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <Header onClickAuthButton={currentUser.isAuth ? onLogout : () => {}}/>

      <Routes>
        <Route
          path="*"
          component={<Comp />}
        />
        {/*<Route*/}
          {/*path="/"*/}
          {/*component={*/}
            {/*<ProtectedRoute>*/}
              {/*<Main*/}
                {/*cards={cards}*/}
                {/*onEditProfile={onOpenPopupEditProfile}*/}
                {/*onAddCard={onOpenPopupCard}*/}
                {/*onEditAvatar={onOpenPopupEditAvatar}*/}
                {/*onCardClick={onCardClick}*/}
                {/*onCardLike={onCardLike}*/}
                {/*onCardRemove={onCardRemove}*/}
              {/*/>*/}
            {/*</ProtectedRoute>*/}
          {/*}*/}
        {/*/>*/}

        {/*<Route*/}
          {/*path="/sign-in"*/}
          {/*component={*/}
            {/*<Login*/}
              {/*onSave={onLogin}*/}
            {/*/>*/}
          {/*}*/}
        {/*/>*/}

        {/*<Route*/}
          {/*path="/sign-up"*/}
          {/*component={*/}
            {/*<Register*/}
              {/*onSave={onRegister}*/}
            {/*/>*/}
          {/*}*/}
        {/*/>*/}
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
