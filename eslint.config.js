import tseslint from 'typescript-eslint';

export default tseslint.config(
    {
        ignores: ['node_modules/', 'playwright-report/', 'test-results/', 'tests/setup/.state/'],
    },
    ...tseslint.configs.recommended,
    {
        files: ['**/*.ts'],
        rules: {
            '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
            '@typescript-eslint/naming-convention': [
                'error',
                {
                    selector: ['method', 'function', 'variable', 'parameter'],
                    format: ['strictCamelCase'],
                    leadingUnderscore: 'allow',
                },
                {
                    selector: 'typeLike',
                    format: ['StrictPascalCase'],
                },
                {
                    selector: 'enumMember',
                    format: ['StrictPascalCase', 'UPPER_CASE'],
                },
            ],
        },
    }
);
