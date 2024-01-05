import { Block, KnownBlock } from "@slack/types";
import { SummaryResults } from "playwright-slack-report/dist/src";

import fs from 'fs';


export async function generateCustomLayoutAsync (summaryResults: SummaryResults): Promise<Array<KnownBlock | Block>> {
  const { tests } = summaryResults;
  // create your custom slack blocks
  var o11yUrl = 'https://observability.browserstack.com/builds/' + process.env.BS_TESTOPS_BUILD_HASHED_ID;

  //const full: Array<KnownBlock | Block> = [];
  // const blockArray = updateJson();
  // for (const s of blockArray) {
  //   full.push(s);
  // }

  const full = {
    type: "section",
			text: {
				type: "mrkdwn",
				text: "Hey <@U054WRULLJH>, see the details of your tests below. You can check the Observability dashboard by clicking the button to the right"
			},
			accessory: {
				type: "button",
				text: {
					type: "plain_text",
					text: "O11Y Dashboard",
					emoji: true
				},
				value: "click_me_123",
				url: o11yUrl,
				action_id: "button-action"
			}
  }

  const header = {
    type: "header",
    text: {
      type: "plain_text",
      text: "🎭 Playwright E2E Test Results",
      emoji: true,
    },
  };

  const fails: Array<KnownBlock | Block> = [];

  for (const t of tests) {
    // These are the main values we can get from the test in Playwright
    let browser = t.browser?.charAt(0).toUpperCase() + t.browser?.slice(1);
    let suiteName = t.suiteName.replace(/\W/gi, "-");
    let status = t.status.charAt(0).toUpperCase() + t.status.slice(1);
    let reason = t.reason;
    let name = t.name;

    // These loops will add different data based on the status of the individual tests.
    if (t.status === "failed" || t.status === "timedOut") {
      fails.push({
        type: "section",
        text: {
          type: "mrkdwn",
          // text: ":x: -  " + browser + " - " + suiteName /**+ "\n\n```" + reason + "```"*/,
          text: `*Test Case Name:*  ${name} \n\n\n:x: - *Status:* ${status} \n\n:notebook_with_decorative_cover: - *File Name:* ${suiteName} \n\n:globe_with_meridians: - *Browser:* ${browser} \n\n:toolbox: - *Stacktrace:*\n\n` + "```" + reason + "```" + "\n\n",
        }
      },
      {
        type: "divider"
      });
    } else if (t.status === "passed") {
      fails.push({
        type: "section",
        text: {
          type: "mrkdwn",
          // text: `:white_check_mark: -  *${browser} | -  ${suiteName}*  - | - ${status}`,
          text: `*Test Case Name:*  ${name} \n\n\n:white_check_mark: - *Status:* ${status} \n\n:notebook_with_decorative_cover: - *File Name:* ${suiteName} \n\n:globe_with_meridians: - *Browser:* ${browser}`,
        }
      }, {
        type: "divider"
      });
    }
  }

  return [header, { type: "divider" }, full, ...fails]
}
