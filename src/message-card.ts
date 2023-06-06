export function createMessageCard(
  notificationSummary: string,
  notificationColor: string,
  commit: any,
  author: any,
  authorLogin: string,
  runNum: string,
  runId: string,
  repoName: string,
  sha: string,
  repoUrl: string,
  timestamp: string
): any {
  let avatar_url = 'https://avatars.githubusercontent.com/u/6343056?s=200&v=4';
  if (author) {
    if (author.avatar_url) {
      avatar_url = author.avatar_url;
    }
  }
  const messageCard = {
    '@type': 'MessageCard',
    '@context': 'https://schema.org/extensions',
    summary: notificationSummary,
    themeColor: notificationColor,
    title: notificationSummary,
    sections: [
      {
        activityTitle: `**CI #${runNum} (commit ${sha.substr(0, 7)})** on [${repoName}](${repoUrl})`,
        activityImage: avatar_url,
        activitySubtitle: `by ${commit.data.commit.author.name} [(@${authorLogin})](${author.html_url}) on ${timestamp}`,
      },
    ],
    potentialAction: [
      {
        '@context': 'http://schema.org',
        target: [`${repoUrl}/actions/runs/${runId}`],
        '@type': 'ViewAction',
        name: 'View Workflow Run',
      },
      {
        '@context': 'http://schema.org',
        target: [commit.data.html_url],
        '@type': 'ViewAction',
        name: 'View Commit Changes',
      },
    ],
  };
  return messageCard;
}
