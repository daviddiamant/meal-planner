import { User } from "firebase/auth";
import { Route, Routes } from "react-router-dom";

import { useHasIntersected } from "../../hooks/intersection";
import {
  getRecipeMock,
  setupConfigHandler,
  setupRecipesHandler,
} from "../../mocks";
import { fireEvent, render, waitFor, within } from "../../utils";
import { Home } from ".";

jest.mock("@react-hook/size", () => () => [1000, null]);

jest.mock("../../hooks/user", () => ({
  ...jest.requireActual("../../hooks/user"),
  useUser: () => ({
    user: { uid: "someID" } as User,
    login: async () => undefined,
  }),
}));

jest.mock("../../hooks/intersection", () => ({
  useHasIntersected: jest.fn(() => false),
}));

const MockRoutes = () => (
  <Routes>
    <Route element={<p data-testid="recipe">recipe</p>} path="/recipe/:slug" />
    <Route element={<Home />} path="/" />
  </Routes>
);

describe("Pages/Home", () => {
  it("Should not render the users title before its fetched", () => {
    setupConfigHandler({ bookTitle: "some title", delay: true });

    const { queryByRole } = render(<Home />);

    const noBanner = queryByRole("banner");
    expect(noBanner).toBeNull();
  });

  it("Should render the users configured title", async () => {
    setupConfigHandler({ bookTitle: "some title" });

    const { findByRole } = render(<Home />);

    const banner = await findByRole("banner");
    expect(banner).toHaveTextContent("some title");
  });

  it("Should fetch 64 recipes on mount and then new ones when the first 64 has all been show", async () => {
    const { queryAllByRole, rerender } = render(<Home />);

    await waitFor(() => {
      const recipes = queryAllByRole("gridcell");
      expect(recipes).toHaveLength(64);
    });

    setupRecipesHandler([64, 128]);
    (useHasIntersected as jest.Mock<boolean>).mockImplementation(() => true);

    rerender(<Home />);

    await waitFor(
      () => {
        const moreRecipes = queryAllByRole("gridcell");
        expect(moreRecipes).toHaveLength(128);
      },
      { timeout: 2000, interval: 200 }
    );
  });

  it("Should go to the reecipe when it is clicked", async () => {
    const { findAllByRole, findByTestId } = render(<MockRoutes />);

    const recipes = await findAllByRole("link");
    fireEvent.click(recipes[0]);

    const mockProfile = await findByTestId("recipe");

    expect(mockProfile).toHaveTextContent("recipe");
  });

  describe("Should use the following heuristics to create a mosaic layout", () => {
    it("Should use left column if the previous heights are the same", async () => {
      setupRecipesHandler(
        [0, 64],
        [getRecipeMock(), getRecipeMock(), getRecipeMock()]
      );

      const { findByTestId } = render(<Home />);

      const leftColumn = await findByTestId("left-column");
      await waitFor(() => {
        const recipes = within(leftColumn).queryAllByRole("gridcell");
        expect(recipes).toHaveLength(2);
      });
    });

    it("Should place the recipe in the column that have the least total height", async () => {
      setupRecipesHandler(
        [0, 64],
        [
          getRecipeMock(0.5, "some-slug-1"),
          getRecipeMock(3, "some-slug-2"),
          getRecipeMock(3, "some-slug-3"),
        ]
      );

      const { findByTestId } = render(<Home />);

      const leftColumn = await findByTestId("left-column");
      const rightColumn = await findByTestId("right-column");

      await waitFor(() => {
        const recipe1 = within(leftColumn).queryByTestId("some-slug-1");
        const recipe2 = within(rightColumn).queryByTestId("some-slug-2");
        const recipe3 = within(rightColumn).queryByTestId("some-slug-3");

        expect(recipe1).toEqual(expect.anything());
        expect(recipe2).toEqual(expect.anything());
        expect(recipe3).toEqual(expect.anything());
      });
    });
  });
});
