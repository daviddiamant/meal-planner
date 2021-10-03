export enum Paths {
  UserConfig = "/user",
  Recipes = "/recipes/:from/:to",
}

export interface Responses {
  UserConfig: {
    algoliaSearchKey: string;
    bookID: string;
    bookTitle: string;
    lowTitle: boolean;
  };
  Recipes: {
    title: string;
    slug: string;
    url: string;
    smallImage: string;
    smallImageWidth: number;
    smallImageHeight: number;
    mediumImage: string;
    mediumImageWidth: number;
    mediumImageHeight: number;
  }[];
}
