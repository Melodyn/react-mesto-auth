import { useContext } from 'react';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import { Card } from './Card';

const Main = (props) => {
  const {
    cards,
    onEditProfile,
    onAddCard,
    onEditAvatar,
    onCardClick,
    onCardLike,
    onCardRemove,
  } = props;
  const currentUser = useContext(CurrentUserContext);

  const cardComponents = cards.map((card) => (
    <Card
      key={card._id}
      card={card}
      onClick={onCardClick}
      onLike={onCardLike}
      onRemove={onCardRemove}
    />
  ));

  return (
    <main className="content">
      <section className="profile" aria-label="Описание блога">
        <div className="profile__avatar-container">
          <img
            src={currentUser.avatar}
            alt="Аватар блога"
            className="profile__avatar"
          />
          <div
            className="profile__avatar-overlay"
            role="button"
            aria-label="Обновить аватар"
            aria-hidden="true"
            tabIndex={0}
            onClick={onEditAvatar}
          />
        </div>
        <h1 className="profile__title">{currentUser.name}</h1>
        <button
          type="button"
          className="button profile__edit"
          aria-label="Редактировать"
          onClick={onEditProfile}
        />
        <p className="profile__subtitle">{currentUser.about}</p>
        <button
          type="button"
          className="button profile__add-card"
          aria-label="Добавить место"
          onClick={onAddCard}
        />
      </section>

      <section className="cards" aria-label="Красивые картинки">
        <ul className="cards__list">{cardComponents}</ul>
      </section>
    </main>
  );
};

export { Main };
