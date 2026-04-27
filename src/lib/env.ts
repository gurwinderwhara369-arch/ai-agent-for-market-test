function clean(value: string | undefined) {
  return value?.trim() || "";
}

export const env = {
  geminiApiKey: clean(process.env.GEMINI_API_KEY),
  geminiModel: clean(process.env.GEMINI_MODEL) || "gemini-1.5-flash",
  metaGraphVersion: clean(process.env.META_GRAPH_VERSION) || "v24.0",
  webhookVerifyToken: clean(process.env.WEBHOOK_VERIFY_TOKEN),
  igAppId: clean(process.env.IG_APP_ID),
  igAppSecret: clean(process.env.IG_APP_SECRET),
};
