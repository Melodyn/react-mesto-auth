import { httpMethod } from './constants';

const processResponse = (res) => {
  if (res.ok) {
    return res.json();
  }

  return res
    .json()
    .then(({ message, error }) => {
      res.message = message || error || `Ошибка ${res.status}`;
      return Promise.reject(res);
    });
};

export class Api {
  constructor(config) {
    const {
      apiMestoBaseURL,
      apiMestoAuthURL,
      apiMestoCohort,
      apiMestoToken,
    } = config;
    this._config = config;

    this._fetch = (page, method = httpMethod.get, body = undefined) => fetch(
      `${apiMestoBaseURL}/${apiMestoCohort}/${page}`,
      {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: apiMestoToken,
        },
        body: (body && JSON.stringify(body)),
      },
    )
      .then(processResponse);

    this._auth = (page, method = httpMethod.get, body = undefined) => fetch(
      `${apiMestoAuthURL}/${page}`,
      {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(this._config.apiMestoAuthToken && {
            Authorization: `Bearer ${this._config.apiMestoAuthToken}`,
          }),
        },
        body: (body && JSON.stringify(body)),
      },
    )
      .then(processResponse);
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

  /* auth */
  setToken(token = '') {
    this._config.apiMestoAuthToken = token;
  }

  checkToken() {
    return this._auth('users/me');
  }

  login({ password, email }) {
    return this._auth('signin', httpMethod.post, { password, email });
  }

  register({ password, email }) {
    return this._auth('signup', httpMethod.post, { password, email });
  }
}
