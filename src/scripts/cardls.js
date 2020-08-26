import { setsPopup, ImageViewer } from './popup.js';

export class Card {
  constructor(name, url) {
    this.card = this.create(name, url);

    /* envents */
    this.card
      .querySelector('.place-card__like-icon')
      .addEventListener('click', this.like);
    this.card
      .querySelector('.place-card__delete-icon')
      .addEventListener('click', this.remove);
      
    return this.card;
  }

  create(name, url) {
    const placeCard = document.createElement('div');
    placeCard.classList.add('place-card');

    const placeImage = document.createElement('div');
    placeImage.classList.add('place-card__image');
    placeImage.style = `background-image: url(${url})`;

    const deletePlaceButton = document.createElement('button');
    deletePlaceButton.classList.add('place-card__delete-icon');
    placeImage.appendChild(deletePlaceButton);

    const placeDescr = document.createElement('div');
    placeDescr.classList.add('place-card__description');

    const namePlace = document.createElement('h3');
    namePlace.classList.add('place-card__name');
    namePlace.textContent = name;

    const likePlaceButton = document.createElement('button');
    likePlaceButton.classList.add('place-card__like-icon');

    placeDescr.appendChild(namePlace);
    placeDescr.appendChild(likePlaceButton);

    placeCard.appendChild(placeImage);
    placeCard.appendChild(placeDescr);

    return placeCard;
  }

  like(event) {
    event.target.classList.toggle('place-card__like-icon_liked');
  }

  remove(event) {
    event.stopPropagation();
    document.querySelector('.places-list')
      .removeChild(event.target.parentElement.parentElement);
  }
}

export class CardList {
  constructor(cardList) {
    this.cardList = cardList;
  }

  addCard(card) {
    const imageViewer = new ImageViewer(setsPopup.ImageViewer, card);
    this.cardList.appendChild(card);
  }

  render(cardArrInit) {
    cardArrInit.forEach(function (item) {
      const card = new Card(item.name, item.link);
      this.addCard(card);
    }.bind(this));
  }
}

export const elementPlacesList = document.querySelector('.places-list');
