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
    const initialDataIds = initialPostcards.map(p => p.id);
    const dbIds = (await this.postcards.toCollection().keys()).map(String);
    
    // Check if the IDs in the DB match the initial data IDs. If not, re-seed.
    const isMismatched = initialDataIds.length !== dbIds.length || !initialDataIds.every(id => dbIds.includes(id));

    if (count === 0 || isMismatched) {
      console.log("Seeding or re-seeding database with initial data...");
      try {
        // Clear existing data before seeding to ensure a fresh start
        await this.postcards.clear();

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
