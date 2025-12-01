This project is a web service for searching and ranking GitHub repositories.
Limitations from Github:

- Just like searching on Google, you sometimes want to see a few pages of search results so that you can find the item that best meets your needs. To satisfy that need, the GitHub REST API provides up to 1,000 results for each search.
- The REST API has a custom rate limit for searching. For authenticated requests, you can make up to 30 requests per minute for all search endpoints except for the Search code endpoint

## API Endpoints

The application exposes two main endpoints for searching and ranking GitHub repositories.

### 1. `GET /searchRepositories`

This endpoint allows users to retrieve up to 100 repositories at a time for a specific query, with an associated score. Pagination is supported through the `page` parameter.

**Parameters:**

- `language`: (Optional) Filter repositories by programming language (e.g., `typescript`, `javascript`).
- `created`: (Optional) Filter repositories created on or after a specific date (format: `YYYY-MM-DD`).
- `page`: (Optional) The page number for pagination (e.g., `1`, `2`). Defaults to `1`.

**Example Calls:**

- **Search for TypeScript repositories created after 2023-10-25, page 1:**
  ```bash
  curl "http://localhost:3000/searchRepositories?language=typescript&page=1&created=2023-10-25"
  ```
- **Search for JavaScript repositories on page 2:**
  ```bash
  curl "http://localhost:3000/searchRepositories?language=javascript&page=2"
  ```
- **Search for any repositories created after 2024-01-01:**
  ```bash
  curl "http://localhost:3000/searchRepositories?created=2024-01-01"
  ```

### 2. `GET /aggregateRepositories`

This endpoint retrieves the first 1000 repositories matching the criteria, calculates their scores scaled to a [0, 100] interval, and sorts them by score in descending order.

**Note:** This endpoint can be significantly slower and might be subject to GitHub's API rate limits due to multiple requests being made.

**Parameters:**

- `language`: (Optional) Filter repositories by programming language (e.g., `go`, `python`).
- `created`: (Optional) Filter repositories created on or after a specific date (format: `YYYY-MM-DD`).

**Example Calls:**

- **Aggregate Go repositories created after 2022-06-01:**
  ```bash
  curl "http://localhost:3000/aggregateRepositories?language=go&created=2022-06-01"
  ```
- **Aggregate Python repositories:**
  ```bash
  curl "http://localhost:3000/aggregateRepositories?language=python"
  ```
- **Aggregate any repositories created after 2020-01-01:**
  ```bash
  curl "http://localhost:3000/aggregateRepositories?created=2020-01-01"
  ```

## How to Run the Application

To start the development server:

```bash
npm start
```

The server will be running at `http://localhost:3000`.

## Running Tests

This project uses Jest for testing. Below are the commands to run different sets of tests.

### GitHub API Reference

This project uses the [GitHub REST API v3 for searching repositories](https://docs.github.com/en/rest/search/search?apiVersion=2022-11-28#search-repositories).

### Run All Tests

To execute all unit and integration tests:

```bash
npm test
# or
npm run test:all
```

### Run Unit Tests

To run only the unit tests (located in the `tests/unit` directory):

```bash
npm run test:unit
```

### Run Integration Tests

To run only the integration tests (located in the `tests/integration` directory):

```bash
npm run test:integration
```

### Run a Specific Test File

To run a single, specific unit or integration test file, provide the path to the file after the command.

For a unit test file:

```bash
npm run test:unit:file tests/unit/scoring.test.ts
# Replace tests/unit/scoring.test.ts with the actual path to your unit test file
```

For an integration test file:

```bash
npm run test:integration:file tests/integration/searchController.test.ts
# Replace tests/integration/searchController.test.ts with the actual path to your integration test file
```
