import { render, RenderOptions } from "@testing-library/react";
import { ReactElement, ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

export const queryClient = new QueryClient();

const DecoratedRender = ({
  children,
}: {
  children?: ReactNode;
}): ReactElement => (
  <MemoryRouter initialEntries={["/"]}>
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  </MemoryRouter>
);

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) => render(ui, { wrapper: DecoratedRender, ...options });

export * from "@testing-library/react";
export { customRender as render };
