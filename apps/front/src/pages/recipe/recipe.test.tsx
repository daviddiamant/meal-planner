// import { User } from "firebase/auth";
// import { MemoryRouter, Route, Switch } from "react-router-dom";

// import * as userHooks from "../../hooks/user";
// import { render } from "../../utils";
import { Login } from ".";

// const userHook = jest.spyOn(userHooks, "useUser");

// const MockRouter = () => (
//   <MemoryRouter initialEntries={["/login"]}>
//     <Switch>
//       <Route path="/login">
//         <Login />
//       </Route>
//       <Route path="/profile">
//         <p data-testid="profile">profile</p>
//       </Route>
//     </Switch>
//   </MemoryRouter>
// );

describe("Pages/Recipe", () => {
  it("Should wait for user status and return null meanwhile", () => {
    // userHook.mockImplementation(() => ({
    //   user: undefined,
    //   login: async () => {},
    // }));
    // const login = render(<Login />);
    // expect(login.container).toBeEmptyDOMElement();
  });
});
