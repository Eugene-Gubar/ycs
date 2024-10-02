
export interface IStorageEstimate extends StorageEstimate {
    usageDetails: {
        indexedDB: number;
    }
}

export interface ICommentsFuseResult {
    item: ICommentItem;
    refIndex: number;
    score?: number;
}

export interface ICommentItem {
    commentRenderer: {
        authorEndpoint: unknown;
        authorIsChannelOwner: boolean;
        authorText: {
            simpleText: string;
        }
        authorThumbnail: {
            thumbnails: unknown;
        }
        commentId: string;
        contentText: {
            fullText: string;
            renderFullText: string;
            runs: unknown;
        }
        isTimeLine: 'timeline' | unknown;
        publishedTimeText: unknown;
    }
    typeComment: 'C' | 'R';
}

export interface IParamSearch {
    links?: boolean;
    likes?: boolean;
    members?: boolean;
    replied?: boolean;
    author?: boolean;
    heart?: boolean;
    verified?: boolean;
    donated?: boolean;
    random?: boolean;
    timestamp?: boolean;
    sortFirst?: boolean;
}

export type ISelectedSearch = 'comments' | 'chat' | 'video' | 'all';