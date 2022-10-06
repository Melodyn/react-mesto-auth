import { useRef } from 'react';
import { PopupWithForm } from './PopupWithForm';
import { POPUP_NAME } from '../../utils/constants';

const PopupEditAvatar = (props) => {
  const {
    isOpen,
    onSave,
    onClose,
  } = props;
  const avatarRef = useRef(null);

  return (
    <PopupWithForm
      name={POPUP_NAME.AVATAR}
      title="Обновить аватар"
      submitText="Сохранить"
      isOpen={isOpen}
      onSubmit={(e) => {
        e.preventDefault();
        onSave({ avatar: avatarRef.current.value });
      }}
      onClose={onClose}
    >
      <fieldset className="form__items">
        <input
          type="url"
          name="avatar"
          className="form__item"
          placeholder="Ссылка на изображение"
          minLength="2"
          maxLength="200"
          ref={avatarRef}
          required
        />
        <span className="form__item-error form__item-error_field_avatar" />
      </fieldset>
    </PopupWithForm>
  );
};

export { PopupEditAvatar };
