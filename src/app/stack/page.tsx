import { stack } from "#content";
import { published } from "@/lib/collections";
import { StackCard } from "@/components/stack-card";

export default function StackPage() {
  const tools = published([...stack]);
  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="font-display text-3xl font-semibold tracking-tight">
          Stack
        </h1>
        <p className="mt-2 text-muted">Tools I use on a regular basis.</p>
      </header>
      <div className="grid gap-4 sm:grid-cols-2">
        {tools.map((tool) => (
          <StackCard key={tool.slug} tool={tool} />
        ))}
      </div>
    </div>
  );
}
