import type { Postcard } from "./schema";

export const postcards: Postcard[] = [
  // Travel: 5
  { id: "a1b2c3d4", name: "Greetings from Paris", category: "Travel", price: 1.99, stock: 150, description: "A beautiful postcard showing the Eiffel Tower at sunset." },
  { id: "f6a7b8c9", name: "Tokyo Tower", category: "Travel", price: 1.99, stock: 180, description: "A stunning view of the Tokyo Tower illuminated at night." },
  { id: "e1f2a3b4", name: "Grand Canyon", category: "Travel", price: 1.99, stock: 220, description: "A breathtaking shot of the Grand Canyon at sunrise." },
  { id: "a2b3c4d5", name: "Roman Colosseum", category: "Travel", price: 1.99, stock: 190, description: "A majestic view of the ancient Roman Colosseum." },
  { id: "travel-new-1", name: "Machu Picchu Wonder", category: "Travel", price: 2.29, stock: 130, description: "The ancient Incan city high in the Andes Mountains." },

  // Art: 4
  { id: "b2c3d4e5", name: "Starry Night by Van Gogh", category: "Art", price: 2.49, stock: 200, description: "A high-quality print of the famous painting by Vincent van Gogh." },
  { id: "a7b8c9d0", name: "The Kiss by Klimt", category: "Art", price: 2.49, stock: 120, description: "A print of Gustav Klimt's iconic Art Nouveau painting." },
  { id: "f2a3b4c5", name: "Mona Lisa by da Vinci", category: "Art", price: 2.49, stock: 300, description: "The world-famous portrait by Leonardo da Vinci." },
  { id: "b3c4d5e6", name: "The Persistence of Memory", category: "Art", price: 2.49, stock: 110, description: "A print of Salvador Dalí's surrealist masterpiece." },
  
  // Greeting: 3
  { id: "c3d4e5f6", name: "Happy Birthday!", category: "Greeting", price: 3.99, stock: 500, description: "A cheerful birthday card with a colorful design." },
  { id: "b8c9d0e1", name: "Thank You Card", category: "Greeting", price: 2.99, stock: 400, description: "An elegant card to express your gratitude." },
  { id: "a3b4c5d6", name: "Congratulations!", category: "Greeting", price: 3.99, stock: 180, description: "A celebratory card for achievements and special occasions." },
  
  // Vintage: 2
  { id: "d4e5f6a7", name: "Vintage Route 66", category: "Vintage", price: 4.99, stock: 75, description: "A retro-style postcard featuring a classic American diner on Route 66." },
  { id: "c9d0e1f2", name: "1920s Flapper", category: "Vintage", price: 4.99, stock: 90, description: "A stylish black and white photo of a flapper from the Roaring Twenties." },

  // Holiday: 6
  { id: "e5f6a7b8", name: "Merry Christmas", category: "Holiday", price: 3.49, stock: 300, description: "A festive postcard with a snowman and a snowy landscape." },
  { id: "d0e1f2a3", name: "Happy Halloween", category: "Holiday", price: 3.49, stock: 250, description: "A spooky and fun Halloween postcard with pumpkins and ghosts." },
  { id: "c5d6e7f8", name: "Happy New Year", category: "Holiday", price: 3.49, stock: 350, description: "A festive postcard with fireworks to celebrate the New Year." },
  { id: "e6f7a8b9", name: "Happy Thanksgiving", category: "Holiday", price: 3.49, stock: 280, description: "A warm and inviting postcard for Thanksgiving." },
  { id: "holiday-new-1", name: "Happy Easter", category: "Holiday", price: 3.29, stock: 200, description: "A cute postcard with Easter eggs and bunnies." },
  { id: "holiday-new-2", name: "Happy Valentine's Day", category: "Holiday", price: 3.79, stock: 320, description: "A romantic postcard for your special someone." },
];
