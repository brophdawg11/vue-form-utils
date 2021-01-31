module.exports = {
    "hooks": {
        "pre-commit": "npm run lint && npm run test",
        "pre-push": "npm run lint && npm run test && npm run storybook:build && npm run e2e",
    },
};
