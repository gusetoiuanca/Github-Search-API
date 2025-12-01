import { jest } from "@jest/globals";

import { Repository } from "../../models/repository.js";
import { calculateScore, scaleToInterval } from "../../utils/scoring.js";

describe("calculateScore", () => {
  // Use a fixed date for reliable, deterministic tests
  const baseDate = new Date("2025-11-27T10:00:00Z");

  beforeAll(() => {
    // Mock the Date object so we can control the 'now' time in calculateScore
    jest.useFakeTimers();
    jest.setSystemTime(baseDate);
  });

  afterAll(() => {
    // Restore the original Date object
    jest.useRealTimers();
  });

  it("should calculate a score for a standard repository", () => {
    const repo = {
      stargazers_count: 100,
      forks_count: 50,
      // Updated 10 days ago
      updated_at: "2025-11-17T10:00:00Z",
    };
    // Expected score: (100 * 2 + 50 * 0.5) / (10 + 5) = 15
    expect(calculateScore(repo)).toBe(15);
  });

  it("should give a higher score to a more recently updated repository", () => {
    const oldRepo = {
      stargazers_count: 100,
      forks_count: 50,
      updated_at: "2025-11-17T10:00:00Z", // 10 days old
    };
    const newRepo = {
      stargazers_count: 100,
      forks_count: 50,
      updated_at: "2025-11-26T10:00:00Z", // 1 day old
    };

    // score: (100 * 2 + 50 * 0.5) / (1 + 5) = 37.5
    expect(calculateScore(newRepo)).toBe(37.5);
    expect(calculateScore(newRepo)).toBeGreaterThan(calculateScore(oldRepo));
  });

  it("should handle repositories with zero stars and forks", () => {
    const repo = {
      stargazers_count: 0,
      forks_count: 0,
      updated_at: "2025-11-17T10:00:00Z", // 10 days ago
    };
    // Expected score: (0 * 0.5 + 0 * 0.3) / (10 + 1) = 0
    expect(calculateScore(repo)).toBe(0);
  });

  it("should return a number", () => {
    const repo = {
      stargazers_count: 123,
      forks_count: 45,
      updated_at: "2025-11-20T10:00:00Z",
    };
    const score = calculateScore(repo);
    expect(typeof score).toBe("number");
  });
});

describe("scaleToInterval", () => {
  it("should scale scores to a [0, 1] interval", () => {
    const repositories: Repository[] = [
      { name: "repo1", score: 10 } as Repository,
      { name: "repo2", score: 20 } as Repository,
      { name: "repo3", score: 30 } as Repository,
      { name: "repo4", score: 40 } as Repository,
      { name: "repo5", score: 50 } as Repository,
    ];
    const scaledRepos = scaleToInterval(repositories, 0, 1);
    expect(scaledRepos.map((r) => r.score)).toEqual([0, 0.25, 0.5, 0.75, 1]);
  });

  it("should scale scores to a [1, 10] interval", () => {
    const repositories: Repository[] = [
      { name: "repo1", score: 10 } as Repository,
      { name: "repo2", score: 20 } as Repository,
      { name: "repo3", score: 30 } as Repository,
      { name: "repo4", score: 40 } as Repository,
      { name: "repo5", score: 50 } as Repository,
    ];
    const scaledRepos = scaleToInterval(repositories, 1, 10);
    const expectedScores = [1, 3.25, 5.5, 7.75, 10];
    const actualScores = scaledRepos.map((r) => r.score);
    actualScores.forEach((score, index) => {
      expect(score).toBeCloseTo(expectedScores[index]!);
    });
  });

  it("should handle an edge case where all scores are identical", () => {
    const repositories: Repository[] = [
      { name: "repo1", score: 20 } as Repository,
      { name: "repo2", score: 20 } as Repository,
      { name: "repo3", score: 20 } as Repository,
    ];
    const scaledRepos = scaleToInterval(repositories, 0, 10);
    expect(scaledRepos.map((r) => r.score)).toEqual([0, 0, 0]);
  });

  it("should handle a single repository", () => {
    const repositories: Repository[] = [
      { name: "repo1", score: 20 } as Repository,
    ];
    const scaledRepos = scaleToInterval(repositories, 0, 10);
    expect(scaledRepos.map((r) => r.score)).toEqual([0]);
  });

  it("should return an empty array if given an empty array", () => {
    const repositories: Repository[] = [];
    const scaledRepos = scaleToInterval(repositories, 0, 10);
    expect(scaledRepos).toEqual([]);
  });
});
