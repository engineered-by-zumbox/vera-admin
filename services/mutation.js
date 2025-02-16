import useSWRMutation from "swr/mutation";
import { deleteRequest } from "./api";
import { useProject } from "./queries";

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
