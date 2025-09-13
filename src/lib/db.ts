import Dexie, { type Table } from 'dexie';
import { Product, productSchema } from './schema';
import { products as initialProducts } from './data';

export class MySubClassedDexie extends Dexie {
  products!: Table<Product>; 

  constructor() {
    super('dataForgeDB');
    this.version(1).stores({
      products: '++id, name, category, price, stock', // Primary key and indexed props
    });
  }

  async seed() {
    const count = await this.products.count();
    if (count === 0) {
      console.log("Seeding database with initial data...");
      try {
        // Validate initial data before adding
        const validatedProducts = initialProducts.filter(p => {
          const result = productSchema.safeParse(p);
          if (!result.success) {
            console.warn(`Invalid initial product data for ID ${p.id}:`, result.error.flatten());
          }
          return result.success;
        });
        await this.products.bulkAdd(validatedProducts);
        console.log(`Successfully seeded ${validatedProducts.length} products.`);
      } catch (error) {
        console.error("Error seeding database:", error);
      }
    }
  }
}

export const db = new MySubClassedDexie();
