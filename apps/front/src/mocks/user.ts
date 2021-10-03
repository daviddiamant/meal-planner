import { Paths, Responses } from "@meal-planner/types";

import { server, successfulHandler } from ".";

type ConfigHandler = Partial<{
  bookTitle: string;
  delay: boolean;
}>;

export const getConfigHandler = ({
  bookTitle = "Some Book Title",
  delay = false,
}: ConfigHandler = {}) =>
  successfulHandler<Responses["UserConfig"]>("get", Paths.UserConfig, delay, {
    bookTitle,
    lowTitle: true,
    bookID: "someBookID",
    algoliaSearchKey: "someSearchKey",
  });

export const setupConfigHandler = (configParams: ConfigHandler = {}) =>
  server.use(getConfigHandler(configParams));
