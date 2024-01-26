import { Button } from "@/components/ui/button";
import { VenetianMask } from "lucide-react";
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
      <div className="mix-blend-difference pointer-events-none z-10 absolute top-0 left-0 w-full h-full  grid grid-cols-3 grid-rows-3 overflow-hidden">
        <VenetianMask className="h-full w-full aspect-square -rotate-45  row-start-1 col-start-1 scale-[250%]" />
        <VenetianMask className="row-start-2 col-start-2 m-auto h-full w-full aspect-square -rotate-45 scale-[250%]" />
        <VenetianMask className=" row-start-3 col-start-3 m-auto h-full w-full aspect-square -rotate-45 scale-[250%]" />
      </div>
    </main>
  );
}
