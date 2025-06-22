import Dexie, { Table } from 'dexie';

export interface Card {
  id?: number;
  title: string;
  content: string;
  gradient: string;
  createdAt: string;
  updatedAt: string;
}

export class CardDatabase extends Dexie {
  cards!: Table<Card>;

  constructor() {
    super('CardDatabase');
    this.version(1).stores({
      cards: '++id, title, content, gradient, createdAt, updatedAt'
    });
  }
}

export const db = new CardDatabase();