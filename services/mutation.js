import useSWRMutation from "swr/mutation";
import { deleteRequest } from "./api";
import { useNewsletter, useProject } from "./queries";

export function useDeleteProject() {
  const { mutate } = useProject();

  return useSWRMutation(`/api/projects/`, deleteRequest, {
    onError(error) {
      console.error("Delete error:", error);
    },
    onSuccess: () => {
      mutate();
    },
  });
}

export function useDeleteNewsletter() {
  const { mutate } = useNewsletter();

  return useSWRMutation(`/api/newsletter-campaigns/`, deleteRequest, {
    onError(error) {
      console.error("Delete error:", error);
    },
    onSuccess: () => {
      mutate();
    },
  });
}
