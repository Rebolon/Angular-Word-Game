/// <reference lib="webworker" />

import { Observable, bufferCount, from, map, mergeMap, scan, switchMap, tap, toArray } from 'rxjs';
import { ajax } from "rxjs/internal/ajax/ajax";
import { Lang, Word, db } from '../services/database/db';
import { AjaxResponse } from "rxjs/internal/ajax/AjaxResponse";

/* */
addEventListener('message', ({ data }) => {
  populate().subscribe({
    complete: () => postMessage(`DB_POPULATED`),
    error: (err) => postMessage(`ERROR: ${err}`)
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
    tap(() => postMessage(`DB_IN_PROGRESS`)),
    /*bufferCount(50, 2),
    mergeMap((words) => from(db.words.bulkAdd(words[0]))),*/
    mergeMap((words) => from(db.words.bulkAdd(words))),
    /*scan((acc, value, index) => acc + value, 0),
    tap((value) => postMessage(`insert ${value}`)),*/
  )
}
/* */
