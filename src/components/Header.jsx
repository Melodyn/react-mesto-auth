import { useContext } from 'react';
import cn from 'classnames';
import { CurrentUserContext } from '../contexts/CurrentUserContext';

const Header = ({ onClickAuthButton }) => {
  const currentUser = useContext(CurrentUserContext);
  const buttonClassName = cn('subtitle', {
    subtitle_color_gray: currentUser.isAuth,
    subtitle_color_white: !currentUser.isAuth,
  });
  const buttonText = currentUser.isAuth ? 'Выйти' : 'Войти';

  return (
    <header className="header">
      <div className="header__container">
        <a href="#" className="logo" aria-label="Логотип" />
        <nav className="navigation">
          {
            (currentUser.isAuth && currentUser.email !== '')
            && (
              <span className="subtitle subtitle_color_white navigation__user-email">
                {currentUser.email}
              </span>
            )
          }
          <a href="#" className={buttonClassName} onClick={onClickAuthButton}>{buttonText}</a>
        </nav>
      </div>
    </header>
  );
};

export { Header };
