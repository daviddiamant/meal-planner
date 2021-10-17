import { User } from "firebase/auth";
import { MemoryRouter, Route, Switch } from "react-router-dom";

import * as userHooks from "../../hooks/user";
import { render } from "../../utils";
import { Login } from ".";

const userHook = jest.spyOn(userHooks, "useUser");

const MockRouter = () => (
  <MemoryRouter initialEntries={["/login"]}>
    <Switch>
      <Route path="/login">
        <Login />
      </Route>
      <Route path="/profile">
        <p data-testid="profile">profile</p>
      </Route>
    </Switch>
  </MemoryRouter>
);

describe("Pages/Login", () => {
  it("Should wait for user status and return null meanwhile", () => {
    userHook.mockImplementation(() => ({
      user: undefined,
      login: async () => {},
    }));

    const login = render(<Login />);

    expect(login.container).toBeEmptyDOMElement();
  });

  it("Should not redirect if user is not logged in", async () => {
    userHook.mockImplementation(() => ({
      user: null,
      login: async () => {},
    }));

    const { findByRole } = render(<MockRouter />);
    const loginButton = await findByRole("button");

    expect(loginButton).toHaveTextContent("Logga in");
  });

  it("Should redirect if user is logged in", async () => {
    userHook.mockImplementation(() => ({
      user: { uid: "someID" } as User,
      login: async () => {},
    }));

    const { findByTestId } = render(<MockRouter />);
    const mockProfile = await findByTestId("profile");

    expect(mockProfile).toHaveTextContent("profile");
  });
});
