export const parsePaginate = (q) => ({
    page: Math.max(1, parseInt(q.page || 1)),
    limit: Math.max(1, Math.min(100, parseInt(q.limit || 10))),
});