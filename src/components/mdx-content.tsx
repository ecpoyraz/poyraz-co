import * as runtime from "react/jsx-runtime";
import { mdxComponents } from "@/components/mdx-ui";

const sharedComponents: Record<string, React.ComponentType<never>> = {
  ...(mdxComponents as Record<string, React.ComponentType<never>>),
};

function useMDXComponent(code: string) {
  const fn = new Function(code);
  return fn({ ...runtime }).default;
}

export function MDXContent({
  code,
  components,
}: {
  code: string;
  components?: Record<string, React.ComponentType>;
}) {
  const Component = useMDXComponent(code);
  // Velite's compiled MDX is built into a component here. This is a server component
  // with static generation, so there is no client re-render and identity churn is not
  // a concern. Content is trusted, repo-owned MDX compiled by Velite.
  // eslint-disable-next-line react-hooks/static-components
  return <Component components={{ ...sharedComponents, ...components }} />;
}
