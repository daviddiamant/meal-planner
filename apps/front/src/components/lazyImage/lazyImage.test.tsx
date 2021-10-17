import { useHasIntersected } from "../../hooks/intersection";
import { render } from "../../utils";
import { LazyImage } from ".";

jest.mock("../../hooks/intersection", () => ({
  useHasIntersected: jest.fn(() => false),
}));

describe("Components/LazyImage", () => {
  it("Should not show anything at first", () => {
    const { queryAllByRole } = render(
      <LazyImage
        alt="some-img"
        largeUrl="/some-large-url"
        smallUrl="/some-url"
      />
    );

    const images = queryAllByRole("img");

    expect(images).toHaveLength(0);
  });

  it("Should show small image when it intersects", async () => {
    (useHasIntersected as jest.Mock<boolean>).mockImplementationOnce(
      () => true
    );

    const { findAllByRole, queryByAltText } = render(
      <LazyImage
        alt="some-img"
        largeUrl="/some-large-url"
        smallUrl="/some-url"
      />
    );

    const images = await findAllByRole("img");
    const smallImage = queryByAltText("Förhandsvisning - some-img");

    expect(images).toHaveLength(1);
    expect(smallImage).not.toBeNull();
  });

  it("Should show both images when it intersects", async () => {
    (useHasIntersected as jest.Mock<boolean>).mockImplementation(() => true);

    const { findAllByRole, queryByAltText } = render(
      <LazyImage
        alt="some-img"
        largeUrl="/some-large-url"
        smallUrl="/some-url"
      />
    );

    const images = await findAllByRole("img");
    const smallImage = queryByAltText("Förhandsvisning - some-img");
    const largeImage = queryByAltText("some-img");

    expect(images).toHaveLength(2);
    expect(smallImage).not.toBeNull();
    expect(largeImage).not.toBeNull();
  });
});
