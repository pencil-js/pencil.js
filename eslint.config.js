import js from "@eslint/js";
import stylistic from "@stylistic/eslint-plugin";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
    {
        ignores: ["dist/", "coverage/", "docs/.vitepress/cache/", "docs/.vitepress/dist/", "docs/api/"],
    },
    js.configs.recommended,
    ...tseslint.configs.recommended,
    {
        languageOptions: {
            globals: {
                ...globals.browser,
            },
        },
        plugins: {
            "@stylistic": stylistic,
        },
        rules: {
            // Same flavor as v3 (@gmartigny/eslint-config)
            "@stylistic/indent": ["error", 4],
            "@stylistic/quotes": ["error", "double", { avoidEscape: true }],
            "@stylistic/semi": ["error", "always"],
            "@stylistic/comma-dangle": ["error", "always-multiline"],
            "@stylistic/space-before-function-paren": ["error", "always"],
            "@stylistic/brace-style": ["error", "stroustrup"],
            "@stylistic/object-curly-spacing": ["error", "always"],
            "@stylistic/arrow-parens": ["error", "as-needed", { requireForBlockBody: true }],
            "@stylistic/max-len": ["error", { code: 140, ignoreStrings: true, ignoreTemplateLiterals: true, ignoreComments: true }],
            "@stylistic/eol-last": "error",
            "@stylistic/no-trailing-spaces": "error",
            "@stylistic/member-delimiter-style": "error",
            "curly": "error",
            "eqeqeq": ["error", "always", { null: "ignore" }],
            "prefer-const": "error",
            "no-var": "error",
            "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_", varsIgnorePattern: "^_", destructuredArrayIgnorePattern: "^_" }],
            "@typescript-eslint/consistent-type-imports": "error",
            "@typescript-eslint/no-this-alias": "off",
        },
    },
    {
        files: ["**/*.test.ts", "test/**", "scripts/**", "*.config.*"],
        languageOptions: {
            globals: {
                ...globals.node,
            },
        },
        rules: {
            "@typescript-eslint/no-explicit-any": "off",
            "@typescript-eslint/no-non-null-assertion": "off",
        },
    },
);
