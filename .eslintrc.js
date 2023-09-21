module.exports = {
    env: {
        browser: true,
        es2021: true
    },
    overrides: [
        {
            files: ['*.ts'],
            parserOptions: {
                ecmaVersion: 'latest',
                project: ['tsconfig.json'],
                tsconfigRootDir: __dirname,
                sourceType: 'module',
                emitDecoratorMetadata: true
            },
            extends: [
                'plugin:@angular-eslint/recommended',
                'plugin:@angular-eslint/template/process-inline-templates',
                'standard-with-typescript',
                'prettier',
                'eslint:recommended',
                'plugin:@typescript-eslint/recommended',
                'plugin:@typescript-eslint/recommended-requiring-type-checking'
            ],
            rules: {
                semi: 'off',
                'padded-blocks': 'error',
                'no-multiple-empty-lines': [2, { max: 99999, maxEOF: 0 }],
                '@typescript-eslint/semi': ['error', 'always'],
                '@typescript-eslint/consistent-type-imports': 'off',
                '@typescript-eslint/strict-boolean-expressions': 'off',
                '@typescript-eslint/unbound-method': 'off',
                '@typescript-eslint/no-confusing-void-expression': 'off',
                '@typescript-eslint/no-extraneous-class': 'off',
                '@typescript-eslint/member-delimiter-style': [
                    'error',
                    {
                        multiline: {
                            delimiter: 'semi', // 'none' or 'semi' or 'comma'
                            requireLast: true
                        },
                        singleline: {
                            delimiter: 'semi', // 'semi' or 'comma'
                            requireLast: false
                        }
                    }
                ],
                // Allow action namespace grouping
                '@typescript-eslint/no-namespace': 'off',
                '@angular-eslint/directive-selector': [
                    'error',
                    {
                        type: 'attribute',
                        prefix: 'teq',
                        style: 'camelCase'
                    }
                ],
                '@angular-eslint/component-selector': [
                    'error',
                    {
                        type: 'element',
                        prefix: 'teq',
                        style: 'kebab-case'
                    }
                ]
                // 'import/order': [
                //     'error',
                //     {
                //         pathGroups: [
                //             {
                //                 pattern: '@teq/**/*',
                //                 group: 'sibling',
                //                 position: 'before'
                //             },
                //             {
                //                 pattern: 'environments/*',
                //                 group: 'sibling',
                //                 position: 'before'
                //             }
                //         ],
                //         groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'object'],
                //         alphabetize: {
                //             order: 'asc',
                //             caseInsensitive: true
                //         },
                //         distinctGroup: true,
                //         'newlines-between': 'always'
                //     }
                // ],
                // '@typescript-eslint/consistent-type-exports': ['error'],
                // '@typescript-eslint/consistent-type-imports': [
                //     'error',
                //     {
                //         fixStyle: 'separate-type-imports'
                //     }
                // ]
            }
        },
        {
            files: ['*.actions.ts'],
            rules: {
                '@typescript-eslint/no-useless-constructor': 'off',
                '@typescript-eslint/no-empty-function': 'off',
                'n/handle-callback-err': 'off'
            }
        },
        {
            files: ['*.html'],
            extends: ['plugin:@angular-eslint/template/recommended'],
            rules: {}
        }
    ]
};
