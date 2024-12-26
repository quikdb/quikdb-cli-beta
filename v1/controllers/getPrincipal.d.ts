export declare function getPrincipal(username: string): Promise<{
    status: boolean;
    data?: null;
} | {
    status: boolean;
    data: {
        principalId: string;
        seedPhrase: string;
    };
}>;
