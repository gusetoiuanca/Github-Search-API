import { GithubRepository } from "./githubRepository.js";

export interface GithubResponse {
  total_count: number;
  partial_results: boolean;
  items: GithubRepository[]; // Changed from 'data: { items: GithubRepository[] }' to directly include items
}
