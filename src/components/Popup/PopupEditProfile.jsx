import { useContext, useEffect } from 'react';
import { PopupWithForm } from './PopupWithForm';
import { enumPopupName } from '../../utils/constants';
import { CurrentUserContext } from '../../contexts/CurrentUserContext';
import { useForm } from '../../hooks/useForm';

const PopupEditProfile = (props) => {
  const {
    isOpen,
    onSave,
    onClose,
  } = props;
  const currentUser = useContext(CurrentUserContext);
  const [values, setValues, updateInitValues] = useForm(currentUser);

  useEffect(() => {
    updateInitValues(currentUser);
  }, [currentUser, isOpen]);

  return (
    <PopupWithForm
      name={enumPopupName.profile}
      title="Редактировать профиль"
      submitText="Сохранить"
      isOpen={isOpen}
      onSubmit={(e) => {
        e.preventDefault();
        onSave(values);
      }}
      onClose={onClose}
    >
      <fieldset className="form__items">
        <input
          type="text"
          name="name"
          className="form__item"
          placeholder="Название профиля"
          minLength="2"
          maxLength="40"
          tabIndex="1"
          value={values.name}
          required
          onChange={setValues}
        />
        <span className="form__item-error form__item-error_field_title" />
        <input
          type="text"
          name="about"
          className="form__item"
          placeholder="Описание профиля"
          minLength="2"
          maxLength="200"
          tabIndex="2"
          value={values.about}
          required
          onChange={setValues}
        />
        <span className="form__item-error form__item-error_field_subtitle" />
      </fieldset>
    </PopupWithForm>
  );
};

export { PopupEditProfile };
