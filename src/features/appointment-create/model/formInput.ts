export const getMinVisitDate = () => new Date().toISOString().slice(0, 10);

export const normalizePhone = (value: string) => value.replace(/\D/g, "").slice(0, 12);

export const normalizeDuration = (value: string) => Number(value) || 15;
