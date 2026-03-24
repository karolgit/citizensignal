PRD Prompt
Act as an experienced Product Manager drafting a Product Requirements Document (PRD) for a new software product for local election analysis and candidate campaign support.
Your goal is to create a clear, concise, and comprehensive PRD based on the information I provide. The PRD should be detailed enough to guide a coding agent in understanding what needs to be built. Format the entire document using standard Markdown (.md) syntax.
Include a dedicated `Data Structures` section in the PRD that lists the core JSON document types, their purpose, and the most important fields needed to support the application. Assume the database is Oracle Autonomous AI JSON Database, so favor document-oriented structures, embedded subdocuments where appropriate, and explicit references between major entities.
Here is the foundational information and synthesized insights from my research:

**User Pain Points Summary:**
1. Fragmented information. Identifying and collating current local issues that are meaningful to constituents. Citizens talk in many places at once: local news, Facebook groups, Nextdoor, school board meetings, church networks, neighborhood associations, and informal word-of-mouth. Local politicians rarely have one reliable view across all of them.
2. Loud minorities overpower quiet majorities. The people who show up at meetings or post online are often the most activated, not the most representative. That makes it hard to tell whether an issue is broadly felt or just intensely felt by a small group.
3. Weak district-level data. Most available data is county, state, or national, while local elections are won on hyperlocal concerns by block, precinct, school zone, or neighborhood. Politicians often can’t map issues precisely enough to the communities they serve.
4. Identifying conservative, liberal and independent perspectives on identified local issues. 
5. Rapidly changing local sentiment. A school incident, zoning fight, crime spike, weather event, business closure, or viral post can shift local priorities fast. By the time traditional outreach catches up, the mood may already have changed.Political candidates find it difficult to quickly create talking points and responses for recently identified local issues. It is difficult keeping up to date on local issues. 
6. Signal without context. Complaint volume alone is misleading. A few repeated voices can look like a trend, while a serious but less-discussed problem may be underdetected. Politicians struggle to rank urgency, spread, and electoral relevance.
7. National narratives crowd out local ones. Residents increasingly interpret local issues through national partisan frames. That makes it harder for politicians to separate what is truly local from what is imported from cable news or national social media discourse. Classifying sources of information as predominantly conservative, or liberal to understand the viewpoint through which residents are getting their frame set. 

**Core Problem My Idea Solves:**
[Clearly state the central problem or 'Job-to-be-Done' that your product addresses. Explain the 'Why'.]
Citizens talk in many places at once and local candidates do not have the staffing or funding to keep up to date on all the issues. Also, there are so many platforms for constituents to voice their issues from printed newspapers, to online news outlets, social media platforms, neighborhood specific websites that it is extremely difficult to get to issues before they become too large. It is also important do understand who is bringing the issue up. It is a loud voice that makes a lot of noise or is it a broader issue of concern to a lot of people in the area. 

**Minimum Viable Product (MVP) Feature Set:**
1. An administrator should be able to identify and classify local sources relevant to a political district. For example, Maine House District 34 is most interested in news from Kennebunk Post, The Weekly Sentinel, Times-Record, Biddeford-Saco-Old Orchard Beach Courier. Town newsletters such as Kennebunk Currents.  Facebook groups such as The Village: Arundel, Kennebunk and Kennebunkport. Regional Coverage Cumberland County: Portland Press Herald, The Forecaster, American Journal. Midcoast: Times Record, The Forecaster.
2. Create issue briefing document with analysis from different viewpoints: conservative, liberal, general. 
3. Target issue analysis: analyze the relevant local sources to create lists of issues, follow up questions, and suggested next steps from different perspectives like conservative, liberal, independent. 
4. Users should be able to interactively ask questions about the produced briefing document to provide additional insight, and suggested steps to take to address the issues. 
5. Users should be able to store the interactive discussion to continue at a later time or to review later. 
6. Identify trending or hot topics. Which topics are the most talked about or have the greatest energy compared to other topics. 
7. Segment audiences using sophisticated filters and tags to identify the right people for emails & texts. 
8. Administrators should be able to create and modify segments used in analysis. Segments could include age group, income group, political viewpoint, sex, and occupation group [white collar professional, blue collar worker, stay at home parent, teacher, healthcare worker, etc.]
9. Drive event turnout when it counts. Recruit attendees for rallies, fundraisers, and volunteer meet-ups with targeted localized messaging
10. Administrators should be able to create users and assign users to privilege groups. Privilege groups will be used to identify access to specific screens. 


**High-Level User Personas:**
Political Candidate - individual running for office. This person will be working to get onto primary ballots, participate as a candidate in general elections. 
Campaign Manager - individual responsible for coordinating and running a political campaign for a candidate. 
Campaign Communication Coordinator - individual responsible for creating and coordinating messaging for a political campaign. 
Political Official - individual in an elected position that is interested in keeping in touch with local issues of their constituents. 
Software Administrator - an individual who manages the software platform by creating users, assigning user privileges to screens, creating districts, creating district sources, creating audience segments for use by the users. 


**High-Level Use Cases:**
As a political candidate, I want to identify key issues that are relevant to my local constituents so that I can address their concerns without getting caught up with issues that are not as important in my area. 
As a campaign manager, I want to keep track in the change in attitude towards my political candidate in respect to issues that are of key concern to the candidate’s political district. 
As a campaign communication coordinator, I want to keep up to date on local issues and how those issues are perceived through different viewpoints. I want to analyze different issue messages to understand the impact to different constituents. 
