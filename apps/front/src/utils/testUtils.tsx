import { render, RenderOptions } from "@testing-library/react";
import { ReactElement, ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "react-query";

export const queryClient = new QueryClient();

const DecoratedRender = ({
  children,
}: {
  children?: ReactNode;
}): ReactElement => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) => render(ui, { wrapper: DecoratedRender, ...options });

export * from "@testing-library/react";
export { customRender as render };
