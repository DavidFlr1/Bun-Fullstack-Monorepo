import { useRouter, useParams } from "@bunext/core/router-context";

export default function DynamicPage() {
  const router = useRouter();
  const id = useParams("id");

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100 text-2xl">
      <h1 className="text-4xl font-bold text-blue-600">Dynamic Page</h1>
      <p className="mt-2">This is a dynamic page</p>

      <div className="mt-4 p-4 border rounded-lg bg-white">
        <h2 className="text-xl font-bold mb-2">Route Params:</h2>
        <p className="text-lg">
          ID: <span className="font-mono text-green-600">{id}</span>
        </p>
        <p className="text-sm mt-2">All params: {JSON.stringify(router.params)}</p>
      </div>

      <div className="mt-4 p-4 border rounded-lg bg-white">
        <h2 className="text-xl font-bold mb-2">Router Info:</h2>
        <p>Pathname: {router.pathname}</p>
        <p>Route: {router.route}</p>
        <p>Search: {router.search || "(none)"}</p>
      </div>

      <div className="mt-4 p-4 border rounded-lg bg-white">
        <h2 className="text-xl font-bold mb-2">Navigation:</h2>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => router.push("/")}
            className="px-4 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
          >
            Go to Home
          </button>
          <button
            onClick={() => router.push("/dynamic/456")}
            className="px-4 py-2 bg-green-500 text-white text-sm rounded hover:bg-green-600"
          >
            Go to /456
          </button>
          <button
            onClick={() => router.push(`/${id}?tab=settings&view=grid`)}
            className="px-4 py-2 bg-purple-500 text-white text-sm rounded hover:bg-purple-600"
          >
            Add Query Params
          </button>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-gray-500 text-white text-sm rounded hover:bg-gray-600"
          >
            ← Back
          </button>
        </div>
      </div>
    </main>
  );
}
