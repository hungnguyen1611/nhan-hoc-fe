import { DataForgePage } from '@/components/data-forge/data-forge-page';
import { Header } from '@/components/header';
import { postcards } from '@/lib/data';
import { Toaster } from '@/components/ui/toaster';

export default function Home() {
  return (
    <div className="min-h-screen bg-background font-body">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <DataForgePage initialData={postcards} />
      </main>
      <Toaster />
    </div>
  );
}
