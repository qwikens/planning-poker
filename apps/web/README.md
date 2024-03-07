# Functional Requirements (FR)
## Room Creation and Management

- FR1: Users must be able to create a dedicated room for planning poker sessions.
- FR2: Each room must support up to 23 players simultaneously.
- FR3: The room creator has administrative privileges, including the ability to kick players.
- FR4: Players who join a room are considered active participants until the end of the session.

## Issue Management

- FR5: Users must be able to create, update, and delete issues within the room.
- FR6: Users must be able to vote on a specific issue any number of times as defined by the room settings.
- FR7: After voting on an issue, users should be able to proceed to the next issue seamlessly.

## Voting and Points

- FR8: The system must provide different planning points formats for voting.
- FR9: The system must accurately count and record votes for each issue.

## Session Management

- FR10: Users must be able to set a timer for voting on each issue.
- FR11: The system must provide a read-only mode with a history of the session for review purposes.

## User Validation

- FR12: The system must show an error if a user tries to enter a room with a name that is already in use.

## Real-time Collaboration

- FR13: The system must support real-time updates and synchronization across all participants' interfaces.

# Non-functional Requirements (NFR)
## Performance and Scalability

- NFR1: The application must support real-time collaboration without lag for up to 23 simultaneous users.

## Reliability

- NFR2: The application must ensure data consistency and state synchronization across all clients during network disruptions.

## Usability

- NFR3: The application interface must be user-friendly and require minimal learning curve for new users.

## Accessibility

- NFR4: The application should be accessible on various platforms including desktops, tablets, and smartphones.

## Security

- NFR5: The application must provide secure access control mechanisms for room creation and participation.

# Business Rules (BR)
## Voting Process

- BR1: A user can choose only one card per voting session.
- BR2: The results of the voting are only displayed after all active participants have voted.
- BR3: If the timer expires before a user votes, their vote is forfeited for that round.

## Session Continuity

- BR4: A session is considered active until the creator formally ends it, regardless of participant activity levels.

## Issue Resolution

- BR5: An issue is only moved to the "completed" status after all votes are cast and results are shown.

## Historical Integrity

- BR6: Once a session is made read-only, its history cannot be altered.
