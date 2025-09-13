import { z } from "zod";

export const productCategories = ["Electronics", "Clothing", "Books", "Home Goods", "Groceries"] as const;

export const productSchema = z.object({
  id: z.string(),
  name: z.string().min(3, "Name must be at least 3 characters long."),
  category: z.enum(productCategories),
  price: z.coerce.number().positive("Price must be a positive number."),
  stock: z.coerce.number().int().min(0, "Stock cannot be negative."),
});

export type Product = z.infer<typeof productSchema>;
