import useSWR from "swr";

export function useProject() {
  return useSWR("/api/projects");
}

export function useContact() {
  return useSWR("/api/contactUs/getContacts");
}

export function useSubmitCV() {
  return useSWR("/api/hireTalent/cvUpload/getCv");
}

export function useJobs() {
  return useSWR("/api/jobs/getJobs");
}

export function useBlogs() {
  return useSWR("/api/blog/getBlog");
}

export function useOneProject(id) {
  return useSWR(`/api/projects/${id}`);
}

export function useOneJob(id) {
  return useSWR(`/api/jobs/getOneJob/${id}`);
}
