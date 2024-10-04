export interface SimpleUser {
    username: string;
    avatar: string;
}


export interface SimpleSponsor {
    name: string;
    image_url: string;
}

export interface User extends SimpleUser {
    id: string;
    github_id: number;
    name: string;
    email: string;
    admin: boolean;
}

export interface Sponsor extends SimpleSponsor {
    id: string,
    summary: string,
    links: SponsorLink[]
}

export interface SponsorLink {
    sponsor_id: string;
    name: string;
    value: string
}


export interface Language {
    name: string;
    color: string | null | undefined;
}

export interface BaseRepository {
    repository_id: string;
    name: string;
    owner: string;
    ownerHtmlUrl: string;
    ownerAvatarUrl: string;
    url: string;
    description?: string | null;
    stars: number;
    openIssues: number;
    updatedAt: number;
    language?: Language | null | undefined;
    license?: string | null | undefined;
    tags: string[]
}

export interface Repository extends BaseRepository {
    id: string;
    sponsored: boolean;
    sponsor?: string | null;
}

export interface DisplayRepository extends BaseRepository {
    sponsor?: SimpleSponsor
}

export interface AdminRepository extends BaseRepository {
    id: string;
    sponsored: boolean;
    sponsor?: string | null;
    invalid: boolean
    reason?: string | null
    reviewedBy?: SimpleUser | null
    submitter?: SimpleUser | null
}

export interface PullRequest {
    pr_id: number;
    author: string;
    created_at: number;
    html_url: string;
    merged: boolean;
    number: number;
    owner: string;
    owner_avatar_url: string;
    repo_name: string;
    title: string;
    state: string;
    reviewed: boolean;
    invalid?: boolean | null;
    reason?: string | null;
    reviewedBy?: SimpleUser | null
}

export interface PRGroups {
    [key: string]: PRGroup
}

export interface PRGroup {
    owner: string
    name: string
    avatar: string
    prs: PullRequest[]
}

export interface RepoGroups<T extends BaseRepository> {
    [key: string]: RepoGroup<T>
}

export interface RepoGroup<T> {
    name: string
    url: string
    avatar: string
    repos: T[]
}

export type SubmittingRepo = BaseRepository & { submitted: boolean, sponsor?: string, submitter?: string, reviewed?: boolean, reason?: string, invalid?: boolean };

export interface Reward {
    id?: string
    title: string
    summary: string
    description: string
    redeem_info?: string | null
    logo_url: string
    banner_url: string
    digital: boolean
    sponsor: SimpleSponsor
    required_prs: number
    digitalRewardCode?: DigitalRewardCode
    physicalRewardClaim?: PhysicalRewardClaim
}

export interface DigitalReward extends Reward {
    digital: true,
    physicalRewardClaim: never
}

export interface PhysicalReward extends Reward {
    digital: false
    digitalRewardCode: never
}

export interface DigitalRewardCode {
    id?: string
    code: string
}

export interface PhysicalRewardClaim {
    id?: string
    reward_id: string
    claimer_github_id?: string
    firstName: string
    lastName: string
    address1: string
    address2?: string | null
    city: string
    zip: string
    state: string
    country: string
    email: string
    phoneNumber?: string | null
}

export interface AdminDigitalRewardCode {
    id: string,
    code: string,
    reward_name:string
    reward_logo:string
    sponsor_name: string,
    sponsor_image: string,
    claimer_name?: string,
    claimer_image?: string
}