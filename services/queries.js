import useSWR from "swr";

export function useProject() {
  return useSWR("/api/projects");
}

export function useSubscribers() {
  return useSWR("/api/newsletter-subscribers");
}
