import "./style.css";

import { setsApi, Api } from './scripts/api.js';
import { CardList, elementPlacesList } from './scripts/cardls.js';
import { setsPopup, Popup, Profile } from './scripts/popup.js';

const api = new Api(setsApi);

const cardList = new CardList(elementPlacesList);
api.getInitCards(cardList.render.bind(cardList));

const profile = new Profile();
api.getProfileData(profile.render.bind(profile));

const popupProfile = new Popup(setsPopup.Profile, api);
const popupPlace = new Popup(setsPopup.Place, api);
