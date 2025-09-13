import Dexie, { type Table } from 'dexie';
import { Postcard, postcardSchema } from './schema';
import { postcards as initialPostcards } from './data';

export class MySubClassedDexie extends Dexie {
  postcards!: Table<Postcard>; 

  constructor() {
    super('dataForgeDB');
    this.version(1).stores({
      products: '++id, name, category, price, stock', // Primary key and indexed props
    });
    // Upgrade version to rename 'products' to 'postcards'
    this.version(2).stores({
      products: null, // Remove old table
      postcards: 'id, name, category, price, stock',
    });
  }

  async seed() {
    const count = await this.postcards.count();
    if (count === 0) {
      console.log("Seeding database with initial data...");
      try {
        // Validate initial data before adding
        const validatedPostcards = initialPostcards.filter(p => {
          const result = postcardSchema.safeParse(p);
          if (!result.success) {
            console.warn(`Invalid initial postcard data for ID ${p.id}:`, result.error.flatten());
          }
          return result.success;
        });
        await this.postcards.bulkAdd(validatedPostcards);
        console.log(`Successfully seeded ${validatedPostcards.length} postcards.`);
      } catch (error) {
        console.error("Error seeding database:", error);
      }
    }
  }
}

export const db = new MySubClassedDexie();
