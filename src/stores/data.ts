import {writable, Writable} from 'svelte/store';

export const spatial:Writable<{
  [key: string]: {
    "values": {
      "local": number;
      "regional": number;
      "states": number;
      "federal": number;
    }
  }
}> = writable({});

export const ages:Writable<{
  "key":number;
  "label": string;
  "value":number;
}[][]> = writable([]);

export const marital:Writable<{
  [key: string]: {
   "value": number,
   "smallest": string[][]
  }
}> = writable({});

export const nationality:Writable<{
  [key: string]: {
   "value": number,
   "smallest": string[][]
  }
}> = writable({});

export const translations:Writable<{
  [key: string]: string
}> = writable({});

export const load = ():Promise<void[]> => {
  return Promise.all([
    fetch('/assets/data/spatial.json')
      .then((data) => {
        return data.json();
      })
      .then((json) => {
        spatial.set(json);
      }),
    fetch('/assets/data/ages.json')
      .then((data) => {
        return data.json();
      })
      .then((json) => {
        ages.set(json);
      }),
    fetch('/assets/data/marital.json')
      .then((data) => {
        return data.json();
      })
      .then((json) => {
        marital.set(json);
      }),
    fetch('/assets/data/nationality.json')
      .then((data) => {
        return data.json();
      })
      .then((json) => {
        nationality.set(json);
      }),
    fetch('/assets/data/translations.json')
      .then((data) => {
        return data.json();
      })
      .then((json) => {
        translations.set(json);
      }),
  ]);

};