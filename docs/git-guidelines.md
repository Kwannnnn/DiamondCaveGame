# Git Guidelines (*DHI2V.So1*)

This document contains detailed instructions and clarifications concerning the
git repository workflow for the team.

## 1. Naming conventions

This section contains the list of conventions that the team has aggreed uppon
to follow during the course of this project.

### 1.1. Backlog items

#### 1.1.1. User Story Backlogs

```text
USxx-BIxx: BACKLOG_TITLE
US37-BI01: This is an example backlog item
```

#### 1.1.2. Problem Backlogs

Problem backlogs represent known issues/bugs with the existing code base. The
format for those backlogs is:

```text
PBxx: Problem Description
PB37: This is an example problem backlog
```

### 1.2. Branches

Branches concerning backlogs must follow the standard branch naming convention
of GitLab.

```text
<GITLAB_ISSUE_NUMBER>-<usxx>-<bixx>-<BACKLOG_TITLE>
42-us37-bi01-this-is-an-example-backlog-item
```

### 1.3. Commit messages

All commit messages must follow the
[Conventional commits](https://www.conventionalcommits.org/en/v1.0.0/)
specification.

```text
<type>[optional scope]: <description>

feat(frontend): created Button component
docs(readme): fixed typo in README.md
fix: user unable to submit form
```

## 2. Branches

This section describes the official branches involved in the project management
and and their access level.

<table>
<tr>
    <th>Branch</th>
    <th>Merge access</th>
    <th>Push access</th>
    <th>Force push</th>
    <th>Remark</th>
</tr>
<tr>
    <td>main (default)</td>
    <td>Maintainer</td>
    <td>Maintainer</td>
    <td>No</td>
    <td>The default branch of the repository, containing a stable version of
    the game.</td>
</tr>
<tr>
    <td>week[nr]</td>
    <td>Developer</td>
    <td>Maintainer</td>
    <td>No</td>
    <td>A weekly branch containing all the implemented backlogs of a certain
    work week. A new weekly branch is created for each work week.</td>
</tr>
</table>

## 3. GitLab Labels

### 3.1. Scrum board Categories

#### 3.1. 🟦 In progress

A category used to indicate backlog items that have been assigned to a
developer and are currently being developed.

#### 3.2. 🟥 Testing

A category that indicates backlog items that have been developed and are about
to be tested by a tester.

#### 3.3. 🟧 Known issues

A category for backlog items (a.k.a. Problem backlogs) that represent known
issues/bugs in the existing code base.

### 3.2. Backlog item Labels

#### 3.4. Team

<table>
<tr>
    <th>Label</th>
    <th>Description</th>
</tr>
<tr>
    <td><b>Team</b>::1</td>
    <td rowspan="2">Used to enumerate backlog items developed by a specific<br>
    sub-team.</td>
</tr>
<tr>
    <td><b>Team</b>::2</td>
</tr>
</table>

#### 3.4. Reviewer

<table>
<tr>
    <th>Label</th>
    <th>Description</th>
</tr>
<tr>
    <td><b>Reviewer</b>::Christopher</td>
    <td rowspan="11">Used to specify the developer that reviewed a <br> certain
    backlog item</td>
</tr>
<tr>
    <td><b>Reviewer</b>::Illya</td>
</tr>
<tr>
    <td><b>Reviewer</b>::Julius</td>
</tr>
<tr>
    <td><b>Reviewer</b>::Kristiyan</td>
</tr>
<tr>
    <td><b>Reviewer</b>::Michael</td>
</tr>
<tr>
    <td><b>Reviewer</b>::Minh</td>
</tr>
<tr>
    <td><b>Reviewer</b>::Quan</td>
</tr>
<tr>
    <td><b>Reviewer</b>::Rafail</td>
</tr>
<tr>
    <td><b>Reviewer</b>::Rodrigo</td>
</tr>
<tr>
    <td><b>Reviewer</b>::Yehor</td>
</tr>
<tr>
    <td><b>Reviewer</b>::Yibing</td>
</tr>
</table>

## 4. Example workflow

1. Open a task from the **Open** issues of the Scrum board.
2. Assign yourself to the chosen task.
3. Add your team number as a Team label to the chosen task.
4. Add the Reviewer label for the person who will test the chosen task.
5. Create a *Draft* merge request using the **Create merge request** button,
select **Create merge request and branch** from the drop menu, and adjust the
target branch to be the **week** branch for that work week.
6. Add yourself as an *Assignee* in the merge request page.
7. Assign the reviewer of your task as a *Reviewer* in the merge request page.
8. Adjust the Milestone for the merge request to match the Sprint number.
9. *(Preferably)* Select 'Delete source branch when merge request is accepted.'
checkbox in the **Merge options** section.
10. Click **Create merge request** button.
