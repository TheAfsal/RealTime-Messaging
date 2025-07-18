/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Project {
  pages: Array<{
    name: string;
    component: string | { html: string };
  }>;
}

export interface Page {
  getName: () => string;
  getMainComponent: () => Component;
}

export interface Component {
  components: () => ComponentCollection;
  append: (html: string) => void;
}

export interface ComponentCollection {
  reset: () => void;
  length: number;
}

export interface Editor {
  getSelected(): unknown;
  getWrapper(): unknown;
  Pages: {
    getAll: () => Page[];
  };
  runCommand: (command: string, options?: any) => any;
  onReady: (callback: () => void) => void;
  getSelected(): unknown;
}
