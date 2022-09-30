import { useEffect, useState } from "react";

export interface Props {
    date: number;
}

interface RenderProps {
    days: string;
    hours: string;
    minutes: string;
    seconds: string;
    completed: boolean;
}

function pad(date: number): string {
    if (date < 10) {
        return `0${date}`;
    }
    return String(date);
}

function timeUntil(date: number): RenderProps {
    const total = date - new Date().getTime();
    const seconds = Math.floor(total / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    return {
        seconds: pad(seconds % 60),
        minutes: pad(minutes % 60),
        hours: pad(hours % 24),
        days: pad(days),
        completed: total <= 0
    };
}

function pluralize(thing: string, value: string) {
    return `${value} ${thing + (thing !== "01" ? "s" : "")}`;
}

export default function Timer(props: Props) {
    const [timer, setTimer] = useState<RenderProps>(timeUntil(props.date));

    useEffect(() => {
        const updater = setInterval(() => {
            setTimer(timeUntil(props.date));
            if (timer.completed) {
                clearInterval(updater);
            }
        }, 1000);
        return () => {
            clearInterval(updater);
        };
    });

    return (
        <div className = "flex flex-col text-6xl text-center">
            <span className = "mb-4">
                Event starts in
            </span>
            <div className = "flex flex-col md:flex-row gap-2 justify-items-center mx-auto text-4xl text-center">
                <p className = "pb-2 md:pb-0 md:pr-2 border-b md:border-b-0 md:border-r days">{pluralize("day", timer.days)}</p>
                <p className = "pb-2 md:pb-0 md:pr-2 border-b md:border-b-0 md:border-r hours">{pluralize("hour", timer.hours)}</p>
                <p className = "pb-2 md:pb-0 md:pr-2 border-b md:border-b-0 md:border-r minutes">{pluralize("minute", timer.minutes)}</p>
                <p className = "seconds">{pluralize("second", timer.seconds)}</p>
            </div>
        </div>
    );

}
