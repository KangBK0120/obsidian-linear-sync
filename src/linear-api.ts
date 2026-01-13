import { requestUrl } from "obsidian";

export interface LinearIssue {
  id: string;
  identifier: string;
  title: string;
  description: string | null;
  url: string;
  createdAt: string;
}

export class LinearApiClient {
  private getApiKey: () => string;
  private readonly endpoint = "https://api.linear.app/graphql";

  constructor(getApiKey: () => string) {
    this.getApiKey = getApiKey;
  }

  private async query<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
    const response = await requestUrl({
      url: this.endpoint,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: this.getApiKey(),
      },
      body: JSON.stringify({ query, variables }),
    });

    if (response.status !== 200) {
      throw new Error(`Linear API error: ${response.status}`);
    }

    const data = response.json;
    if (data.errors) {
      throw new Error(`Linear GraphQL error: ${data.errors[0].message}`);
    }

    return data.data;
  }

  async fetchAssignedIssues(): Promise<LinearIssue[]> {
    const data = await this.query<{
      viewer: {
        assignedIssues: {
          nodes: LinearIssue[];
        };
      };
    }>(`
      query {
        viewer {
          assignedIssues(
            orderBy: createdAt
          ) {
            nodes {
              id
              identifier
              title
              description
              url
              createdAt
            }
          }
        }
      }
    `);

    // Sort by createdAt descending (newest first)
    return data.viewer.assignedIssues.nodes.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getIssue(id: string): Promise<LinearIssue | null> {
    const data = await this.query<{
      issue: LinearIssue | null;
    }>(
      `
      query GetIssue($id: String!) {
        issue(id: $id) {
          id
          identifier
          title
          description
          url
        }
      }
    `,
      { id }
    );

    return data.issue;
  }

  async getIssueByIdentifier(identifier: string): Promise<LinearIssue | null> {
    try {
      const data = await this.query<{
        issue: LinearIssue | null;
      }>(
        `
        query GetIssueByIdentifier($identifier: String!) {
          issue(id: $identifier) {
            id
            identifier
            title
            description
            url
          }
        }
      `,
        { identifier }
      );

      return data.issue;
    } catch {
      return null;
    }
  }

  async updateIssueDescription(id: string, description: string): Promise<void> {
    await this.query(
      `
      mutation UpdateIssue($id: String!, $description: String!) {
        issueUpdate(id: $id, input: { description: $description }) {
          success
        }
      }
    `,
      { id, description }
    );
  }
}
