// Type declarations for non-TS assets imported as side-effects
// Allows imports like `import './index.css'` without TS errors
declare module "*.css";
declare module "*.scss";
declare module "*.sass";
declare module "*.less";
declare module "*.png";
declare module "*.jpg";
declare module "*.jpeg";
declare module "*.gif";
declare module "*.svg";

export {};
