import { Link } from 'react-router-dom';
import { PageWithForm } from './PageWithForm';
import { useForm } from '../../hooks/useForm';

const Register = (props) => {
  const {
    onSave,
  } = props;
  const [values, setValues] = useForm({
    email: '',
    password: '',
  });

  const Tip = () => (
    <span className="tip tip_color_white">
      Уже зарегистрированы? <Link to="/signin"  className="tip tip_color_white animation">
        Войти
      </Link>
    </span>
  );

  const onRegister = (e) => {
    e.preventDefault();
    onSave(values);
  };

  return (
    <PageWithForm
      name="register"
      title="Регистрация"
      submitText="Зарегистрироваться"
      onSubmit={onRegister}
      Tip={Tip}
    >
      <fieldset className="form__items">
        <input
          type="email"
          name="email"
          className="form__item form__item_theme_black"
          placeholder="Email"
          value={values.email}
          required
          onChange={setValues}
        />
        <span className="form__item-error form__item-error_field_title" />
        <input
          type="password"
          name="password"
          className="form__item form__item_theme_black"
          placeholder="Пароль"
          minLength="2"
          maxLength="200"
          value={values.password}
          required
          onChange={setValues}
        />
        <span className="form__item-error form__item-error_field_subtitle" />
      </fieldset>
    </PageWithForm>
  );
};

export { Register };
