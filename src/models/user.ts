import { Schema, model, Types } from "mongoose";

export type UserRole = 'user' | 'verified' | 'developer' | 'moderator' | 'admin';

export interface UserSchema {
    id: string
    name: string
    created: number
    roles: UserRole[]
    suspended: boolean
    twitchUser: {
        login: string
        displayName: string
        type: string
        broadcasterType: string
        description: string
        profileImageUrl: string
        offlineImageUrl: string
        viewCount: number
        email: string
        createdAt: number
    }
    oauth: {
        accessToken: string
        refreshToken: string
        expiryDate: number
    }
}

const schema = new Schema<UserSchema>({
    id: { type: String, required: true },
    name: { type: String, required: true },
    created: { type: Number, required: true, default: Date.now },
    roles: [{ type: String, enum: ['user', 'verified', 'developer', 'moderator', 'admin'] }],
    suspended: { type: Boolean, required: true, default: false },
    twitchUser: {
        type: {
            profileImageUrl: { type: String, required: true },
            displayName: { type: String, required: true },
            type: { type: String, required: true },
            broadcasterType: { type: String, required: true },
            description: { type: String, required: true },
            profileImageUrl: { type: String, required: true },
            offlineImageUrl: { type: String, required: true },
            viewCount: { type: Number, required: true },
            email: { type: String, required: true },
            createdAt: { type: Number, required: true }
        },
        required: true
    },
    oauth: {
        type: {
            accessToken: { type: String, required: true },
            refreshToken: { type: String, required: true },
            expiryDate: { type: Number, required: true }
        },
        required: true
    }
});

export const UserModel = model<UserSchema>('User', schema);
