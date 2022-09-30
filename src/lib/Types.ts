export interface Account {
    id: string,
    githubId: string,
    name: string,
    admin: boolean,
    image: string
}

export interface Repository {
    id: string;
    repository_id: string;
    name: string;
    owner: string;
    ownerHtmlUrl: string;
    ownerAvatarUrl: string;
    url: string;
    description?: string;
    stars: number;
    openIssues: number;
    sponsored: boolean;
    sponsor?: string;
}

export type Left<T> = {
    left: T;
    right?: never;
};

export type Right<U> = {
    left?: never;
    right: U;
};

export type Either<T, U> = NonNullable<Left<T> | Right<U>>;