import { UUIDTypes } from "uuid";

import { Repository } from "./repository.js";
export interface SearchResponse {
  requestId: UUIDTypes;
  data?: Repository[];
  error?: string;
}
