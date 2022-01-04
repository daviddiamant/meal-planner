import { Paths, Responses } from "@meal-planner/types";
import { useQuery, UseQueryResult } from "react-query";

import { API_URL } from "../appConfig";
import { axiosDataGetter } from "../utils";

export const useWeek = (): UseQueryResult<Responses["Week"] | undefined> =>
  useQuery<Responses["Week"] | undefined>(
    "week",
    axiosDataGetter<Responses["Week"]>("get", API_URL + Paths.Week)
  );
