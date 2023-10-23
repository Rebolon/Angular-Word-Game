/// <reference lib="webworker" />

import { Observable, bufferCount, combineLatestWith, count, distinct, from, map, mergeMap, of, share, switchMap, take, tap } from 'rxjs';
import { ajax } from "rxjs/internal/ajax/ajax";
import { AjaxResponse } from "rxjs/internal/ajax/AjaxResponse";
import { liveQuery } from 'dexie';
import { Lang, Word, db } from '../services/database/db';

/* */
addEventListener('message', ({ data }) => {
  if (data !== 'init-db') {
    return postMessage('ERROR: LOGIC_ERROR');
  }

  // first one is to load Data
  dictionnayCount$.pipe(
    combineLatestWith(databaseCount$),
    take(1), // to force stop , but i should use another iterator instead of combineLatestWith to prevent the usage of take(1)
    tap(([databaseCount, dictionnaryCount]) => console.log('combineLatestWith', databaseCount, dictionnaryCount)),
    switchMap(([databaseCount, dictionnaryCount]) => {
      // Won't it be called more than once ? yes it will :-( until they are different, it will call populate$ again and again
      // need to find another way but it's better
      if (databaseCount !== dictionnaryCount) {
        return populate$;
      } 
      return of(databaseCount)
    })
  )
  .subscribe({
    next: (value) => postMessage(`DB_IN_PROGRESS ${value}`),
    complete: () => postMessage(`DB_POPULATED`),
    error: (err) => postMessage(`ERROR: ${err}`)
  })

  // second to calculate ratio
  dictionnayCount$.pipe(
    combineLatestWith(databaseCount$),
    tap(([databaseCount, dictionnaryCount]) => console.log('combineLatestWith', databaseCount, dictionnaryCount)),
    map(([databaseCount, dictionnaryCount]) => databaseCount / dictionnaryCount * 100)
  )
  .subscribe({
    next: (value) => postMessage(`DB_IN_PROGRESS ${value}`),
    complete: () => postMessage(`DB_POPULATED`),
    error: (err) => postMessage(`ERROR: ${err}`)
  })
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
const populate$: Observable<unknown> =
  /* Beuh j'ai plein de toast Chargement de donnée ... Why ?*/
  wordsInDictionnary$.pipe(
    tap(() => postMessage(`DB_START_POPULATE`)),
    bufferCount(50),
    mergeMap((words) => from(db.words.bulkAdd(words))
      .pipe(
        tap(count => console.log('count', count))
      )
    ),
    /*tap(totalInserted => console.log(totalInserted)),
    mergeMap((totalInserted) => dictionnayCount$
      .pipe(
        map((total) => totalInserted / total * 100),
        tap(percent => console.log('percent', percent))
      )
    )*/
  )
/* */
