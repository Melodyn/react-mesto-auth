import { PageWithForm } from './PageWithForm';
import { useForm } from '../../hooks/useForm';

const Login = (props) => {
  const {
    onSave,
  } = props;
  const [values, setValues, updateInitValues] = useForm({
    email: '',
    password: '',
  });

  const Tip = () => (
    <span className="tip tip_color_white">
      Ещё нет аккаунта? <a href="/" className="tip tip_color_white animation">
        Зарегистрироваться
      </a>
    </span>
  );

  const onLogin = (e) => {
    e.preventDefault();
    onSave(values);
    updateInitValues({
      email: '',
      password: '',
    });
  };

  return (
    <PageWithForm
      name="login"
      title="Вход"
      submitText="Войти"
      onSubmit={onLogin}
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

export { Login };
