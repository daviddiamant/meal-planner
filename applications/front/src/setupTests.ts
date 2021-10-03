import "@testing-library/jest-dom";

import { server, setupBaseHandlers } from "./mocks";
import { queryClient } from "./utils";

beforeAll(() => {
  server.listen();
  setupBaseHandlers();
});
beforeEach(() => {
  queryClient.cancelQueries();
  queryClient.clear();
  server.resetHandlers();
  setupBaseHandlers();
});
afterAll(() => server.close());
