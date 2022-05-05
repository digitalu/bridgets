export const errorStatus = { 'Bad Request': 400, Unauthorized: 401, 'Not Found': 404, 'Unprocessable entity': 422 } as const;

export type ErrorStatus = typeof errorStatus;
