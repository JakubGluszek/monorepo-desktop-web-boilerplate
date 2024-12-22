interface ImportMetaEnv {
  readonly VITE_BACKEND_URL: string;
  readonly VITE_WEB_URL: string;
  readonly VITE_COMMIT_SHA: string | undefined;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
