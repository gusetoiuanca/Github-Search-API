import {
  validateCreatedFormat,
  sanitizeLanguage,
  validatePageNumberFormat,
} from "../../utils/validateSearchParameters";
import { BadRequestError } from "../../utils/errors/ApiError";

describe("validateCreatedFormat", () => {
  it("should not throw an error for a valid date format", () => {
    expect(() => validateCreatedFormat("2023-01-15")).not.toThrow();
  });

  it("should not throw an error for a valid range format (start date)", () => {
    expect(() => validateCreatedFormat(">2023-01-15")).not.toThrow();
  });

  it("should not throw an error for a valid range format (end date)", () => {
    expect(() => validateCreatedFormat("<2023-01-15")).not.toThrow();
  });

  it("should not throw an error for a valid range format (start and end date)", () => {
    expect(() => validateCreatedFormat("2023-01-15..2023-01-30")).not.toThrow();
  });

  it("should not throw an error for undefined input", () => {
    expect(() => validateCreatedFormat(undefined)).not.toThrow();
  });

  it("should throw BadRequestError for an invalid date format", () => {
    expect(() => validateCreatedFormat("2023/01/15")).toThrow(BadRequestError);
    expect(() => validateCreatedFormat("invalid-date")).toThrow(BadRequestError);
    expect(() => validateCreatedFormat("2023-1-1")).toThrow(BadRequestError);
  });

  it("should throw BadRequestError for an invalid range format", () => {
    expect(() => validateCreatedFormat("=>2023-01-15")).toThrow(
      BadRequestError,
    );
    expect(() => validateCreatedFormat("2023-01-15..2023/01/30")).toThrow(
      BadRequestError,
    );
  });
});

describe("validatePageNumberFormat", () => {
  it("should return the page number for a valid positive number string", () => {
    expect(validatePageNumberFormat("1")).toBe(1);
    expect(validatePageNumberFormat("100")).toBe(100);
  });

  it("should return undefined for undefined input", () => {
    expect(validatePageNumberFormat(undefined)).toBeUndefined();
  });

  it("should throw BadRequestError for zero", () => {
    expect(() => validatePageNumberFormat("0")).toThrow(BadRequestError);
  });

  it("should throw BadRequestError for a negative number string", () => {
    expect(() => validatePageNumberFormat("-5")).toThrow(BadRequestError);
  });

  it("should throw BadRequestError for a non-numeric string", () => {
    expect(() => validatePageNumberFormat("abc")).toThrow(BadRequestError);
  });
  it("should throw BadRequestError for a decimal number string", () => {
    expect(validatePageNumberFormat("1")).toBe(1);
  });
});

describe("sanitizeLanguage", () => {
  it("should return undefined for undefined input", () => {
    expect(sanitizeLanguage(undefined)).toBeUndefined();
  });

  it("should remove special characters not in the whitelist", () => {
    expect(sanitizeLanguage("javascript' OR 1=1--")).toBe("javascript OR 11--");
    expect(sanitizeLanguage("java<script>alert(1)</script>")).toBe("javascriptalert1script");
    expect(sanitizeLanguage("python; DROP TABLE users;")).toBe("python DROP TABLE users");
  });

  it("should preserve allowed special characters and spaces", () => {
    expect(sanitizeLanguage("C++")).toBe("C++");
    expect(sanitizeLanguage("C#")).toBe("C#");
    expect(sanitizeLanguage("Objective-C")).toBe("Objective-C");
    expect(sanitizeLanguage("F#")).toBe("F#");
    expect(sanitizeLanguage("Type Script")).toBe("Type Script");
  });

  it("should return the original string if no sanitization is needed", () => {
    expect(sanitizeLanguage("typescript")).toBe("typescript");
    expect(sanitizeLanguage("java")).toBe("java");
  });
});
