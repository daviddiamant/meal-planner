import { Paths, Responses } from "@meal-planner/types";
import {
  useMutation,
  UseMutationResult,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from "@tanstack/react-query";
import axios from "axios";

import { API_URL } from "../appConfig";
import { axiosDataGetter } from "../utils";

const getWeekQueryKey = ["week"];

export const useWeek = (): UseQueryResult<Responses["Week"] | undefined> =>
  useQuery<Responses["Week"] | undefined>(
    getWeekQueryKey,
    axiosDataGetter<Responses["Week"]>("get", API_URL + Paths.Week)
  );

export const useAddToWeek = (): UseMutationResult<
  {
    result: boolean | string;
  },
  unknown,
  string
> => {
  const queryClient = useQueryClient();

  return useMutation(
    (slug) =>
      axios.post(API_URL + Paths.AddToWeek, {
        value: slug,
      }),
    {
      onSuccess: () =>
        queryClient.invalidateQueries(getWeekQueryKey, { exact: true }),
    }
  );
};

export const useRemoveFromWeek = (): UseMutationResult<
  {
    result: boolean | string;
  },
  unknown,
  string,
  { oldWeek: Responses["Week"] | undefined }
> => {
  const queryClient = useQueryClient();

  return useMutation(
    (slug) =>
      axios.post(API_URL + Paths.RemoveFromWeek, {
        value: slug,
      }),
    {
      onMutate: async (slugToRemove) => {
        await queryClient.cancelQueries(getWeekQueryKey);

        const oldWeek =
          queryClient.getQueryData<Responses["Week"]>(getWeekQueryKey);

        queryClient.setQueryData(
          getWeekQueryKey,
          oldWeek?.filter(({ slug }) => slug !== slugToRemove)
        );

        return { oldWeek };
      },
      onError: (_, __, context) => {
        queryClient.setQueryData<Responses["Week"] | undefined>(
          getWeekQueryKey,
          context?.oldWeek
        );
      },
    }
  );
};
