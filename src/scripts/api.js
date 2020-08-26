export const setsApi = {
  baseUrl: NODE_ENV === 'development' ? 'https://radiant-dawn-74994.herokuapp.com/quers' : 'https://radiant-dawn-74994.herokuapp.com/quers',
  
  suffUserUrl: '/users/main',
  suffCardsUrl: '/cards',
  headersGet: {
  },
  methodPatch: 'PATCH',
  headersPatch: {
    'Content-Type': 'application/json'
  },
  prefErr: 'У Вас проблема!\nОшибка сети: ',
  suffErr: '\nПопробуйте обновить страницу, проверьте интернет-соединение!\nВнимание! Введенные данные сохранены не будут!'
}

export class Api {
  constructor(setsApi) {
    this.setsApi = setsApi;
    console.log(this.setsApi.baseUrl);
  }

  getPromise(suffUrl) {
    return fetch(this.setsApi.baseUrl + suffUrl, {
      headers: this.setsApi.headersGet
    });
  }

  getInitCards(funcRender) {
    this.getPromise(this.setsApi.suffCardsUrl)
      .then(res => {
        if (res.ok) {
          return res.json();
        }
        return Promise.reject(res.status);
      })
      .then(result => {
        funcRender(result);
        return result;
      })
      .catch(err => {
        alert(this.setsApi.prefErr + err + this.setsApi.suffErr);
      });
  }

  getProfileData(funcRender, funcErr) {
    this.getPromise(this.setsApi.suffUserUrl)
      .then(res => {
        if (res.ok) {
          return res.json();
        }
        return Promise.reject(res.status);
      })
      .then(result => {
        funcRender(result);
        return result;
      })
      .catch(err => {
        funcErr();
        alert(this.setsApi.prefErr + err + this.setsApi.suffErr);
      });
  }

  patchPromise(suffUrl, profName, profJob) {
    return fetch(this.setsApi.baseUrl + suffUrl, {
      method: this.setsApi.methodPatch,
      headers: this.setsApi.headersPatch,
      body: JSON.stringify({
        name: profName,
        about: profJob
      })
    });
  }

  patchProfileData(profName, profJob) {
    this.patchPromise(this.setsApi.suffUserUrl, profName, profJob)
      .then(res => {
        if (res.ok) {
          return res.json();
        }
        return Promise.reject(res.status);
      })
      .then((result) => {
        return result;
      })
      .catch((err) => {
        alert(this.setsApi.prefErr + err + this.setsApi.suffErr);
      });
  }
}
