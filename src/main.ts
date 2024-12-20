import * as core from '@actions/core';
import { Octokit } from '@octokit/rest';
import axios from 'axios';
import moment from 'moment-timezone';
import { createMessageCard } from './message-card';

async function run(): Promise<void> {
  try {
    const githubToken = core.getInput('github-token', { required: true });
    const msTeamsWebhookUri: string = core.getInput('ms-teams-webhook-uri', {
      required: false,
    });
    const workflowWebhookUri: string = core.getInput('workflow-teams-webhook-uri', { required: false });

    const notificationSummary = core.getInput('notification-summary') || 'GitHub Action Notification';
    const notificationColor = core.getInput('notification-color') || '';
    const notificationColorWorkflow = core.getInput('notification-color-workflow') || ''
    const timezone = core.getInput('timezone') || 'America/Sao_Paulo';

    const timestamp = moment().tz(timezone).format('dddd, MMMM Do YYYY, h:mm:ss a z');

    const [owner, repo] = (process.env.GITHUB_REPOSITORY || '').split('/');
    const sha = process.env.GITHUB_SHA || '';
    const runId = process.env.GITHUB_RUN_ID || '';
    const runNum = process.env.GITHUB_RUN_NUMBER || '';
    const params = { owner, repo, ref: sha };
    const repoName = params.owner + '/' + params.repo;
    const repoUrl = `https://github.com/${repoName}`;

    const octokit = new Octokit({ auth: `token ${githubToken}` });
    const commit = await octokit.repos.getCommit(params);
    const html_url = commit.data.html_url;
    const author = commit.data.author;
    const authorLogin = author ? author.login : 'None';

    const messageCard = await createMessageCard(
      notificationSummary,
      !notificationColor ? notificationColorWorkflow : notificationColor,
      commit,
      html_url,
      author,
      authorLogin,
      runNum,
      runId,
      repoName,
      sha,
      repoUrl,
      timestamp,
      workflowWebhookUri
    );

    console.log(messageCard);

    if(!msTeamsWebhookUri){
      axios
      .post(workflowWebhookUri, {"type": "message", "attachments": [messageCard]})
      .then(function (response) {
        console.log(response);
        core.debug(response.data);
      })
      .catch(function (error) {
        core.debug(error);
      });
    }
    else{
      axios
      .post(msTeamsWebhookUri, messageCard)
      .then(function (response) {
        console.log(response);
        core.debug(response.data);
      })
      .catch(function (error) {
        core.debug(error);
      });
    }
  } catch (error) {
    console.log(error);
    core.setFailed(error.message);
  }
}

run();
