import { GithubRepository } from "./githubRepository.js";

export interface GithubResponse {
  total_count: number;
  partial_results: boolean;
  data: {
      items: GithubRepository[]
  };
}
