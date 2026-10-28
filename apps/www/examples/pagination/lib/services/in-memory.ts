import { paginateInMemory, parsePaginationParams } from "@serverpatterns/core";

const countries = ["Côte d'Ivoire", "Sénégal", "Mali", "Burkina Faso", "Togo", "Bénin"];

// Pour une petite liste déjà en mémoire
export const firstPage = paginateInMemory(countries, parsePaginationParams({ page: "1", pageSize: "4" }));
// → { items: [4 pays], page: 1, pageSize: 4, totalItems: 6, totalPages: 2, hasNextPage: true, hasPreviousPage: false }
