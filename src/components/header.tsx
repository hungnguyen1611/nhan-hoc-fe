import { Database } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-30 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center">
        <div className="flex items-center gap-3">
            <Database className="h-7 w-7 text-primary" />
            <h1 className="text-2xl font-bold text-foreground font-headline">Data Forge</h1>
        </div>
      </div>
    </header>
  );
}
