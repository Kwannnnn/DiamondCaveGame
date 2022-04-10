# Code of conduct

This document outlines the stipulations that form this team's code of conduct for the duration of this project. Repeated or intentional violations of any of the stipulations below will be reported to the project organizer.

Upon publication of this document, all team members have twenty-four (24) hours to object to the contents or present corrections. After this period, the code of conduct is implemented, and all team members agree to follow its contents.

## Work conduct

1. After completing an assigned task, the designated team member is responsible for entering the time they spent into the project time-tracking excel sheet.
2. Work for every week must target a "weekly build" branch to ensure the stability of the main branch
3. Upon completion of their assigned issue, the assigned team member must move their issue into the Done pool and inform the team that they have completed their task
4. If a team member gets stuck in progressing with an assigned task, they should request assistance from their team as soon as possible
5. If a team member cannot complete an assigned task before the next SCRUM meeting, they must provide proof of work or research during the next SCRUM meeting.

## Communication conduct

1. Team communication, both text and voice, will take place on the dedicated Discord server. Therefore, registration on this server is mandatory.
2. All team members must check and act on messages from the server at least once every twenty-four (24) hours.

### Meeting conduct

1. All meetings outlined in the Project Plan will occur unless announced otherwise at least twenty-four (24) hours before the scheduled time.
2. If a team member cannot be present at the meeting due to external circumstances, they must inform the rest of the team via the main communication channel at least twelve (12) hours before the scheduled meeting time. Exceptions can be made in the event of emergencies.
3. At the beginning of every meeting, a participating member will be designated by the SCRUM master to write down notes on discussions and decisions taken in the meeting.

## GIT conduct

For detailed guidelines regarding GitLab usage, please consult the
[Git Guidelines](git-guidelines.md) document.

 1. After the last meeting of every week, the designated GIT contact is responsible for creating a weekly build branch based on the latest state of the main branch.
 2. When beginning work on an assigned Issue, the appointed team member must create a dedicated branch for that issue from the latest state of the current weekly build branch.
 3. While working, the assigned team should commit whenever any new functionality is added and the entire codebase is functional. Team members should use the message styling rules defined in [**Conventional Commits**](https://www.conventionalcommits.org/en/v1.0.0/).
 4. If a bug is encountered that the assigned member cannot resolve, that team member must create a new Issue in the repository. In addition, when resolving a bug, the team member implementing the fix must create a fix branch from the latest state of the current weekly build branch.
 5. Upon completing the issue, the assigned team member must ensure that their branch is up-to-date with the latest state of the current weekly build branch and must create a merge request for their issue.
 6. Thirty (30) minutes before the beginning of the last meeting of every week, no new merges into the weekly build branch will be accepted. Any tasks completed after this point will be assigned to the next weekly build branch.
 7. At the last meeting of every week, all team members must review and test the weekly build branch.
 8. After all new commits have been reviewed and tested, the GIT contact is responsible for merging the weekly build branch into the main branch and closing the weekly build branch
