import React from 'react';

const PageWithForm = (props) => {
  const {
    name, title, submitText,
    onSubmit,
    children,
    Tip = null,
  } = props;

  return (
    <main className="content">
      <form
        action="/"
        name={name}
        onSubmit={onSubmit}
        className="form form_centered form_color_black form_full-height"
      >
        <div className="form__blocks-wrapper form_centered">
          <h2 className="title title_color_white">{title}</h2>
          {children}
        </div>
        <div className="form__blocks-wrapper form_centered">
          <button
            type="submit"
            name="submit"
            className="button button_color_white subtitle subtitle_color_black form__submit form__submit_theme_black"
          >
            {submitText}
          </button>
          {Tip && <Tip />}
        </div>
      </form>
    </main>
  );
};

export { PageWithForm };
