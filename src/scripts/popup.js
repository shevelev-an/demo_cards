import { Card, CardList } from './cardls.js';

export class Profile {
  constructor() {
    this.clProfName = document.querySelector('.user-info__name');
    this.clProfJob = document.querySelector('.user-info__job');
    this.clProfAvatar = document.querySelector('.user-info__photo');
  }

  render(json) {
    this.clProfName.textContent = json.name;
    this.clProfJob.textContent = json.about;
    this.clProfAvatar.style = `background-image: url(${json.avatar})`;
  }
}

const setsErrorsRu = {
  isRequired: "Это обязательное поле",
  wrongLength: "Должно быть от 2 до 30 символов",
  wrongUrl: "Здесь должна быть ссылка"
}

class ValidateElement {
  constructor(elemInput, setsErrorMsg, setsValidate) {
    this.elemInput = elemInput;
    this.elemError = document.querySelector(`#error-${this.elemInput.id}`);
    this.setsErrorMsg = setsErrorMsg;
    this.setsValidate = setsValidate;
  }

  getErrorMessage() {
    if (this.elemInput.value.length === 0) return this.setsErrorMsg.isRequired;
    if (this.elemInput.type === "url") {
      if (this.elemInput.validity.typeMismatch) return this.setsErrorMsg.wrongUrl;
    } else {
      if ((this.elemInput.value.length < 2) || (this.elemInput.value.length > 30))
        return this.setsErrorMsg.wrongLength;
    }
    return "";
  }

  isValid() {
    let errMsg = this.getErrorMessage();
    if (errMsg.length > 0) {
      this.elemError.textContent = errMsg;
      this.activateError(this.elemError);
      return false;
    }
    this.resetError(this.elemError);
    return true;
  }

  activateError() {
    this.elemError.classList.remove(this.setsValidate.clElemErrorHidden);
  }

  resetError() {
    this.elemError.classList.add(this.setsValidate.clElemErrorHidden);
    this.elemError.textContent = '';
  }
}

class ValidateInputs {
  constructor(setsValidate, setsErrorsRu) {
    this.setsValidate = setsValidate;
    this.formPopup = this.setsValidate.formPopup;
    this.buttonSubmit = this.formPopup.querySelector('.button');

    /* events */
    Array.from(this.formPopup.elements).forEach(function (item) {
      if ((item.type === "text") || (item.type === "url"))
        item.addEventListener('input', this.validate.bind(this));
    }.bind(this));
  }

  isValidateInputs() {
    let result = true;
    Array.from(this.formPopup.elements).forEach(function (item) {
      if ((item.type === "text") || (item.type === "url")) {
        const validateElement = new ValidateElement(item, setsErrorsRu, this.setsValidate);
        validateElement.resetError();
        if (!validateElement.isValid()) result = false;
      }
    }.bind(this));
    return result;
  }

  validate(event) {
    if (this.isValidateInputs()) {
      this.buttonSubmit.classList.remove(this.setsValidate.clSubmitDisabled);
      this.buttonSubmit.removeAttribute('disabled');
    } else {
      this.buttonSubmit.classList.add(this.setsValidate.clSubmitDisabled);
      this.buttonSubmit.setAttribute('disabled', true);
    };
  }
}

export const setsPopup = {
  Profile: {
    clWindow: '.popup-profile',
    clWinOpened: 'popup-profile_is-opened',
    clButtonOpen: '.user-info__button_control_profile',
    clButtonClose: '.popup-profile__close',
    clButtonSubmit: '.popup-profile__button',
    clSubmitDisabled: 'popup-profile__button_disabled',
    clElemErrorHidden: 'popup-profile__error-message_hidden',
    clName: '.user-info__name',
    clElem2: '.user-info__job',
    formPopup: document.forms.profile
  },

  Place: {
    clWindow: '.popup',
    clWinOpened: 'popup_is-opened',
    clButtonOpen: '.user-info__button_control_place',
    clButtonClose: '.popup__close',
    clButtonSubmit: '.popup__button',
    clSubmitDisabled: 'popup__button_disabled',
    clElemErrorHidden: 'popup__error-message_hidden',
    clName: '.user-info__name',
    clElem2: '.user-info__job',
    formPopup: document.forms.place
  },

  ImageViewer: {
    clWindow: '.popup-image',
    clWinOpened: 'popup-image_is-opened',
    clCardImage: '.place-card__image',
    clImageViewer: '.popup-image__image',
    clButtonClose: '.popup-image__close'
  }
}

export class ImageViewer {
  constructor(setsPopup, card) {
    this.setsPopup = setsPopup;
    this.card = card;

    this.popupWindow = document.querySelector(this.setsPopup.clWindow);
    this.cardImage = this.card.querySelector(this.setsPopup.clCardImage);
    this.imageViewer = this.popupWindow.querySelector(this.setsPopup.clImageViewer);
    this.buttonClose = this.popupWindow.querySelector(this.setsPopup.clButtonClose);

    /* events */
    this.cardImage.addEventListener('click', this.open.bind(this));
    this.buttonClose.addEventListener('click', this.close.bind(this));
    
    return this.imageViewer;
  }

  open(event) {
    this.imageViewer.style.backgroundImage = event.target.style.backgroundImage;
    this.popupWindow.classList.add(this.setsPopup.clWinOpened);
  }

  close(event) {
    event.preventDefault();
    this.popupWindow.classList.remove(this.setsPopup.clWinOpened);
  }
}

export class Popup {
  constructor(setsPopup, api) {
    this.setsPopup = setsPopup;
    this.api = api;

    this.popupWindow = document.querySelector(setsPopup.clWindow);
    this.clWinOpened = setsPopup.clWinOpened;

    this.elemName = document.querySelector(setsPopup.clName);
    this.elemElem2 = document.querySelector(setsPopup.clElem2);

    this.formPopup = setsPopup.formPopup;
    this.buttonOpen = document.querySelector(setsPopup.clButtonOpen);
    this.buttonClose = document.querySelector(setsPopup.clButtonClose);
    this.buttonSubmit = document.querySelector(setsPopup.clButtonSubmit);

    /* events */
    this.buttonOpen.addEventListener('click', this.open.bind(this));
    this.buttonClose.addEventListener('click', this.close.bind(this));
    this.formPopup.addEventListener('submit', this.submit.bind(this));
    this.validateInputs = new ValidateInputs(this.setsPopup, setsErrorsRu);
  }

  open() {
    let eventDisp = new Event('input');
    if (this.formPopup.classList.contains('popup-profile__form')) {
      this.formPopup.elements.name.value = this.elemName.textContent;
      this.formPopup.elements.job.value = this.elemElem2.textContent;
    } else {
      this.formPopup.elements.name.value = '';
      this.formPopup.elements.link.value = '';
    };
    this.formPopup.elements.name.dispatchEvent(eventDisp);
    this.popupWindow.classList.add(this.setsPopup.clWinOpened);
  }

  close(event) {
    event.preventDefault();
    this.popupWindow.classList.remove(this.setsPopup.clWinOpened);
  }

  err() {
    if (this.popupWindow.classList.contains(this.setsPopup.clWinOpened)) {
      this.popupWindow.classList.remove(this.setsPopup.clWinOpened);
    }
  }

  render(json) {
    if (this.formPopup.classList.contains('popup-profile__form')) {
      this.elemName.textContent = this.formPopup.elements.name.value;
      this.elemElem2.textContent = this.formPopup.elements.job.value;
      /* patch name, job */
      this.api.patchProfileData(this.formPopup.elements.name.value, this.formPopup.elements.job.value);
    };
    if (this.formPopup.classList.contains('popup__form')) {
      const card = new Card(this.formPopup.elements.name.value, this.formPopup.elements.link.value);
      const cardLS = new CardList(document.querySelector('.places-list'), []);
      cardLS.addCard(card);
      this.formPopup.reset();
    };
    this.popupWindow.classList.remove(this.setsPopup.clWinOpened);
  }

  submit(event) {
    event.preventDefault();
    this.api.getProfileData(this.render.bind(this), this.err.bind(this));
  }
}
