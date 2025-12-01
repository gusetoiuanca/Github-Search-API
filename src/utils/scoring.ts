import { Repository } from "../models/repository.js";

/**
 * Calculates the score for a repository based on the number of stars, forks
 * and the date since last update.
 *
 * Formula can be easily changes based on business requirements.
 */

export function calculateScore(repo: any): number {
  return calculateScoreWithFocusOnStars(repo);
}

const STAR_WEIGHT = 2;
const FORK_WEIGHT = 0.5;
const EXTRA_DAYS = 5; // avoid division by 0 and having a really high couple of scores

/**
 * This formula gives weight to popular repositories but also favors
 * projects that have been recently updated.
 */
function calculateScoreWithFocusOnStars(repo: any): number {
  const stars = repo.stargazers_count ?? 0;
  const forks = repo.forks_count ?? 0;
  const now = new Date();
  const updatedAt = new Date(repo.updated_at);
  const daysSinceLastUpdate =
    (now.getTime() - updatedAt.getTime()) / (24 * 1000 * 60 * 60);

  const score =
    (stars * STAR_WEIGHT + forks * FORK_WEIGHT) /
    (daysSinceLastUpdate + EXTRA_DAYS);
  return Number(score.toFixed(2));
}

/**
 *
 * @param data an array of Repositories
 * @param newMin lower limit for scoring interval
 * @param newMax upper limit for scoring interval
 * @returns an array of Repositories with all the score values scaled to [newMin, newMax]
 */
export function scaleToInterval(
  repositories: Repository[],
  newMin: number,
  newMax: number,
): Repository[] {
  const data: number[] = repositories.map((repo) => repo.score as number);

  // 1. Find the min and max of the original data set
  const oldMin: number = Math.min(...data);
  const oldMax: number = Math.max(...data);
  const oldRange: number = oldMax - oldMin;
  const newRange: number = newMax - newMin;

  // Handle edge case where all numbers in the input are identical
  if (oldRange === 0) {
    const repositoriesWithScaledScore = repositories.map((repo) => {
      repo.score = newMin;
      return repo;
    });
    return repositoriesWithScaledScore; // Return an array of only the new minimum
  }

  // 2. Map each number using the linear scaling formula
  const repositoriesWithScaledScore = repositories.map((repo) => {
    // Formula: NewValue = ((OldValue - OldMin) / OldRange) * NewRange + NewMin
    const normalizedValue: number = (repo.score - oldMin) / oldRange; // Value between 0 and 1
    const scaledValue: number = normalizedValue * newRange + newMin;
    repo.score = Number(scaledValue.toFixed(4));
    return repo;
  });

  return repositoriesWithScaledScore;
}
