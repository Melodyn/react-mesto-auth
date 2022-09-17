import React from 'react';
import cn from 'classnames';

const PopupWithImage = (props) => {
  const {
    card,
    isOpen,
    onClose,
  } = props;

  const popupClassName = cn(
    'popup',
    'popup_type_preview',
    { popup_opened: isOpen },
  );

  return (
    <div className={popupClassName}>
      <div className="popup__container">
        <button
          type="button"
          className="button popup__close"
          tabIndex="1"
          aria-label="Закрыть"
          onClick={onClose}
        />
        <div className="popup__content popup-preview">
          <img src={card.link} alt={card.name} className="popup-preview__image" />
          <p className="popup-preview__text">{card.name}</p>
        </div>
      </div>
    </div>
  );
};

export { PopupWithImage };
