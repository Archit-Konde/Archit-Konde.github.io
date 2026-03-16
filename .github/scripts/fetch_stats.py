#!/usr/bin/env python3
"""
Fetch GitHub contribution stats via GraphQL and write to github-stats.json.
Requires GH_TOKEN env var (PAT with read:user + public_repo scopes).
"""
import json
import os
import sys
import urllib.request
from datetime import datetime, timezone

TOKEN = os.environ.get("GH_TOKEN")
if not TOKEN:
    print("Error: GH_TOKEN not set", file=sys.stderr)
    sys.exit(1)

QUERY = """
{
  user(login: "Archit-Konde") {
    contributionsCollection {
      totalCommitContributions
      totalPullRequestContributions
      totalPullRequestReviewContributions
      totalIssueContributions
    }
  }
}
"""

payload = json.dumps({"query": QUERY}).encode()
req = urllib.request.Request(
    "https://api.github.com/graphql",
    data=payload,
    headers={
        "Authorization": f"Bearer {TOKEN}",
        "Content-Type": "application/json",
        "User-Agent": "archit-portfolio-stats/1.0",
    },
)

try:
    with urllib.request.urlopen(req) as resp:
        result = json.loads(resp.read().decode())
except Exception as e:
    print(f"Request failed: {e}", file=sys.stderr)
    sys.exit(1)

if "errors" in result:
    print(f"GraphQL error: {result['errors']}", file=sys.stderr)
    sys.exit(1)

c = result["data"]["user"]["contributionsCollection"]
commits  = c["totalCommitContributions"]
prs      = c["totalPullRequestContributions"]
reviews  = c["totalPullRequestReviewContributions"]
issues   = c["totalIssueContributions"]
total    = commits + prs + reviews + issues

def pct(n):
    return round(n / total * 100) if total > 0 else 0

stats = {
    "commits":      commits,
    "pullRequests": prs,
    "codeReviews":  reviews,
    "issues":       issues,
    "total":        total,
    "pct": {
        "commits":      pct(commits),
        "pullRequests": pct(prs),
        "codeReviews":  pct(reviews),
        "issues":       pct(issues),
    },
    "updatedAt": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
}

out = "Source Code/github-stats.json"
with open(out, "w") as f:
    json.dump(stats, f, indent=2)

print(f"✓ Stats written to {out}")
print(f"  commits={commits} PRs={prs} reviews={reviews} issues={issues} total={total}")
