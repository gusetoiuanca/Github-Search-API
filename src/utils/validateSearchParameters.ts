import { BadRequestError } from "./errors/ApiError.js";

export function validateCreatedFormat(created: string | undefined) {
  if (
    created !== undefined &&
    !/^([<>]=?)?(\d{4}-\d{2}-\d{2})(\.\.(\d{4}-\d{2}-\d{2}))?$/.test(
      created as string,
    )
  ) {
    throw new BadRequestError(
      "Invalid 'created' parameter. Must be in 'yyyy-mm-dd' format, or a range like '>yyyy-mm-dd', '<yyyy-mm-dd', or 'yyyy-mm-dd..yyyy-mm-dd'.",
    );
  }
}

export function validatePageNumberFormat( page: string | undefined):number | undefined {
  let pageNum: number | undefined;
  if (page !== undefined) {
    pageNum = parseInt(page as string, 10);
    if (isNaN(pageNum) || pageNum <= 0) {
      throw new BadRequestError(
        "Invalid 'page' parameter. Must be a positive number.",
      );
    }
  }
  return pageNum;
}

export function sanitizeLanguage(
  language: string | undefined,
): string | undefined {
  if (language === undefined) {
    return undefined;
  }
  // Allow alphanumeric, spaces, +, #, -
  return language.replace(/[^a-zA-Z0-9\s+#-]/g, "");
}
