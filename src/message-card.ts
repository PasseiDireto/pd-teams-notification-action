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
  timestamp: string,
  workflowWebhook: string
): any {
  let messageCard
  let avatar_url = 'https://avatars.githubusercontent.com/u/6343056?s=200&v=4';
  if (author) {
    if (author.avatar_url) {
      avatar_url = author.avatar_url;
    }
  }
  if(!workflowWebhook){
    messageCard = {
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
  }
  else{
    messageCard = {
      "contentType": "application/vnd.microsoft.card.adaptive",
      "content": {
        "type": "AdaptiveCard",
        "version": "1.2",
        "body": [
          {
            "type": "ColumnSet",
            "columns": [
              {
                "type": "Column",
                "width": "auto",
                "items": [
                  {
                    "type": "Image",
                    "url": avatar_url,
                    "size": "small"
                  }
                ]
              },
              {
                "type": "Column",
                "width": "*",
                "items": [
                  {
                    "type": "TextBlock",
                    "text": notificationSummary,
                    "wrap": true,
                    "color": notificationColor
                  },
                  {
                    "type": "TextBlock",
                    "text": `CI #${runNum} (commit ${sha.substr(0, 7)}) on [${repoName}](${repoUrl})`,
                    "wrap": true
                  },
                  {
                    "type": "TextBlock",
                    "text": `by ${commit.data.commit.author.name} [(@${authorLogin})](${author.html_url}) on ${timestamp}`,
                    "wrap": true
                  }
                ]
              }
            ]            
          }
        ],
        "actions": [
          {
            "type": "ACtion.OpenUrl",
            "title": "View Workflow Run",
            "url": `${repoUrl}/actions/runs/${runId}`
          },
          {
            "type": "Action.OpenUrl",
            "title": "View Commit Changes",
            "url": commit.data.html_url
          }
        ]
      }
    }
  }
  
  return messageCard;
}
