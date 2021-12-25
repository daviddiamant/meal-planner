import "@testing-library/jest-dom";

import { server, setupBaseHandlers } from "../mocks";
import { queryClient } from "../utils";

jest.mock("../utils/importMeta", () => ({
  getMetaValue: (key: string) => "some-value",
}));

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
