import { useContext } from 'react';
import cn from 'classnames';
import { CurrentUserContext } from '../contexts/CurrentUserContext';

const Card = ({
  card: sourceCard, onClick, onLike, onRemove,
}) => {
  const {
    name, link, likes, owner,
  } = sourceCard;
  const currentUser = useContext(CurrentUserContext);
  const card = {
    ...sourceCard,
    isOwner: (currentUser._id === owner._id),
    liked: likes.some((liker) => liker._id === currentUser._id),
  };

  return (
    <li className="card-item">
      <article className="card" aria-label={name}>
        <img
          src={link}
          alt={name}
          className="card__image"
          aria-hidden="true"
          onClick={() => onClick(card)}
        />
        <div className="card__info">
          <a
            href={link}
            className="card__link"
            target="_blank"
            rel="noreferrer"
          >
            {name}
          </a>
          <div className="card__like-container">
            <button
              type="button"
              className={cn('button', 'card__like', { card__like_liked: card.liked })}
              aria-label="Оценить"
              onClick={() => onLike(card)}
            />
            <span className="card__like-count">{likes.length}</span>
          </div>
        </div>
        {card.isOwner && (
        <button
          type="button"
          className="button card__remove"
          aria-label="Удалить"
          onClick={() => onRemove(card)}
        />
        )}
      </article>
    </li>
  );
};

export { Card };
