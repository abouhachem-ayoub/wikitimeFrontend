interface ImportMetaEnv {
    readonly VITE_NEXTAUTH_SECRET: string;
    readonly VITE_REALM: string;
    readonly VITE_CLIENT_ID: string;
   
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
  