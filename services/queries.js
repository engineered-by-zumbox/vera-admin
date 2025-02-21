import useSWR from "swr";

export function useProject() {
  return useSWR("/api/projects");
}

export function useNewsletter() {
  return useSWR("/api/newsletter-campaigns");
}

export function useSubscribers() {
  return useSWR("/api/newsletter-subscribers");
}

export function useOneProject(id) {
  return useSWR(`/api/projects/${id}`);
}

export function useOneNewsletter(id) {
  return useSWR(`/api/newsletter-campaigns/${id}`);
}
