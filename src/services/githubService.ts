import { Octokit } from "octokit";

import { GithubRequest } from "../models/githubRequest.js";
import { SearchParams } from "../models/searchParams.js";
import { GithubRepository } from "src/models/githubRepository.js";
import { GithubResponse } from "src/models/githubResponse.js";
const octokit = new Octokit();
const NO_OF_REPOSITORIES = 1;

export async function searchRepositories(params: SearchParams) {
  const response = await octokit.request(
    "GET /search/repositories",
    computeRequestParams(params),
  );
  return response.data.items;
}

export async function aggregateRepositories(params: SearchParams) {
  const requests = [];

  for (let page = 1; page <= 10; page++) {
    params.page = page;
    const request = octokit.request(
      "GET /search/repositories",
      computeRequestParams(params),
    );
    requests.push(request);
  }

  const allResults = await Promise.all(requests);

  return allResults.map((result: GithubResponse) => result.data.items).flat();
}

function computeRequestParams(params: SearchParams): GithubRequest {
  const { language, created, page, sort, order } = params;

  let q = "q=";
  if (language) {
    q += ` language:${language} `;
  }
  if (created) {
    q += ` created:>=${created} `;
  }
  const requestParams: GithubRequest = {
    q: q,
    page: page,
    per_page: NO_OF_REPOSITORIES,
    headers: {
      "X-GitHub-Api-Version": "2022-11-28",
    },
  };

  if (sort) {
    requestParams.sort = sort;
  }
  if (order) {
    requestParams.order = order;
  }

  //logger.debug({requestParams}, "Computing request params");

  return requestParams;
}
