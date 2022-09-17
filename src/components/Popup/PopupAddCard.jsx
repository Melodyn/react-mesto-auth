import { useEffect } from 'react';
import { PopupWithForm } from './PopupWithForm';
import { enumPopupName } from '../../utils/constants';
import { useForm } from '../../hooks/useForm';

const PopupAddCard = (props) => {
  const {
    isOpen,
    onSave,
    onClose,
  } = props;
  const [values, setValues, updateInitValues] = useForm({ name: '', link: '' });

  useEffect(() => {
    updateInitValues({ name: '', link: '' });
  }, [isOpen]);

  return (
    <PopupWithForm
      name={enumPopupName.card}
      title="Новое место"
      submitText="Создать"
      onSubmit={(e) => {
        e.preventDefault();
        onSave(values);
      }}
      isOpen={isOpen}
      onClose={onClose}
    >
      <fieldset className="form__items">
        <input
          type="text"
          name="name"
          className="form__item"
          placeholder="Название"
          tabIndex="1"
          minLength="2"
          maxLength="30"
          value={values.name}
          required
          onChange={setValues}
        />
        <span className="form__item-error form__item-error_field_name" />
        <input
          type="url"
          name="link"
          className="form__item"
          placeholder="Ссылка на картинку"
          tabIndex="2"
          value={values.link}
          required
          onChange={setValues}
        />
        <span className="form__item-error form__item-error_field_link" />
      </fieldset>
    </PopupWithForm>
  );
};

export { PopupAddCard };
