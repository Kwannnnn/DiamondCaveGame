# Code of conduct

This document outlines the stipulations that form this team's code of conduct for the duration of this project. Repeated and/or intentional violations of any of the stipulations below will be reported to the project organizer.

Upon publication of this document, all team member have twenty four (24) hours to object to the contents or present corrections. After this period the code of conduct is put into effect and all team members agree to follow its contents.

## Work conduct

1. After completing an assigned task, the assigned team member is responsible for entering the time they spent into the project time-tracking excel sheet.
2. Work for every week must target a "weekly build" branch to ensure stability of the main branch
3. Upon completion of their assigned issue, the assigned team member must move their issue in to the Done pool and inform the team that they have completed their task
4. If a team member gets stuck in progressing with an assigned task, they should request assistance from their team as soon as possible
5. If a team member is unable to complete an assigned task before the next SCRUM meeting, they must provide proof of work or research during the next SCRUM meeting.

## Communication conduct

1. Team communication, both text and voice, will take place on the dedicated project Discord server. Registration on this server is mandatory.
2. All team members must check and act on messages from the server at least once every twenty four (24) hours.

### Meeting conduct

1. All meetings outlined in the Project Plan will be taking place unless announced otherwise at least twenty four (24) hours prior to the scheduled time.
2. If a team member cannot be preset at the meeting due to external circumstances, they must inform the rest of the team via the main communication channel at least twelve (12) hours prior to the scheduled meeting time. Exceptions can be made in the event of emergencies.
3. At the begining of every meeting, a participating member will be designated by the SCRUM master to write down notes on discussions and decisions taken in the meeting.

## GIT conduct

 1. After the last meeting of every week, the designated GIT contact is responsible for creating a weekly build branch, based on the latest state of the main branch. From that branch, branches for each assigned use case must be formed.
 2. When beginning work on an assigned Issue, the assigned team member must create a dedicated branch for that issue from the latest state of the relevant use case branch.
 3. While working, the assigned team should commit whenever any new functionality is added and the entire codebase is functional. When writing commit messages, team members should use the message styling rules defined in [**Conventional Commits**](https://www.conventionalcommits.org/en/v1.0.0/).
 4. In the event a bug is encountered, that the assigned member cannot resolve, the assigned team member must create a new Issue in the repository. When working on resolving a bug, a fix branch must be created from the relevant use case branch.
 5. Whenever the current weekly branch is updated, relevant sub-team's SCRUM master is responsible for merging the new changes into the relevant use case branches.
 6. Upon completion of the issue, the assigned team member must ensure that their branch is up-to-date with the relevant use case branch and must create a merge request for their issue. This merge request must be handled by the relevant sub-team's SCRUM master, who must check that the work being added is relevant
 7. Upon the completion of all assigned tasks in a use case and the closure of all pending merge request for the use case, the relevant relevant sub-team's SCRUM master is responsible for creating a merge request targeting the current weekly build branch.
 8. Should any merge conflicts occur in the process of bringing their branch up-to-date with upper-level branches, the team member responsible for the code causing the merge conflict must work to resolve the conflict.
 9. Thirty (30) minutes before the begining of the last meeting of every week, no new merges into the weekly build branch will be accepted. Any tasks completed after this point will be assigned to the next weekly build branch.
 10. At the last meeting of every week, the weekly build branch must be reviewed and tested by the all members of the team.
 11. After all new commits have been reviewed and tested, the GIT contact is responsible for merging the weekly build branch into the main branch and closing the weekly build branch
