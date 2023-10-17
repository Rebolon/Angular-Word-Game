import Dexie, { Table } from 'dexie';

export enum Lang {
    FR,
    EN,
}

export interface Word {
    lang: Lang;
    value: string;
}

export class DictionaryDB extends Dexie {
    words!: Table<Word, number>;
  
    constructor() {
      super('ngdexieliveQuery');
      this.version(3).stores({
        words: '++,fr,value',
      });
      this.on('populate', () => this.populate());
    }
  
    // @todo this should be done by a SharedWorker and only if there is no value in DB for the current lang (fr for instance)
    async populate() {
      /*await db.words.bulkAdd([
        {
          value: 'Feed the birds',
          lang: Lang.FR
        },
      ]);*/
    }
  }
  
  export const db = new DictionaryDB();