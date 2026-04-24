/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_NEXUS_API_KEY: string
  // mais variáveis de ambiente...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
