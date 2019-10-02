import fetch from "node-fetch";
import { captureException } from "@sentry/node";
import urlJoin from "url-join";

import {
  GITHUB_USERNAME,
  GITHUB_PASSWORD,
  REPO_OWNER,
  REPO_NAME
} from "../constants";
import * as base64 from "../utils/base64";

type PostCommentOptions = {
  issueNumber: string;
  content: string;
};

export default async function postComment(options: PostCommentOptions) {
  try {
    let headers = {
      Authorization:
        "Basic " + base64.encode(GITHUB_USERNAME + ":" + GITHUB_PASSWORD)
    };

    let url = urlJoin(
      "https://api.github.com/repos",
      REPO_OWNER,
      REPO_NAME,
      "issues",
      options.issueNumber,
      "comments"
    );

    let body = {
      body: options.content
    };

    await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(body)
    });
  } catch (e) {
    captureException(e);

    // DO NOT LEAK ANY SECRETS HERE!
    throw new Error(
      `An error occured with postComment, posting to ${options.issueNumber}`
    );
  }
}