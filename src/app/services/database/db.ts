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

    populate() {
      console.log('populate')
    }
  }
  
  export const db = new DictionaryDB();