import {type ActionErrorCode, ActionError} from 'astro:actions';
import type {User} from "lucia";


export function isUserAdmin(user: User | null): user is User {
    if (user && "admin" in user) {
        return user.admin as boolean
    }
    return false;
}

export const formatDate = (date: number) => {
    const rtf1 = new Intl.RelativeTimeFormat('en', {style: 'short'});
    const deltaSeconds = Math.round((date - Date.now()) / 1000);
    const cutoffs = [60, 3600, 86400, 86400 * 7, 86400 * 30, 86400 * 365, Infinity];

    const units: Intl.RelativeTimeFormatUnit[] = ["second", "minute", "hour", "day", "week", "month", "year"];
    const unitIndex = cutoffs.findIndex(cutoff => cutoff > Math.abs(deltaSeconds));
    const divisor = unitIndex ? cutoffs[unitIndex - 1] : 1;
    return rtf1.format(Math.floor(deltaSeconds / divisor), units[unitIndex])
}

export function shuffleArray(array: any[]) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

export function errorIf(test: boolean, code: ActionErrorCode, message: string) {

    if(test) {
        throw new ActionError({code, message})
    }

}

export function require<T>(thing: T | null | undefined, code: ActionErrorCode, message: string): T {
    if(!thing) {
        throw new ActionError({code, message})
    }
    return thing;
}

export function check<T>(thing: T, precondition: (t: T) => boolean, code: ActionErrorCode, message: string): T {
    if(!precondition(thing)) {
        throw new ActionError({code, message})
    }
    return thing;
}