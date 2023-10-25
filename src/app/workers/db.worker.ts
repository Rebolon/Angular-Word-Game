/// <reference lib="webworker" />

import { Observable, bufferCount, combineLatestWith, count, distinct, filter, from, map, mergeMap, of, share, switchMap, take, tap } from 'rxjs';
import { ajax } from "rxjs/internal/ajax/ajax";
import { AjaxResponse } from "rxjs/internal/ajax/AjaxResponse";
import { liveQuery } from 'dexie';
import { Lang, Word, db } from '../services/database/db';
import { MESSAGES_REQUEST } from '../services/database/messages-request'
import { MESSAGES_RESPONSE } from '../services/database/messages-response'

/* */
const allowedMessages = [
  MESSAGES_REQUEST.GET_COUNTERS,
  MESSAGES_REQUEST.INIT_DB,
];

addEventListener('message', ({ data }) => {
  if (allowedMessages.find((value) => value === data) === undefined) {
    return postMessage(`${MESSAGES_RESPONSE.ERROR} LOGIC_ERROR: ${data}`);
  }

  // always calculate ratio and send info to main thread
  dictionnayCount$.pipe(
    combineLatestWith(databaseCount$),
  )
  .subscribe({
    next: (value) => {
      postMessage(`${MESSAGES_RESPONSE.DB_COUNTERS} ${value[1]} ${value[0]}`)
    },
    error: (err) => postMessage(`${MESSAGES_RESPONSE.ERROR} ${err}`)
  })

  dictionnayCount$.pipe(
    combineLatestWith(databaseCount$),
    map(([dictionnaryCount, databaseCount]) => calculatePercentage(dictionnaryCount, databaseCount))
  )
  .subscribe({
    next: (value) => {
      postMessage(`${MESSAGES_RESPONSE.DB_IN_PROGRESS} ${value} %`)
    },
    error: (err) => postMessage(`${MESSAGES_RESPONSE.ERROR} ${err}`)
  })

  if (data === MESSAGES_REQUEST.INIT_DB) {
    // first one is to load Data
    dictionnayCount$.pipe(
      combineLatestWith(databaseCount$),
      take(1), // to force stop , but i should use another iterator instead of combineLatestWith to prevent the usage of take(1)
      tap(([dictionnaryCount, databaseCount]) => console.log('combineLatestWith', databaseCount, dictionnaryCount)),
      switchMap(([dictionnaryCount, databaseCount]) => {
        // Won't it be called more than once ? yes it will :-( until they are different, it will call populate$ again and again
        // need to find another way but it's better
        if (databaseCount < dictionnaryCount) {
          postMessage(`${MESSAGES_RESPONSE.DB_START_POPULATE}`);
          return populate$(databaseCount).pipe(
            tap((progress) => postMessage(`${MESSAGES_RESPONSE.DB_IN_PROGRESS} ${progress} mots`))
          );
        } 
        return of(100)
      })
    )
    .subscribe({
      complete: () => postMessage(`${MESSAGES_RESPONSE.DB_POPULATED}`),
      error: (err) => postMessage(`${MESSAGES_RESPONSE.ERROR} ${err}`)
    })
  }
});

const response$: Observable<AjaxResponse<string>> = ajax({
  url: '/assets/dictionnaries/fr/ods6.txt',
  headers: {
    "Accept": "text"
  },
  responseType: "text"
});
const databaseCount$ = liveQuery(() => db.words.count());
const wordsInDictionnary$: Observable<Word> = response$.pipe(
  switchMap(dic => from(dic.response.split(/\n/))),
  distinct(),
  map((word) => {
    return {
      lang: Lang.FR,
      value: word
    } as Word
  }),
  share(),
);
const dictionnayCount$: Observable<number> = wordsInDictionnary$.pipe(
  count()
);
const populate$ = (startIndex = 0): Observable<number> => {
  return wordsInDictionnary$.pipe(
    filter((value, index) => index >= startIndex),
    bufferCount(50000),
    mergeMap((words) => from(db.words.bulkAdd(words))),
    tap(count => console.log('count', count))
  );
}
const calculatePercentage = (dictionnaryCount: number, databaseCount: number) => databaseCount ? (databaseCount / dictionnaryCount * 100).toFixed(0) : 0