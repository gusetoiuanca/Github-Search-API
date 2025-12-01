import { RequestParameters } from "@octokit/types";
export interface GithubRequest extends RequestParameters {
  q: string;
  per_page?: number | undefined;
  page?: number | undefined;
  sort?: "updated" | "stars" | "forks" | "help-wanted-issues";
  order?: "asc" | "desc";
  headers?: Record<string, string>;
}
