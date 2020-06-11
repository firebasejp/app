/// <reference types="next" />
/// <reference types="next/types/global" />

namespace NodeJS {
  interface Global {
    atob: Window.atob;
    btoa: Window.btoa;
  }
}

declare let global: NodeJS.Global;
