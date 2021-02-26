import { addMessages, init, getLocaleFromNavigator } from 'svelte-i18n';

import en from '../../locales/en.json';
import de from '../../locales/de.json';

export const i18nSetup = () => {
  addMessages('en', en);
  addMessages('de', de);

  init({
    fallbackLocale: 'de',
    initialLocale: getLocaleFromNavigator(),
  });
};