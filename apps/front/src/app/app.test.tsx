import axios from "axios";
import { User } from "firebase/auth";

import * as userHooks from "../hooks/user";
import { setupConfigHandler } from "../mocks";
import { render } from "../utils";
import { App } from ".";

const userHook = jest.spyOn(userHooks, "useUser");
const axiosInterception = jest.spyOn(axios.interceptors.request, "use");
const removeAxiosInterception = jest.spyOn(axios.interceptors.request, "eject");
jest.mock("../hooks/intersection", () => ({
  useHasIntersected: () => false,
}));

const mockLogInStatus = (status: undefined | null | User) =>
  userHook.mockImplementation(() => ({
    user: status,
    login: async () => undefined,
  }));

describe("App", () => {
  it("Should wait for user status and return null meanwhile", () => {
    mockLogInStatus(undefined);

    const app = render(<App />);

    expect(app.container).toBeEmptyDOMElement();
  });

  it("Should redirect if user is not logged in", async () => {
    mockLogInStatus(null);

    const { findByRole } = render(<App />);
    const loginButton = await findByRole("button");

    expect(loginButton).toHaveTextContent("Logga in");
  });

  it("Should not redirect if user is logged in", async () => {
    mockLogInStatus({ uid: "someID" } as User);
    setupConfigHandler({ bookTitle: "Book title" });

    const { findByRole } = render(<App />);
    const banner = await findByRole("banner");

    expect(banner).toHaveTextContent("Book title");
  });

  it("Should remove/add axios interception depending on user status", () => {
    mockLogInStatus({ uid: "someID" } as User);

    const { rerender } = render(<App />);

    expect(axiosInterception).toHaveBeenCalledTimes(1);
    expect(removeAxiosInterception).toHaveBeenCalledTimes(0);

    mockLogInStatus(null);
    rerender(<App />);

    expect(removeAxiosInterception).toHaveBeenCalledTimes(1);
  });
});
