import useSWRMutation from "swr/mutation";
import { deleteRequest, updateHireRequest } from "./api";
import {
  useBlogs,
  useContact,
  useHireTalent,
  useJobs,
  useSubmitCV,
} from "./queries";

export function useUpdateTalentRequest() {
  const { mutate } = useHireTalent();

  return useSWRMutation(`/api/hireTalent/updateStatus/`, updateHireRequest, {
    onError(error) {
      console.error("Update error:", error);
    },
    onSuccess: () => {
      mutate();
    },
  });
}

export function useUpdateContact() {
  const { mutate } = useContact();

  return useSWRMutation(`/api/contactUs/updateStatus/`, updateHireRequest, {
    onError(error) {
      console.error("Update error:", error);
    },
    onSuccess: () => {
      mutate();
    },
  });
}

export function useDeleteContact() {
  const { mutate } = useContact();

  return useSWRMutation(`/api/contactUs/deleteform/`, deleteRequest, {
    onError(error) {
      console.error("Delete error:", error);
    },
    onSuccess: () => {
      mutate();
    },
  });
}

export function useDeleteCV() {
  const { mutate } = useSubmitCV();

  return useSWRMutation(`/api/hireTalent/cvUpload/delete/`, deleteRequest, {
    onError(error) {
      console.error("Delete error:", error);
    },
    onSuccess: () => {
      mutate();
    },
  });
}

export function useDeleteTalent() {
  const { mutate } = useHireTalent();

  return useSWRMutation(`/api/hireTalent/delete/`, deleteRequest, {
    onError(error) {
      console.error("Delete error:", error);
    },
    onSuccess: () => {
      mutate();
    },
  });
}

export function useDeleteJob() {
  const { mutate } = useJobs();

  return useSWRMutation(`/api/jobs/deleteJobs/`, deleteRequest, {
    onError(error) {
      console.error("Delete error:", error);
    },
    onSuccess: () => {
      mutate();
    },
  });
}

export function useDeleteBlog() {
  const { mutate } = useBlogs();

  return useSWRMutation(`/api/blog/delete/`, deleteRequest, {
    onError(error) {
      console.error("Delete error:", error);
    },
    onSuccess: () => {
      mutate();
    },
  });
}
