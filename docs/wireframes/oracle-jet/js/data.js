define([], function () {
  return {
    district: {
      districtId: "district_me_house_34",
      state: "Maine",
      officeType: "State House",
      districtName: "Maine House District 34",
      districtNumber: "34",
      municipalities: ["Arundel", "Kennebunk", "Kennebunkport"],
      zipCodes: ["04043", "04046"],
      notes: "Focus on shoreline resilience, school budget pressure, and local tax affordability."
    },
    users: [
      {
        name: "Admin User",
        roleLabel: "Platform Administrator",
        screens: ["Users", "Privilege Groups", "Segment Definitions", "Source Registry", "Audit Trail"]
      },
      {
        name: "Morgan Hale",
        roleLabel: "Campaign Manager",
        screens: ["District Dashboard", "Briefings", "Events", "Audience Segments", "Outreach Drafts"]
      },
      {
        name: "Priya Shah",
        roleLabel: "Communications Coordinator",
        screens: ["Audience Segments", "Outreach Drafts", "Briefings"]
      },
      {
        name: "Eli Turner",
        roleLabel: "Campaign Analyst",
        screens: ["Issue Feed", "Trending Topics", "Sources", "Discussions"]
      }
    ],
    segmentDefinitions: [
      { dimensionKey: "Age Group", values: ["18-29", "30-44", "45-64", "65+"] },
      { dimensionKey: "Income Group", values: ["Under 40k", "40k-80k", "80k-150k", "150k+"] },
      { dimensionKey: "Political Viewpoint", values: ["Conservative", "Moderate", "Progressive", "Independent"] },
      { dimensionKey: "Sex/Gender", values: ["Female", "Male", "Nonbinary", "Prefer not to say"] },
      {
        dimensionKey: "Occupation Group",
        values: [
          "White Collar Professional",
          "Blue Collar Worker",
          "Stay-at-Home Parent",
          "Teacher",
          "Healthcare Worker",
          "Small Business Owner",
          "Retiree"
        ]
      }
    ],
    audienceSegments: [
      { name: "District Teachers", estimatedAudienceSize: 180 },
      { name: "Persuadable Homeowners", estimatedAudienceSize: 420 },
      { name: "Healthcare Workers", estimatedAudienceSize: 96 },
      { name: "Retirees - Property Tax Focus", estimatedAudienceSize: 310 }
    ],
    sources: [
      {
        name: "Kennebunk Post",
        sourceType: "Local Newspaper",
        coverage: "Kennebunk, Kennebunkport",
        priority: "high",
        status: "active",
        confidenceScore: 0.78
      },
      {
        name: "The Weekly Sentinel",
        sourceType: "Local Newspaper",
        coverage: "Arundel, Kennebunk, Kennebunkport",
        priority: "high",
        status: "review",
        confidenceScore: 0.61
      },
      {
        name: "Kennebunk Currents",
        sourceType: "Town Newsletter",
        coverage: "Kennebunk",
        priority: "high",
        status: "active",
        confidenceScore: 0.86
      },
      {
        name: "The Village: Arundel, Kennebunk and Kennebunkport",
        sourceType: "Community Discussion",
        coverage: "Arundel, Kennebunk, Kennebunkport",
        priority: "monitor",
        status: "active",
        confidenceScore: 0.67
      },
      {
        name: "Portland Press Herald",
        sourceType: "Regional Newspaper",
        coverage: "Cumberland County, York County",
        priority: "regional",
        status: "active",
        confidenceScore: 0.81
      },
      {
        name: "Times Record",
        sourceType: "Regional Newspaper",
        coverage: "Midcoast, Southern Maine",
        priority: "regional",
        status: "active",
        confidenceScore: 0.74
      }
    ],
    issues: [
      {
        title: "School budget pressure",
        trendDelta7d: "+38%",
        reach: "Broad concern",
        segments: ["District Teachers", "Persuadable Homeowners"]
      },
      {
        title: "Coastal flooding preparation",
        trendDelta7d: "+24%",
        reach: "Growing",
        segments: ["Retirees - Property Tax Focus", "Healthcare Workers"]
      },
      {
        title: "Property tax affordability",
        trendDelta7d: "+17%",
        reach: "Mixed framing",
        segments: ["Persuadable Homeowners", "Retirees - Property Tax Focus"]
      }
    ],
    events: [
      {
        title: "Town Hall - Kennebunk",
        startAt: "Thursday 6:30 PM",
        projectedAttendance: 236
      },
      {
        title: "Volunteer Canvass Launch",
        startAt: "Saturday 9:00 AM",
        projectedAttendance: 58
      }
    ]
  };
});
