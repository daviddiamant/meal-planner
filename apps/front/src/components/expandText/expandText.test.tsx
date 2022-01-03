import { fireEvent, render, waitFor } from "../../utils";
import { ExpandText } from "./";

jest.mock("@react-hook/window-size/throttled", () => ({
  useWindowWidth: () => 320,
}));

describe("Components/ExpandText", () => {
  describe("When the number of rows are more than numLines", () => {
    // eslint-disable-next-line jest/valid-title
    test(`
      First the correct "read more toggle" should be shown and the height should be restricted.

      Then all when the toggle is clicked, all lines should shown and the toggle should now be "read less"

      Finally, when "read less" is clicked, it should go back to it's initial state`, async () => {
      const { getByTestId, getByText } = render(
        <ExpandText getInnerHeight={(_) => 500}>
          Component that will, given a long text and a number of decired rows,
          only show that number of rows even though the long text needs more
          rows to display fully. A link to show the whole text will be
          displayed. Clicking that link will show all the rows that are required
          to display the long text.
        </ExpandText>
      );

      const outer = getByTestId("outer");
      const readMoreWrapper = getByTestId("expand-toggle");
      const readMore = getByText("Läs mer");
      const readLess = getByText("Läs mindre");

      expect(outer).toHaveStyle({
        height: "66px",
      });

      await waitFor(() => {
        expect(readMoreWrapper.className.includes("shown-false")).toBe(false);
      });

      fireEvent.click(readMore);

      await waitFor(() => {
        expect(outer).toHaveStyle({
          height: "500px",
        });

        expect(readMoreWrapper.className.includes("shown-false")).toBe(true);
        expect(readLess.className.includes("shown-false")).toBe(false);
      });

      fireEvent.click(readLess);

      await waitFor(() => {
        expect(outer).toHaveStyle({
          height: "66px",
        });

        expect(readMoreWrapper.className.includes("shown-false")).toBe(false);
      });
    });
  });

  describe("When the number of rows are less or equal to numLines", () => {
    it("Should have the lower height and not show the toggles", () => {
      const { getByTestId, getByText } = render(
        <ExpandText getInnerHeight={(_) => 22}>short text</ExpandText>
      );

      const outer = getByTestId("outer");
      const readMoreWrapper = getByTestId("expand-toggle");
      const readLess = getByText("Läs mindre");

      expect(outer).toHaveStyle({
        height: "22px",
      });

      expect(readMoreWrapper.className.includes("shown-false")).toBe(true);
      expect(readLess.className.includes("shown-false")).toBe(true);
    });
  });
});
