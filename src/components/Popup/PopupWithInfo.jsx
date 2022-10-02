import React from 'react';
import cn from 'classnames';
import successImage from '../../images/success.svg';
import failureImage from '../../images/failure.svg';

const PopupWithInfo = (props) => {
  const {
    isSuccess,
    message = 'ta-da!',
    isOpen,
    onClose,
  } = props;
  const image = isSuccess ? successImage : failureImage;

  const popupClassName = cn(
    'popup',
    'popup_type_info',
    { popup_opened: isOpen },
  );

  return (
    <div className={popupClassName}>
      <div className="popup__container popup__container_type_form">
        <button
          type="button"
          className="button popup__close"
          aria-label="Закрыть"
          onClick={onClose}
        />
        <div className="popup__content form form_centered form_gap">
          <img className="form__icon" src={image} alt={isSuccess ? 'Успешно' : 'Ошибка'} />
          <h2 className="title title_color_black title_centered">{message}</h2>
        </div>
      </div>
    </div>
  );
};

export { PopupWithInfo };
