import { useGlobal } from "@/context/global-context";
import { useRouter, useSearchParams } from "@bunext/core/router-context";

export default function Home() {
  const { test, setTest } = useGlobal();
  const router = useRouter();
  const searchParams = useSearchParams();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100 text-2xl">
      <h1 className="text-4xl font-bold text-blue-600">Hello from Bun + React + Tailwind!</h1>
      <p className="text-base font-bold text-green-600">
        This repo focus into take the performance capabilities of bun, 
        work with react and take the routing capabilities of nextjs.
      </p>
      <p className="mt-2">This is the index route ✨</p>

      <div className="mt-4 p-4 border rounded-lg bg-white">
        <h2 className="text-xl font-bold mb-2">Router Info:</h2>
        <p>Pathname: {router.pathname}</p>
        <p>Route: {router.route}</p>
        <p>Search: {router.search || "(none)"}</p>
        <p>Query Params: {JSON.stringify(searchParams)}</p>
      </div>

      <div className="mt-4 p-4 border rounded-lg bg-white">
        <h2 className="text-xl font-bold mb-2">Navigation:</h2>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => router.push("/dynamic/123")}
            className="px-4 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
          >
            Go to /123
          </button>
          <button
            onClick={() => router.push("/?search=test&filter=active")}
            className="px-4 py-2 bg-green-500 text-white text-sm rounded hover:bg-green-600"
          >
            Add Query Params
          </button>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-gray-500 text-white text-sm rounded hover:bg-gray-600"
          >
            ← Back
          </button>
          <button
            onClick={() => router.forward()}
            className="px-4 py-2 bg-gray-500 text-white text-sm rounded hover:bg-gray-600"
          >
            Forward →
          </button>
          <button
            onClick={() => router.refresh()}
            className="px-4 py-2 bg-purple-500 text-white text-sm rounded hover:bg-purple-600"
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      <div className="mt-4 p-4 border rounded-lg bg-white">
        <h2 className="text-xl font-bold mb-2">Global State Test:</h2>
        <p>Global State: {test || "(empty)"}</p>
        <button
          onClick={() => {
            console.log("Button clicked!");
            console.log("Current test value:", test);
            setTest("Hello from context!");
          }}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Set test
        </button>
      </div>
    </main>
  );
}
