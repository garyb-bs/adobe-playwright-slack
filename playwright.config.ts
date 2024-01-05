import { generateCustomLayoutAsync } from "./tests/utils/generateCustomSlackMessage";
// This is a sample config for what users might be running locally
const config = {
  testDir: './tests',
  testMatch: '**/bstack_test*.js',

  /* Maximum time one test can run for. */
  timeout: 90 * 1000,
  expect: {
    /**
     * Maximum time expect() should wait for the condition to be met.
     * For example in `await expect(locator).toHaveText();`
     */
    timeout: 5000,
  },
  /* tests in parallel */
  workers: 1,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  // reporter: 'line',
  reporter: [
    [
      // This sections sets up the Playwright Slack Reporter. You can add others as needed below this.
      "./node_modules/playwright-slack-report/dist/src/SlackReporter.js",
      {
        channels: ["api-testing"], // provide one or more Slack channels that you want the messages to go to
        sendResults: "always", // possible values include "always" , "on-failure", "off"
        // This will be the same name as the function in the utility class.
        layoutAsync: generateCustomLayoutAsync,
        // Replace this with your specific OAUTH token
        slackOAuthToken: 'xoxb-5169823558642-6192591548086-3w0q8Qroe3OuysxzM44dp5AB',
        // This will show all of the errors in the replies to the message rather than cluttering up the main message.
        showInThread: true
      }
    ]
  ],
  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chrome',
      use: {
        browserName: 'chromium',
        channel: 'chrome',
      },
    },
  ],
};

module.exports = config;
