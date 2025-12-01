import { v4 as uuidv4 } from "uuid";

/**
 * @function generateUniqueId
 * @description Creates a new, randomly generated UUID (v4) string.
 * @returns {string} A 36-character unique identifier (e.g., '123e4567-e89b-12d3-a456-426614174000').
 */
export function generateUniqueId(): string {
  // We use the v4 function, which generates a randomly generated UUID.
  // This is the standard, positive choice for creating unique IDs.
  return uuidv4();
}
