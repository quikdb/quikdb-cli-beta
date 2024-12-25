export declare function createPrincipal(username: string): Promise<{
    status: boolean;
    seedPhrase?: undefined;
} | {
    status: boolean;
    seedPhrase: string;
}>;