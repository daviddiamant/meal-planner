import { User } from "firebase/auth";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import * as userHooks from "../../hooks/user";
import { render, renderWithoutRouter } from "../../utils";
import { Login } from ".";

const userHook = jest.spyOn(userHooks, "useUser");

const MockRouter = () => (
  <MemoryRouter initialEntries={["/login"]}>
    <Routes>
      <Route element={<Login />} path="/login" />
      <Route element={<p data-testid="profile">profile</p>} path="/profile" />
    </Routes>
  </MemoryRouter>
);

describe("Pages/Login", () => {
  it("Should wait for user status and return null meanwhile", () => {
    userHook.mockImplementation(() => ({
      user: undefined,
      login: async () => undefined,
    }));

    const login = render(<Login />);

    expect(login.container).toBeEmptyDOMElement();
  });

  it("Should not redirect if user is not logged in", async () => {
    userHook.mockImplementation(() => ({
      user: null,
      login: async () => undefined,
    }));

    const { findByRole } = renderWithoutRouter(<MockRouter />);
    const loginButton = await findByRole("button");

    expect(loginButton).toHaveTextContent("Logga in");
  });

  it("Should redirect if user is logged in", async () => {
    userHook.mockImplementation(() => ({
      user: { uid: "someID" } as User,
      login: async () => undefined,
    }));

    const { findByTestId } = renderWithoutRouter(<MockRouter />);
    const mockProfile = await findByTestId("profile");

    expect(mockProfile).toHaveTextContent("profile");
  });
});
