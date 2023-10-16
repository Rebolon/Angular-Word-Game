/// <reference lib="webworker" />

import { HttpClient, HttpClientModule, HttpHeaders, HttpXhrBackend } from '@angular/common/http';
import { Observable, from, map, switchMap, toArray } from 'rxjs';
import { Lang, Word, db } from './services/database/db';

addEventListener('message', ({ data }) => {
  populate().subscribe((promiseResult) => {
    console.log('insert result', promiseResult);
    postMessage(`worker response to ${data}`);
  })
});

function populate(): Observable<unknown> {
  const httpClient = new HttpClient(new HttpXhrBackend({ 
    build: () => new XMLHttpRequest() 
  }));
  
  return httpClient.get('/assets/dictionnaries/fr/ods6.txt', {
    headers: new HttpHeaders({
       'Accept':'text'
    }),
    'responseType': 'text'
  }).pipe(
    switchMap(dic => from(dic.split(/\n/))),
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
