import { httpMethod } from './constants';

export class Api {
  constructor(config) {
    const {
      apiMestoBaseURL,
      apiMestoCohort,
      apiMestoToken,
    } = config;
    const baseHeaders = {
      Authorization: apiMestoToken,
      'Content-Type': 'application/json; charset=utf-8',
    };

    this._fetch = (page, method = httpMethod.get, body = undefined) => fetch(
      `${apiMestoBaseURL}/${apiMestoCohort}/${page}`,
      {
        method,
        headers: baseHeaders,
        body: (body && JSON.stringify(body)),
      },
    )
      .then((res) => {
        if (res.ok) {
          return res.json();
        }

        return res
          .json()
          .then(({ message }) => {
            res.message = message || `Ошибка ${res.status}`;
            return Promise.reject(res);
          });
      });
  }

  /* profile */
  getProfile() {
    return this._fetch('users/me');
  }

  setAvatar({ avatar }) {
    return this._fetch('users/me/avatar', httpMethod.patch, { avatar });
  }

  setInfo({ name, about }) {
    return this._fetch('users/me', httpMethod.patch, { name, about });
  }

  /* card */
  getCards() {
    return this._fetch('cards');
  }

  createCard({ name, link }) {
    return this._fetch('cards', httpMethod.post, { name, link });
  }

  removeCard({ cardId }) {
    return this._fetch(`cards/${cardId}`, httpMethod.delete);
  }

  likeCard({ cardId, liked }) {
    if (liked) {
      return this.removeLikeCard({ cardId });
    }
    return this.addLikeCard({ cardId });
  }

  addLikeCard({ cardId }) {
    return this._fetch(`cards/like/${cardId}`, httpMethod.put);
  }

  removeLikeCard({ cardId }) {
    return this._fetch(`cards/like/${cardId}`, httpMethod.delete);
  }
}
