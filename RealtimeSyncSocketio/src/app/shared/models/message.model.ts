export interface Message {
      id: string;
      message: string;
}

export interface User {
      id: string;
      name: string;
      messages: Message[];
}