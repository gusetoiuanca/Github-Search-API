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
  validateCreatedFormat,
  sanitizeLanguage,
  validatePageNumberFormat,
} from "../utils/validateSearchParameters.js";
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
    const searchParams: SearchParams = {
      sort: "stars",
      order: "desc",
    };
    if(language) {
      searchParams.language = sanitizeLanguage(language as string | undefined);
    }
    if(created) {
      validateCreatedFormat(created as string | undefined);
      searchParams.created = created as string;
    }
    if(page){
      searchParams.page = validatePageNumberFormat(page as string);
    }
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
