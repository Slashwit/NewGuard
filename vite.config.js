import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
    build: {
        rollupOptions: {
        
          output: {
           
            assetFileNames: ({name}) => {
              if (/\.(gif|jpe?g|png|svg)$/.test(name ?? '')){
                  return 'assets/textures/[name]-[hash][extname]';
              }
              
              
     
              // default value
              // ref: https://rollupjs.org/guide/en/#outputassetfilenames
              return 'assets/[name]-[hash][extname]';
            },
          },
        }
      },
})