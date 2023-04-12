export interface ChatMessage {
    id: number,
    message: string,
    createdBy: string,
    createdDate: Date,
    sentByMe: boolean,
    isDeleted: boolean
}