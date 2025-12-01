import { Request, Response } from "express";

import { Repository } from "../models/repository.js";
import { SearchParams } from "../models/searchParams.js";
import { SearchResponse } from "../models/searchResponse.js";
import { searchRepositories } from "../services/githubService.js";
import { generateUniqueId } from "../utils/generateRequestId.js";
import logger from "../utils/logger.js";
import { calculateScore } from "../utils/scoring.js";
import { GithubRepository } from "../models/githubRepository.js";
import {
  BadRequestError,
  InternalServerError,
} from "../utils/errors/ApiError.js";

export async function searchController(
  req: Request,
  res: Response,
  next: Function,
) {
  const requestId = generateUniqueId();
  logger.info({ query: req.query }, "Incoming search request", requestId);
  try {
    const { language, created, page } = req.query;

    let pageNum: number | undefined;
    if (page !== undefined) {
      pageNum = parseInt(page as string, 10);
      if (isNaN(pageNum) || pageNum <= 0) {
        throw new BadRequestError(
          "Invalid 'page' parameter. Must be a positive number.",
        );
      }
    }

    const searchParams: SearchParams = {
      language: language as string | undefined,
      created: created as string | undefined,
      page: pageNum,
      sort: "stars",
      order: "desc",
    };
    logger.debug(
      { searchParams },
      "Calling GitHub service with parameters",
      requestId,
    );
    const repositories = await searchRepositories(searchParams);
    logger.debug(
      { count: repositories.length },
      "Received repositories from GitHub service",
      requestId,
    );

    const reposWithScore: Repository[] = repositories.map(
      (repo: GithubRepository) => {
        const repository: Repository = {
          name: repo.full_name,
          score: calculateScore(repo),
        };
        return repository;
      },
    );

    reposWithScore.sort((a: Repository, b: Repository) => b.score - a.score);

    const resp: SearchResponse = {
      requestId: requestId,
      data: reposWithScore,
    };

    res.json(resp);
  } catch (error: any) {
    logger.error(
      { requestId: requestId, error: error.message, stack: error.stack },
      "An error occurred in searchController",
    );
    // Pass the error to the next middleware (errorHandler)
    if (error instanceof BadRequestError) {
      next(error);
    } else {
      next(
        new InternalServerError("An internal server error occurred.", {
          originalError: error.message,
        }),
      );
    }
  }
}
