# CivicSignal - Product Requirements Document

## Metadata

- **Item:** CivicSignal
- **Target release date:** May 1, 2026
- **Epic:** Simplify local issue analysis
- **Document status:** Draft
- **Document owner:** Bill Wimsatt
- **Designer:** TBD
- **Tech lead:** Karol Stuart
- **Technical writers:** TBD
- **QA:** TBD

## Objective

CivicSignal is a software product for local election analysis and candidate campaign support. Its purpose is to help political candidates, campaign staff, and local elected officials understand the issues that matter most to constituents in a specific district and respond more effectively with localized messaging, planning, and outreach.

The product exists because local political intelligence is fragmented, difficult to interpret, and highly time-sensitive. Citizens discuss issues across local newspapers, Facebook groups, newsletters, community forums, municipal pages, school board meetings, neighborhood groups, and word-of-mouth networks. Small campaigns usually lack the staff, tools, and time required to monitor those channels consistently. As a result, they often miss emerging issues, overreact to the loudest voices, or fail to distinguish between broad local concerns and isolated pockets of activism.

CivicSignal supports the broader strategic goal of simplifying local issue analysis by turning fragmented local inputs into structured district-level intelligence. The product is intended to:

- identify relevant local sources by district
- detect and rank local issues
- compare how issues are framed across conservative, liberal, independent, and general viewpoints
- help campaigns understand whether an issue is broad-based or driven by a loud minority
- preserve analysis and discussions for later review
- support event turnout and localized outreach through audience segmentation and messaging drafts

At its core, CivicSignal solves the job-to-be-done: when a local candidate or campaign staffer needs to understand what people in a district care about right now, the product should quickly surface the most relevant issues, explain who is talking about them and how, and help the team act before the moment passes.

## Target Audience / User Personas

### Political Candidate

Political candidates need a fast, reliable way to understand what constituents care about in their district. They want clear issue briefings, timely talking points, and confidence that the issues surfaced are truly local and not just national narratives spilling into the district. Their primary goal is to stay relevant, responsive, and credible with voters while avoiding wasted time on low-signal issues.

### Campaign Manager

Campaign managers are responsible for keeping the campaign focused on the issues that matter most. They need district dashboards, trend tracking, and rapid-response support so they can adjust campaign strategy when sentiment shifts. They also need help deciding whether an issue is growing organically across the district or being amplified by a small but vocal group.

### Campaign Communication Coordinator

Campaign communication coordinators need to understand not only what the issues are, but how those issues are perceived through different political viewpoints. They need framing analysis, message variants, and localized outreach drafts that can be adapted for different audiences. Their goal is to create timely, persuasive communication that fits the concerns and language of specific constituent groups.

### Political Official

Political officials already in office need continuous awareness of constituent issues between election cycles. They want to monitor issue shifts, track how local concerns are evolving, and understand where dissatisfaction or support is growing. Their goal is to remain connected to the community and respond before issues escalate into larger political or governance problems.

### Secondary Users

Secondary users may include local political consultants, advocacy groups, and party staff supporting candidates in multiple districts. These users benefit from the same issue intelligence workflows but are not the primary audience for the initial MVP.

## Success Metrics

| Goal | Metric |
|---|---|
| Reduce manual research time for campaign teams | Average time to create first district briefing; user-reported reduction in research hours |
| Improve issue awareness in local districts | Number of generated district briefings per week; percentage of users reviewing top issues dashboard |
| Improve speed of campaign response to emerging issues | Time from issue emergence to briefing generation; user-reported response readiness |
| Increase trust in surfaced issues | Percentage of surfaced issues with inspectable source evidence; user-reported confidence in issue relevance |
| Help users identify high-energy local topics | Number of trending topics reviewed per district; user feedback on trend accuracy |
| Improve messaging support across viewpoints | Usage of target issue analysis reports; user-reported usefulness of viewpoint comparison |
| Support reusable analysis workflows | Number of saved discussions; percentage of saved discussions reopened later |
| Support targeted outreach readiness | Number of audience segments created; number of outreach drafts generated per event |
| Improve turnout preparation for campaign events | Number of events created with linked segments and drafts; user-reported usefulness of turnout messaging |

## Assumptions

- Local candidates and small campaign teams have limited staff capacity and need a simple, explainable product rather than a complex analytics platform.
- Users value source transparency and will trust the product more if every issue can be traced back to source evidence.
- District-specific local sources can be identified through a mix of manual curation and structured metadata.
- Some source types, especially social and community platforms, may have limited technical or legal accessibility in the MVP.
- Audience records for outreach may be imported from existing campaign tools or manually entered in lightweight form.
- The initial release should optimize for analysis, segmentation, and draft generation rather than full outreach delivery or CRM replacement.
- Political viewpoint and demographic fields may be incomplete or inferred in some cases, so the system should support confidence levels, tagging, and manual overrides.
- Users will accept a draft-quality AI-generated messaging workflow if it is localized, editable, and backed by clear issue context.

## User Stories / Use Cases

- As a political candidate, I want to identify the most important local issues in my district so that I can speak to concerns that actually matter to voters.
- As a political candidate, I want to see how an issue is framed by conservative, liberal, independent, and general audiences so that I can prepare more relevant responses.
- As a campaign manager, I want to monitor trending issues over time so that I can adjust campaign priorities quickly when local sentiment shifts.
- As a campaign manager, I want to know whether an issue reflects broad district concern or only a loud minority so that I can prioritize scarce campaign time correctly.
- As a campaign communication coordinator, I want to generate an issue briefing with talking points and follow-up questions so that I can support fast message development.
- As a campaign communication coordinator, I want to compare multiple message angles for a local issue so that I can tailor communication to different constituent groups.
- As a political official, I want a continuous view of emerging district issues so that I can stay aligned with constituent concerns between election cycles.
- As a user, I want to save my interactive discussion and return to it later so that ongoing analysis does not get lost between sessions.
- As a user, I want to create reusable audience segments based on filters and tags so that I can target the right people for emails and texts.
- As a user, I want to segment audiences by age group, income group, political viewpoint, sex or gender, and occupation group so that outreach can match the realities of different parts of the district.
- As a user, I want to create campaign events and generate localized turnout messages so that I can recruit attendees for rallies, fundraisers, and volunteer meet-ups.
- As a user, I want multiple outreach draft variants for a segment or event so that I can choose the best message before sending it through my existing tools.

## Functional Requirements

### 1. District Management

- Users must be able to create and manage one or more districts.
- A district must support fields for state, office type, district name or number, municipalities, ZIP codes, and notes.
- Users must be able to view the sources and issues associated with a district.

### 2. Source Discovery and Classification

- The system must support identifying and storing local sources relevant to a district.
- Supported source types for MVP should include local newspapers, regional newspapers, town newsletters, municipal or public records pages, and accessible community discussion sources.
- Each source should store metadata including:
  - source name
  - source type
  - URL
  - covered municipalities
  - covered ZIP codes
  - covered districts
  - political leaning or framing tendency when inferable
  - confidence or trust score
  - update frequency
- Users must be able to curate sources manually by adding, removing, flagging, or editing them.

### 3. Content Ingestion

- The system must ingest source content on a recurring basis where technically and legally accessible.
- Ingested source items should include title, publication date, URL, summary, excerpt, and raw text when available.
- The system must track ingestion freshness and timestamps.

### 4. Issue Extraction and Clustering

- The system must extract candidate local issues from ingested content.
- The system must group related mentions into district-level issue clusters.
- Each issue cluster must preserve links to supporting source items.
- Each issue must store first-seen and last-seen timestamps, trend-related fields, and a short summary.

### 5. Issue Briefing Generation

- Users must be able to generate a district issue briefing on demand.
- Briefings should include:
  - top issues in the district
  - summary of why each issue matters
  - key source references
  - evidence of issue intensity and spread
  - conservative framing
  - liberal framing
  - independent or general framing
  - follow-up questions
  - suggested next steps
  - candidate impact notes when relevant
- Briefings must be exportable as Markdown or copyable text.

### 6. Target Issue Analysis

- Users must be able to select a specific issue for deeper analysis.
- Target issue reports should include:
  - issue summary
  - timeline of recent mentions
  - local source breakdown
  - viewpoint comparison
  - indicators of whether the issue is broad-based or dominated by a small group
  - signals of whether the issue is favorable, unfavorable, neutral, or mixed for the candidate when relevant
  - suggested talking points
  - suggested campaign actions

### 7. Trending Topic Detection

- The system must identify trending or hot topics within a district.
- Trend scoring should consider:
  - increase in mentions over time
  - distinct source count
  - spread across municipalities or communities
  - cross-source movement from niche to mainstream sources
  - recency and acceleration
  - candidate association where relevant
- Users must be able to view issues ranked by trend or energy score.

### 8. Viewpoint Classification

- The system must classify issue framing into conservative, liberal, independent, and general categories when sufficient evidence exists.
- The system must distinguish between source leaning and issue framing.
- The system should expose a confidence level for inferred viewpoint classifications.

### 9. Discussion Persistence

- Users must be able to save interactive discussions tied to a district, issue, briefing, or candidate context.
- Users must be able to reopen saved discussions later and continue them.
- Saved discussions should preserve message history, timestamps, notes, and linked artifacts such as issue reports and briefings.
- Users should be able to rename, archive, and review prior discussions.

### 10. Audience Segmentation

- Users must be able to create audience segments using filters and tags.
- Segment filters should support:
  - district
  - municipality
  - ZIP code
  - age group
  - income group
  - political viewpoint
  - sex or gender where legally appropriate and available
  - occupation group
  - issue interest
  - engagement level
  - campaign role
  - supporter, donor, volunteer, undecided, or similar campaign tags
- Occupation group examples may include white collar professionals, blue collar workers, stay-at-home parents, teachers, healthcare workers, small business owners, and retirees.
- Users must be able to save, edit, and reuse segment definitions.
- Segment definitions must be transparent and editable.

### 11. Audience Records

- The MVP must support lightweight audience records through import or manual entry.
- Audience records may include:
  - name
  - municipality
  - ZIP code
  - age group
  - income group
  - political viewpoint
  - sex or gender
  - occupation group
  - tags
  - engagement attributes
  - available contact channels
  - consent status
- Demographic and occupation fields should support normalized categories rather than only free text.

### 12. Event Turnout Support

- Users must be able to create campaign events such as rallies, fundraisers, canvassing launches, and volunteer meet-ups.
- Each event should store title, description, location, date or time, target geography, turnout goal, related issues, and linked audience segments.
- The system must support localized messaging recommendations for event recruitment based on district issues and selected segments.

### 13. Outreach Drafting Support

- Users must be able to generate draft email and text content for an event, issue, or audience segment.
- Outreach drafts should support localized references such as town, neighborhood, municipality, district, and relevant issue context.
- Users should be able to save multiple draft variants and mark a preferred version.
- The MVP may stop at draft generation and export rather than direct delivery through messaging platforms.

### 14. Search, Filters, and Feedback

- Users must be able to search issues, sources, and keywords.
- Users must be able to filter by district, municipality, source type, source leaning, issue category, viewpoint, date range, and trend status.
- Users must be able to mark sources or issues as relevant, irrelevant, duplicate, or misclassified.
- The system should store this feedback for future tuning.

## Data Structures

The MVP data model should be designed for Oracle Autonomous AI JSON Database and should treat the primary application records as JSON documents rather than a strictly relational schema. Document boundaries should follow product workflows: embed small, bounded substructures that are usually loaded together, and use document references for large, growing, or independently queried records.

Core data structures should include:

- `district` document
  - Purpose: stores the political geography and workspace boundary for analysis.
  - Key fields: `districtId`, `state`, `officeType`, `districtName`, `districtNumber`, `municipalities[]`, `zipCodes[]`, `neighborhoods[]`, `notes`, `status`, `createdBy`, `createdAt`, `updatedAt`.
- `source` document
  - Purpose: stores a curated local source and its classification metadata.
  - Key fields: `sourceId`, `districtIds[]`, `name`, `sourceType`, `url`, `platform`, `coverage.municipalities[]`, `coverage.zipCodes[]`, `coverage.districts[]`, `politicalLeaning`, `framingTendency`, `trustScore`, `confidenceScore`, `updateFrequency`, `ingestionMethod`, `isActive`, `tags[]`, `createdAt`, `updatedAt`.
- `source_item` document
  - Purpose: stores an ingested article, post, newsletter item, meeting note, or other source artifact.
  - Key fields: `sourceItemId`, `sourceId`, `districtIds[]`, `title`, `canonicalUrl`, `publishedAt`, `ingestedAt`, `author`, `summary`, `excerpt`, `rawText`, `contentHash`, `mediaType`, `language`, `entities`, `locations`, `topics`, `processingStatus`, `classification`.
- `ingestion_run` document
  - Purpose: tracks fetch and processing activity for operational visibility.
  - Key fields: `ingestionRunId`, `sourceId`, `startedAt`, `completedAt`, `status`, `itemsFetched`, `itemsCreated`, `itemsUpdated`, `errorCount`, `errors[]`, `triggerType`, `runMetadata`.
- `issue_cluster` document
  - Purpose: represents a district-level issue created by grouping related mentions across sources.
  - Key fields: `issueId`, `districtId`, `title`, `slug`, `summary`, `category`, `status`, `priorityScore`, `trendScore`, `energyScore`, `firstSeenAt`, `lastSeenAt`, `sourceCount`, `mentionCount`, `geographicSpread`, `viewpointSummary`, `candidateImpact`, `topSourceItemIds[]`, `tags[]`, `createdAt`, `updatedAt`.
- `issue_mention` document
  - Purpose: stores an individual issue signal extracted from a single source item.
  - Key fields: `issueMentionId`, `issueId`, `sourceItemId`, `districtId`, `sourceId`, `mentionedAt`, `excerpt`, `summary`, `municipality`, `neighborhood`, `viewpoint`, `sentiment`, `intensityScore`, `isDuplicate`, `confidenceScore`, `evidence`.
- `briefing` document
  - Purpose: stores a generated district briefing snapshot.
  - Key fields: `briefingId`, `districtId`, `title`, `generatedAt`, `generatedBy`, `timeRange`, `topIssues[]`, `viewpointComparisons[]`, `followUpQuestions[]`, `suggestedNextSteps[]`, `candidateNotes`, `sourceReferences[]`, `markdownBody`, `version`, `status`.
- `issue_analysis` document
  - Purpose: stores a deep-dive report for a specific issue.
  - Key fields: `issueAnalysisId`, `issueId`, `districtId`, `generatedAt`, `generatedBy`, `issueSummary`, `timeline[]`, `sourceBreakdown[]`, `viewpointComparison`, `broadVsLoudMinorityAssessment`, `candidateRiskAssessment`, `talkingPoints[]`, `campaignActions[]`, `supportingSourceItemIds[]`, `markdownBody`.
- `discussion_thread` document
  - Purpose: stores a saved interactive analysis conversation.
  - Key fields: `threadId`, `districtId`, `issueId`, `briefingId`, `title`, `status`, `participants[]`, `messages[]`, `linkedArtifactIds[]`, `notes`, `createdAt`, `updatedAt`, `archivedAt`.
- `audience_segment` document
  - Purpose: stores reusable segment definitions for analysis and turnout messaging.
  - Key fields: `segmentId`, `districtId`, `name`, `description`, `filters`, `tags[]`, `estimatedAudienceSize`, `createdBy`, `createdAt`, `updatedAt`, `isArchived`.
- `audience_record` document
  - Purpose: stores a lightweight contact or constituent profile for targeting.
  - Key fields: `audienceRecordId`, `districtIds[]`, `fullName`, `municipality`, `zipCode`, `ageGroup`, `incomeGroup`, `politicalViewpoint`, `sexOrGender`, `occupationGroup`, `issueInterests[]`, `engagementLevel`, `campaignTags[]`, `contactChannels`, `consent`, `sourceSystem`, `segmentIds[]`, `createdAt`, `updatedAt`.
- `event` document
  - Purpose: stores campaign events and their turnout context.
  - Key fields: `eventId`, `districtId`, `title`, `description`, `eventType`, `location`, `municipality`, `startAt`, `endAt`, `turnoutGoal`, `relatedIssueIds[]`, `targetSegmentIds[]`, `status`, `notes`, `createdBy`, `createdAt`, `updatedAt`.
- `outreach_draft` document
  - Purpose: stores generated outreach content tied to an event, issue, or segment.
  - Key fields: `draftId`, `districtId`, `eventId`, `issueId`, `segmentId`, `channel`, `tone`, `localReferences[]`, `variants[]`, `preferredVariantId`, `generationInputs`, `status`, `createdBy`, `createdAt`, `updatedAt`.
- `user` document
  - Purpose: stores application users and their district access.
  - Key fields: `userId`, `name`, `email`, `status`, `districtIds[]`, `privilegeGroupIds[]`, `preferences`, `lastLoginAt`, `createdAt`, `updatedAt`.
- `privilege_group` document
  - Purpose: stores reusable permissions for screen and capability access.
  - Key fields: `privilegeGroupId`, `name`, `description`, `permissions[]`, `createdAt`, `updatedAt`.
- `feedback_annotation` document
  - Purpose: stores user feedback on source and issue quality.
  - Key fields: `feedbackId`, `districtId`, `targetType`, `targetId`, `feedbackType`, `comment`, `createdBy`, `createdAt`, `resolutionStatus`.
- `audit_event` document
  - Purpose: stores key user and system actions for traceability.
  - Key fields: `auditEventId`, `actorType`, `actorId`, `action`, `targetType`, `targetId`, `districtId`, `timestamp`, `details`.

Modeling guidance for Oracle Autonomous AI JSON Database:

- Use embedded arrays for bounded values that are naturally part of a parent record, such as `municipalities[]`, `zipCodes[]`, `filters`, `messages[]`, or `variants[]`.
- Use separate referenced documents for high-volume records such as `source_item`, `issue_mention`, `briefing`, `issue_analysis`, and `audit_event`.
- Add indexes for high-selectivity JSON fields that drive the main workflows, especially `districtId`, `districtIds`, `sourceId`, `issueId`, `publishedAt`, `generatedAt`, `trendScore`, `politicalLeaning`, `status`, and `tags`.
- Preserve raw source text and generated outputs separately so the system can support explainability, regeneration, and audit review.

## Non-Functional Requirements

### Performance

- Issue lists and search results should load in under 3 seconds for typical MVP data volumes.
- Briefing generation for an already-ingested district should complete in under 60 seconds.
- Saved discussions should reopen quickly enough to preserve continuity of use.

### Reliability

- The system should preserve saved discussions, briefings, and segment definitions without data loss under normal operating conditions.
- Ingestion failures should be logged and visible for review.
- The system should clearly show when source data is stale or incomplete.

### Security and Privacy

- The system must clearly separate public source content from generated analysis.
- The system should avoid storing unnecessary personal data.
- Audience records and contact data must be handled in a way that supports campaign consent and outreach compliance requirements.
- Access to user-created segments, discussion history, and audience records should be permission-aware if multi-user support is introduced.

### Explainability and Auditability

- Every surfaced issue must include source references or inspectable supporting evidence.
- Trend scores and viewpoint classifications should include interpretable signals or confidence indicators.
- Generated messaging should remain traceable to the district, issue context, and segment inputs used to create it.

### Usability

- The product should be usable by non-technical campaign staff with minimal training.
- The core workflow from district setup to briefing generation should require only a few clear steps.
- Saved segments, saved discussions, and saved drafts should be easy to locate and reuse.

### Accessibility

- The product should follow common web accessibility best practices for contrast, navigation, and readable structure.
- Core workflows should be usable with keyboard navigation and screen readers in the production implementation.

## Design & User Interaction

CivicSignal should feel practical, fast, and trustworthy. The user experience should emphasize clarity over complexity. Users should be able to move from district setup to issue understanding to action without needing to interpret dense analytics or raw data dumps. There are two major user types: an administrative user who 

The main user flow should be:

1. Create or select a district.
2. Review and curate district sources.
3. Allow the system to ingest and analyze content.
4. Review the district dashboard for top and trending issues.
5. Open a district briefing or target issue analysis.
6. Save the discussion for later if deeper analysis is needed.
7. Create audience segments and generate localized outreach drafts for relevant events or issues.

Core screens for MVP should include:

- District Dashboard
- Source Registry
- Issue Feed
- Trending Topics View
- District Briefing View
- Target Issue Analysis View
- Discussion History
- Audience Segments
- Events and Turnout Messaging
- Candidate Context Settings

The design should emphasize:

- source transparency and trust
- clear issue ranking and evidence
- simple, readable briefing views
- editable AI-generated outputs
- easy reuse of saved analysis, segments, and message drafts

Links to Wireframes/Mockups: [Insert Link Here]

## Milestones / Future Roadmap

### MVP

The MVP should include:

- district setup and source curation
- source ingestion for accessible local sources
- issue extraction and clustering
- trending topic detection
- district briefings
- target issue analysis
- viewpoint comparison
- discussion persistence
- lightweight audience records
- audience segmentation
- event creation
- localized outreach draft generation

### Phase 2

Potential follow-on work after MVP may include:

- stronger automation for district-source suggestions
- expanded source coverage and ingestion connectors
- better candidate sentiment analysis
- richer analytics on issue spread over time
- collaboration features for multi-user campaign teams
- export improvements for briefings and outreach plans

### Phase 3

Longer-term roadmap items may include:

- integrations with email and texting platforms
- integrations with campaign CRM or voter file tools
- approval workflows for messaging
- deeper reporting on event turnout and engagement
- multi-district management for consultants and party organizations

## Risks

- Source access may vary significantly across platforms and may limit the completeness of local issue monitoring.
- Social and community data can be noisy, inconsistent, or difficult to normalize.
- Viewpoint classification may be subjective and contested by users.
- Trend scoring may overemphasize highly active online communities if not tuned carefully.
- Candidate impact or sentiment signals may be sparse in smaller districts.
- Audience records may be incomplete, outdated, or inconsistently tagged.
- Outreach features may be less useful if users do not have usable audience data available.
- AI-generated summaries or outreach drafts may sound generic without enough local context.
- The product may expand too far into CRM territory unless scope is kept disciplined around analysis and draft generation.

## Out of Scope / Exclusions

- Full voter file management
- Enterprise CRM workflows
- Fundraising operations
- Ad buying and paid media planning
- Predicting election winners
- Full direct publishing to email, SMS, or social platforms in the MVP
- Full fact-checking or verification of every claim in ingested content
- Deep integrations with paid polling or national campaign infrastructure in the MVP
- National-level political analysis not tied to local district issue understanding

## Open Questions

| Question | Answer | Date Answered |
|---|---|---|
| Which source types are technically and legally feasible to ingest in the first release? |  |  |
| Will district source suggestions be manual only in the MVP, or partially automated? |  |  |
| How should independent viewpoint be defined when a source or issue is mixed? |  |  |
| Will audience records be imported from external campaign tools, entered manually, or both? |  |  |
| Should outreach draft generation remain export-only in the MVP, or should direct delivery integrations be considered? |  |  |
| What level of human review is required before AI-generated campaign messaging is used operationally? |  |  |
| Which normalized category sets should be used for age group, income group, and occupation group? |  |  |
| What permissions model is needed if multiple campaign staff members use the same district workspace? |  |  |
