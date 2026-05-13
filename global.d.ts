// Allow importing .css files
declare module "*.css";

// Extend globalThis with our message stream emitter
declare global {
  var __MESSAGE_STREAM:
    | {
        on: (jobId: string, cb: (msg: any) => void) => void;
        off: (jobId: string, cb: (msg: any) => void) => void;
        emit: (jobId: string, msg: any) => void;
      }
    | undefined;
}

// IMPORTANT: this MUST be at the bottom
export {};
