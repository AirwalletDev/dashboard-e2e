function requireEnv(name: string): string {
    const value = process.env[name];
    if (!value) {
        throw new Error(`${name} environment variable is missing`);
    }
    return value;
}

export const testUsers = {
    logoutUser: {
        email: requireEnv('TEST_USER_EMAIL'),
        password: requireEnv('TEST_USER_PASSWORD'),
    },
};
