export interface CountRequest {
  type: 'COUNT';
  payload: {
    count: number;
  };
}

export interface GreetingsResponse {
  message: string;
}

// Type definition for DOM elements
export interface GitHubElement extends HTMLElement {
  style: CSSStyleDeclaration;
} 