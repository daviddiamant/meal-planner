import {
  render as defaultRender,
  RenderOptions,
  RenderResult,
} from "@testing-library/react";
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
    <RenderWithoutRouter>{children}</RenderWithoutRouter>
  </MemoryRouter>
);

const RenderWithoutRouter = ({
  children,
}: {
  children?: ReactNode;
}): ReactElement => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

export const render = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">
): RenderResult => defaultRender(ui, { wrapper: DecoratedRender, ...options });

export const renderWitoutRouter = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">
): RenderResult =>
  defaultRender(ui, { wrapper: RenderWithoutRouter, ...options });

export * from "@testing-library/react";
