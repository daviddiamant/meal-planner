import { Paths, Responses } from "@meal-planner/types";
import axios from "axios";
import {
  useMutation,
  UseMutationResult,
  useQuery,
  UseQueryResult,
} from "react-query";

import { API_URL } from "../appConfig";
import { axiosDataGetter, queryClient } from "../utils";

const getWeekQueryKey = "week";

export const useWeek = (): UseQueryResult<Responses["Week"] | undefined> =>
  useQuery<Responses["Week"] | undefined>(
    getWeekQueryKey,
    axiosDataGetter<Responses["Week"]>("get", API_URL + Paths.Week)
  );

export const useAddToWeek = (
  slug: string
): UseMutationResult<{ result: boolean | string }> =>
  useMutation(
    () =>
      axios.post(API_URL + Paths.AddToWeek, {
        value: slug,
      }),
    {
      onSuccess: () =>
        queryClient.invalidateQueries(getWeekQueryKey, { exact: true }),
    }
  );
