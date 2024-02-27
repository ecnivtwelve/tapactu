import { getLocales } from 'expo-localization';

import fr from './lang/fr.json';
import en from './lang/en.json';

const locale = getLocales()[0].languageCode;

const t = (key) => {
  try {
    if (locale === 'fr' && fr[key]) return fr[key];
    
    return en[key];
  } catch (e) {
    return key;
  }
};

const getLocale = () => locale;

export default t;
export { getLocale };