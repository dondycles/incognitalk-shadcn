import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="w-full h-[100dvh] flex flex-row">
      <div className="bg-foreground h-full p-4 w-2/3 hidden md:flex flex-col">
        <Button className="w-fit" variant={"secondary"} asChild>
          <Link href={"/"}>Home</Link>
        </Button>
        <div className="text-primary-foreground m-auto">
          <h1 className="text-6xl font-bold">incognitalk.</h1>
          <p>Reaveling the words anonimously.</p>
        </div>
      </div>
      {children}
    </main>
  );
}
