export const whitelist: string[] = [];
if (process.env.CORS_WHITELIST) {
  process.env.CORS_WHITELIST.split(',').forEach((url: string) => {
    whitelist.push(url);
  });
}

console.info(`[cors] whitelist: ${JSON.stringify(whitelist, null, 2)}`);

export const corsOptions = {
  origin: whitelist
};