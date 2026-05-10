---
name: "problem-tracker"
description: "Tracks problems and their solutions, matches similar issues when new problems occur to avoid repeating mistakes. Invoke when user reports an issue or wants to check historical solutions."
---

# Problem Tracker

## Overview

This skill helps track development problems and their solutions. When users encounter issues, it can search for similar historical problems and provide reference solutions to avoid repeating mistakes.

## Features

### 1. Record Problems
Capture detailed information about issues including:
- **Title**: Brief summary of the problem
- **Description**: Detailed explanation of the issue
- **Context**: Environment/scenario where the problem occurred
- **Solution**: How the problem was resolved
- **Tags**: Categories for easy classification

### 2. Smart Matching
When a new problem is reported, the system automatically finds similar historical issues using Jaccard similarity algorithm, sorted by relevance.

### 3. Search & Filter
- Keyword search across all fields
- Tag-based filtering
- Real-time search results

## Usage

### Recording a Problem

When a user reports an issue, first check if similar problems exist:

```javascript
// Check for similar problems
const matches = problemTracker.findSimilarProblems("TypeError: Cannot read properties of null");

if (matches.length > 0) {
  // Show matching solutions
  const bestMatch = matches[0];
  console.log(`Found similar issue: ${bestMatch.title}`);
  console.log(`Solution: ${bestMatch.solution}`);
} else {
  // Record new problem
  problemTracker.addProblem({
    title: "TypeError: Cannot read properties of null",
    description: "Error when accessing properties of null object",
    context: "JavaScript runtime",
    solution: "",
    tags: ["JavaScript", "Error"]
  });
}
```

### Adding a Solution

After resolving a problem, update the record:

```javascript
problemTracker.updateProblem(problemId, {
  solution: "Check if element exists before accessing properties"
});
```

## Trigger Conditions

Invoke this skill when:
- User reports a bug or error
- User describes a technical problem
- Before implementing a fix, check for similar past issues
- User wants to review historical problem solutions
- Debugging and need to check if similar issues were resolved

## Data Structure

```javascript
{
  id: "timestamp",
  title: "Problem title",
  description: "Detailed description",
  context: "Environment/scenario",
  solution: "Solution text",
  tags: ["tag1", "tag2"],
  createdAt: "ISO timestamp",
  updatedAt: "ISO timestamp"
}
```

## Example Workflow

1. **User reports**: "I'm getting 'Cannot read properties of null' error"
2. **Skill action**: Search for similar problems in database
3. **Result**: Found 2 similar issues
4. **Response**: Show matching solutions and ask if applicable
5. **If applicable**: User applies the solution
6. **If not applicable**: Record as new problem, await solution

## Benefits

- Prevent duplicate problem-solving efforts
- Build institutional knowledge over time
- Quick access to proven solutions
- Reduce debugging time for recurring issues