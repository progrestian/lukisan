export interface Config {
    fetchers: string[],
    manager: string
}

export interface Secret {
    deviantart?: DeviantArtSecret
}

export interface DeviantArtSecret {
    id: string,
    secret: string
}

export abstract class Fetcher {
    constructor(protected localdir: string) {}
    abstract fetch(secret: Secret): Promise<void>
}

export abstract class Manager {
    constructor(protected localdir: string) {}
    abstract next(): void
    abstract prev(): void
}