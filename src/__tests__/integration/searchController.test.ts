import nock from "nock";
import request from "supertest";
import { app } from "../../index.js";
import { jest } from "@jest/globals";

const SECONDS = 1000;
jest.setTimeout(20 * SECONDS);
const mockRepos = {
  items: [
    {
      full_name: "Repo A",
      stargazers_count: 50,
      forks_count: 10,
      updated_at: "2025-11-26T10:00:00Z",
    }, 
    {
      full_name: "Repo B",
      stargazers_count: 100,
      forks_count: 50,
      updated_at: "2025-10-28T10:00:00Z",
    }, 
    {
      full_name: "Repo C",
      stargazers_count: 200,
      forks_count: 20,
      updated_at: "2024-11-27T10:00:00Z",
    }, 
  ],
};
/**   { name: 'Repo A', score: 17.96 },
      { name: 'Repo B', score: 7.34 },
      { name: 'Repo C', score: 1.36 } */

describe("GET / - Search Controller Integration Test", () => {
  it("should return a 200 status and correctly sorted repositories", async () => {
    const scope = nock("https://api.github.com")
      .get("/search/repositories?q=&per_page=100&sort=stars&order=desc")
      .reply(200, JSON.stringify(mockRepos), {
        "content-type": "application/json; charset=utf-8",
      });

    // Make the request using supertest
    const response = await request(app).get("/searchRepositories/");
    console.log(response.body);
    // Assertions
    expect(response.status).toBe(200);
    expect(response.body.data.length).toBe(3);

    // Check that the response is sorted by score (descending)
    expect(response.body.data[0].name).toBe("Repo A");
    expect(response.body.data[1].name).toBe("Repo B");
    expect(response.body.data[2].name).toBe("Repo C");
    scope.done();
  });

  it("should return a 400 status for invalid 'created' parameter format", async () => {
    const response = await request(app).get("/searchRepositories/?created=2023/10/26");
    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      "Invalid 'created' parameter. Must be in 'yyyy-mm-dd' format, or a range like '>yyyy-mm-dd', '<yyyy-mm-dd', or 'yyyy-mm-dd..yyyy-mm-dd'.",
    );
    expect(response.body.errorCode).toBe("BAD_REQUEST");
  });
});
