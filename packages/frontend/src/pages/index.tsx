import { useGlobal } from "@/context/global-context";
import React from "react";

export default function Home() {
  const { test, setTest } = useGlobal();
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100 text-2xl">
      <h1 className="text-4xl font-bold text-blue-600">Hello from Bun + Tailwind!</h1>
      <p className="mt-2">This is the index route ✨</p>

      <p>{test}</p>
      <button
        onClick={() => {
          console.log("test");
          console.log(test);
          setTest("Hello from context!");
        }}
        className="p-2 border rounded-lg"
      >
        Set test
      </button>
    </main>
  );
}
