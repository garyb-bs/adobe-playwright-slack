const base = require('@playwright/test');
const cp = require('child_process');
const clientPlaywrightVersion = cp
    .execSync('npx playwright --version')
    .toString()
    .trim()
    .split(' ')[1];

exports.test = base.test.extend({
    page: async ({ page, playwright }, use, testInfo) => {
        use(page);
    },
});