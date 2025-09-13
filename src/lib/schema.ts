import { z } from "zod";

export const postcardCategories = ["Travel", "Art", "Greeting", "Vintage", "Holiday"] as const;

export const postcardSchema = z.object({
  id: z.string(),
  name: z.string().min(3, "Name must be at least 3 characters long."),
  category: z.enum(postcardCategories),
  price: z.coerce.number().positive("Price must be a positive number."),
  stock: z.coerce.number().int().min(0, "Stock cannot be negative."),
  description: z.string().optional(),
});

export type Postcard = z.infer<typeof postcardSchema>;
