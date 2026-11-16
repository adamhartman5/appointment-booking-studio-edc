import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/")({ component: Home })

function Home() {
  return <main><h1 className="text-3xl">Ready to build</h1></main>
}
