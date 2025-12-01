//import { searchRepositories } from '../services/githubService';
import { Request, Response } from "express";

import { Repository } from "../models/repository.js";
import { SearchParams } from "../models/searchParams.js";
import { SearchResponse } from "../models/searchResponse.js";
import { aggregateRepositories } from "../services/githubService.js";
import { generateUniqueId } from "../utils/generateRequestId.js";
import logger from "../utils/logger.js";
import { calculateScore, scaleToInterval } from "../utils/scoring.js";
import { GithubRepository } from "../models/githubRepository.js";
import {
  BadRequestError,
  InternalServerError,
} from "../utils/errors/ApiError.js";
import {
  validateCreatedFormat,
  sanitizeLanguage,
} from "../utils/validateSearchParameters.js";

export async function aggregateController(
  req: Request,
  res: Response,
  next: Function,
) {
  const requestId = generateUniqueId();
  logger.info({ query: req.query }, "Incoming aggregate request", requestId);
  try {
    const { language, created } = req.query;
    validateCreatedFormat(created as string | undefined);

    const searchParams: SearchParams = {
      language: sanitizeLanguage(language as string | undefined),
      created: created as string | undefined,
    };
    logger.debug(
      { searchParams },
      "Calling GitHub service with parameters",
      requestId,
    );
    const repositories = await aggregateRepositories(searchParams);
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
      data: scaleToInterval(reposWithScore, 0, 100),
    };

    res.json(resp);
  } catch (error: any) {
    logger.error(
      { requestId: requestId, error: error.message, stack: error.stack },
      "An error occurred in aggregateController",
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
