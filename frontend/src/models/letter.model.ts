export interface Letter {
  _id?: string;
  message: string;
  sentDate?: Date;
  receivedDate?: Date;
}

export interface LetterResponseData {
  msg: string;
  letters: Letter[];
}
