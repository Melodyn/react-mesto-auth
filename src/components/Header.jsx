import { useContext } from 'react';
import cn from 'classnames';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import { useLocation, Link } from 'react-router-dom';

const Header = ({ onClickAuthButton }) => {
  const location = useLocation();
  const currentUser = useContext(CurrentUserContext);
  const buttonClassName = cn('button', 'subtitle', 'animation', {
    subtitle_color_gray: currentUser.isAuth(),
    subtitle_color_white: !currentUser.isAuth(),
  });
  const isSignInLocation = location.pathname.includes('signin');
  const buttonEnterText = isSignInLocation ? 'Регистрация' : 'Вход';
  const buttonText = currentUser.isAuth() ? 'Выход' : buttonEnterText;
  const onLogout = (e) => {
    e.preventDefault();
    onClickAuthButton();
  };

  const buttonElement = currentUser.isAuth()
    ? (
        <button type="button" className={buttonClassName} onClick={onLogout}>
          {buttonText}
        </button>
      )
    : (
        <Link to={isSignInLocation ? '/signup' : '/signin'} className={buttonClassName}>
          {buttonText}
        </Link>
      );

  return (
    <header className="header">
      <div className="header__container">
        <Link to="/" className="logo" aria-label="Логотип" />
        <nav className="navigation">
          {
            (currentUser.isAuth() && currentUser.email !== '')
            && (
              <span className="subtitle subtitle_color_white navigation__user-email">
                {currentUser.email}
              </span>
            )
          }
          {buttonElement}
        </nav>
      </div>
    </header>
  );
};

export { Header };
