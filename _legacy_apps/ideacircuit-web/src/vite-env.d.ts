/// <reference types="vite/client" />

declare module '@taskjuggler/ui' {
  // This module is resolved by Vite, TypeScript will trust the runtime resolution
  const content: any;
  export default content;
  export * from '../../taskjuggler/Code/shared-ui/src/index';
}
