module.exports = {
    root: true,
    env: {
        jest: true,
    },
    extends: [
        'eslint-config-brophdawg11/configs/base',
        'eslint-config-brophdawg11/configs/vue',
    ],
    rules: {
    },
    overrides: [{
        files: ['test/e2e/**/*.js'],
        extends: ['plugin:cypress/recommended'],
        plugins: ['cypress'],
    }, {
        files: ['stories/**/*.js'],
        rules: {
            'max-len': ['error', { code: 120, ignoreUrls: true }],
            'import/no-extraneous-dependencies': 'off',
        },
    }],
};
