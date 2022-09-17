import React from 'react';
import cn from 'classnames';

const PopupWithForm = (props) => {
  const {
    name, title, submitText, isOpen,
    onSubmit,
    onClose,
    children,
  } = props;

  const popupClassName = cn(
    'popup',
    `popup_type_${name}`,
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
        <form action="/" name={name} onSubmit={onSubmit} className="popup__content form" noValidate>
          <h2 className="form__title">{title}</h2>
          {children}
          <button
            type="submit"
            name="submit"
            className="button form__submit"
          >
            {submitText}
          </button>
        </form>
      </div>
    </div>
  );
};

export { PopupWithForm };
