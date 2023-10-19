/// <reference lib="webworker" />

import { Observable, from, map, switchMap, toArray } from 'rxjs';
import { ajax } from "rxjs/internal/ajax/ajax";
import { Lang, Word, db } from '../services/database/db';
import {AjaxResponse} from "rxjs/internal/ajax/AjaxResponse";

/* */
addEventListener('message', ({ data }) => {
  populate().subscribe({
    next: (promiseResult) => {
      postMessage(`INFO worker inserting data`);
    },
    complete: () => postMessage(`INFO worker complete db insert`),
    error: (err) => postMessage(`ERROR from db worker ${err}`)
  })
});

function populate(): Observable<unknown> {
  const response$: Observable<AjaxResponse<string>> = ajax({
    url: 'http://localhost:4200/assets/dictionnaries/fr/ods6.txt',
    headers: {
      "Accept": "text"
    },
    responseType: "text"
  });

  return response$.pipe(
    switchMap(dic => from(dic.response.split(/\n/))),
    map(word => {
      return {
        lang: Lang.FR,
        value: word
      } as Word
    }),
    toArray(),
    switchMap((words) => from(db.words.bulkAdd(words)))
  )
}
/* */
