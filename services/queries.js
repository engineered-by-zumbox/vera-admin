import useSWR from "swr";

export function useProject() {
  return useSWR("/api/projects");
}

export function useSubscribers() {
  return useSWR("/api/newsletter-subscribers");
}

export function useOneProject(id) {
  return useSWR(`/api/projects/${id}`);
}
