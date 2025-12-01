export interface SearchParams {
  language?: string | undefined;
  created?: string | undefined;
  page?: number | undefined;
  sort?: "updated" | "stars" | "forks" | "help-wanted-issues" | undefined;
  order?: "asc" | "desc" | undefined;
}
