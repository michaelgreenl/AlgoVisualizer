module.exports = {
    root: true,
    env: {
        browser: true,
        es2021: true,
        node: true,
    },
    extends: [
        'plugin:nuxt/recommended',
        'plugin:vue/vue3-essential',
        'plugin:vue/vue3-recommended',
        'eslint:recommended',
        '@vue/eslint-config-prettier',
        // '@nuxtjs',
        'prettier',
    ],
    plugins: ['vue'],
    // parser: 'vue-eslint-parser',
    parserOptions: {
        ecmaVersion: 'latest',
        parser: '@babel/eslint-parser',
        sourceType: 'module',
    },
    rules: {
        // Only allow debugger in development
        // 'selector-max-type': 2,
        'no-undef': 'off',
        'no-debugger': process.env.PRE_COMMIT ? 'error' : 'warn',
        'no-console': 'off',
        'max-len': 0,
        // Allow object properties to be reassigned.
        'no-param-reassign': ['error', { props: false }],
        // Disable global-require to allow for dynamic image imports
        'global-require': 'off',
        // Disable underscore dangle restriction
        'no-underscore-dangle': 'off',
        // Disable prefer-destructuring for arrays only
        'prefer-destructuring': ['error', { object: true, array: false }],
        // Allow for-of statements. Only way to do this is to change the default Airbnb rules,
        // so this just disallows for-in statements.
        'no-restricted-syntax': [
            'error',
            {
                selector: 'ForInStatement',
                message:
                    'for..in loops iterate over the entire prototype chain, which is virtually never what you want. Use Object.{keys,values,entries}, and iterate over the resulting array.',
            },
        ],

        // Vue rules (mostly to enforce airbnb in <template>)
        // 'vue/no-unused-components': process.env.PRE_COMMIT ? 'error' : 'warn',
        // 'vue/no-unused-vars': 'warn',
        // 'vue/array-bracket-spacing': 'error',

        'vue/arrow-spacing': 'error',
        // 'vue/block-spacing': 'error',
        // 'vue/brace-style': 'error',
        // 'vue/camelcase': 'error',
        // 'vue/component-name-in-template-casing': 'error',
        // // 'vue/dot-location': ['error', 'property'],
        'vue/eqeqeq': 'error',
        'vue/no-unused-components': 'warn',
        // 'vue/key-spacing': 'error',
        // 'vue/keyword-spacing': 'error',
        'vue/multi-word-component-names': 'off',
        'vue/attribute-hyphenation': 'off',
        'vue/v-on-event-hyphenation': 'off',
        // 'vue/no-empty-pattern': 'error',
        // 'vue/no-boolean-default': ['error', 'default-false'],
        // 'vue/no-irregular-whitespace': 'error',
        // 'vue/no-reserved-component-names': 'error',
        // 'vue/no-deprecated-scope-attribute': 'error',
        // 'vue/object-curly-spacing': ['error', 'always'],
        // 'vue/padding-line-between-blocks': 'error',
        // // 'vue/space-infix-ops': 'error',
        // // 'vue/space-unary-ops': 'error',
        // 'vue/v-on-function-call': 'error',
        // 'vue/valid-v-slot': 'error',

        // No way to override these in Prettier, so change Airbnb rules
        'function-paren-newline': 'off',
        'implicit-arrow-linebreak': 'off',
        'no-confusing-arrow': 'off',
        'newline-per-chained-call': 'off',
        'object-curly-newline': 'off',
        'operator-linebreak': [
            'error',
            'after',
            {
                overrides: {
                    '?': 'before',
                    ':': 'before',
                },
            },
        ],
        'wrap-iife': 'off',
    },
};
