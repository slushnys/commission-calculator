module.exports = {
    env: {
        es2021: true,
        node: true,
    },
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        'plugin:import/errors',
        'plugin:import/warnings',
        'plugin:import/typescript',
        'plugin:prettier/recommended',
        'prettier',
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: '2021',
        sourceType: 'module',
        project: 'tsconfig.json',
    },
    plugins: ['@typescript-eslint', 'import'],
    settings: {
        'import/resolver': {
            typescript: {},
        },
        'import/external-module-folders': ['node_modules', 'typings'],
    },
    rules: {
        '@typescript-eslint/consistent-type-imports': 'error',
        'linebreak-style': ['error', 'unix'],
        'quote-props': [2, 'consistent-as-needed'],
        'import/no-cycle': ['error'],
        '@typescript-eslint/no-var-requires': 'off',
    },
    overrides: [
        {
            files: ['*.spec.ts'],
            rules: {
                '@typescript-eslint/consistent-type-imports': 'off',
            },
        },
    ],
}
