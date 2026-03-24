const data = {
  theme: {
    name: "Apple Liquid Glass Inspired",
  },
  district: {
    districtName: "Maine House District 34",
    officeType: "State House",
    state: "Maine",
    municipalities: ["Arundel", "Kennebunk", "Kennebunkport"],
    zipCodes: ["04043", "04046"],
  },
  loginProfiles: [
    {
      id: "admin",
      label: "Administrator",
      name: "Admin User",
      email: "admin@citizensignal.local",
      landingScreen: "admin-dashboard",
    },
    {
      id: "manager",
      label: "Campaign Manager",
      name: "Morgan Hale",
      email: "morgan.hale@citizensignal.local",
      landingScreen: "manager-dashboard",
    },
  ],
  users: [
    {
      name: "Admin User",
      roleLabel: "Platform Administrator",
      screens: ["Users", "Privilege Groups", "Segment Definitions", "Source Registry", "Audit Trail"],
    },
    {
      name: "Morgan Hale",
      roleLabel: "Campaign Manager",
      screens: ["District Dashboard", "Briefings", "Events", "Audience Segments", "Outreach Drafts"],
    },
    {
      name: "Priya Shah",
      roleLabel: "Communications Coordinator",
      screens: ["Audience Segments", "Outreach Drafts", "Briefings"],
    },
    {
      name: "Eli Turner",
      roleLabel: "Campaign Analyst",
      screens: ["Issue Feed", "Trending Topics", "Sources", "Discussions"],
    },
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
        "Retiree",
      ],
    },
  ],
  audienceSegments: [
    { name: "District Teachers", estimatedAudienceSize: 180, tags: ["education", "community-leaders"] },
    { name: "Persuadable Homeowners", estimatedAudienceSize: 420, tags: ["taxes", "turnout"] },
    { name: "Healthcare Workers", estimatedAudienceSize: 96, tags: ["workforce", "community-trust"] },
    { name: "Retirees - Property Tax Focus", estimatedAudienceSize: 310, tags: ["property-taxes", "mail-voters"] },
  ],
  sources: [
    {
      name: "Kennebunk Post",
      sourceType: "Local Newspaper",
      coverage: "Kennebunk, Kennebunkport",
      priority: "high",
      status: "active",
      confidenceScore: 0.78,
    },
    {
      name: "The Weekly Sentinel",
      sourceType: "Local Newspaper",
      coverage: "Arundel, Kennebunk, Kennebunkport",
      priority: "high",
      status: "review",
      confidenceScore: 0.61,
    },
    {
      name: "Kennebunk Currents",
      sourceType: "Town Newsletter",
      coverage: "Kennebunk",
      priority: "high",
      status: "active",
      confidenceScore: 0.86,
    },
    {
      name: "The Village: Arundel, Kennebunk and Kennebunkport",
      sourceType: "Community Discussion",
      coverage: "Arundel, Kennebunk, Kennebunkport",
      priority: "monitor",
      status: "active",
      confidenceScore: 0.67,
    },
    {
      name: "Portland Press Herald",
      sourceType: "Regional Newspaper",
      coverage: "Cumberland County, York County",
      priority: "regional",
      status: "active",
      confidenceScore: 0.81,
    },
    {
      name: "Times Record",
      sourceType: "Regional Newspaper",
      coverage: "Midcoast, Southern Maine",
      priority: "regional",
      status: "active",
      confidenceScore: 0.74,
    },
  ],
  issues: [
    {
      title: "School budget pressure",
      trendDelta7d: "+38%",
      reach: "Broad concern",
      segments: ["District Teachers", "Persuadable Homeowners"],
    },
    {
      title: "Coastal flooding preparation",
      trendDelta7d: "+24%",
      reach: "Growing",
      segments: ["Retirees - Property Tax Focus", "Healthcare Workers"],
    },
    {
      title: "Property tax affordability",
      trendDelta7d: "+17%",
      reach: "Mixed framing",
      segments: ["Persuadable Homeowners", "Retirees - Property Tax Focus"],
    },
  ],
  events: [
    {
      title: "Town Hall - Kennebunk",
      startAt: "Thursday 6:30 PM",
      projectedAttendance: 236,
      linkedSegments: ["District Teachers", "Persuadable Homeowners"],
    },
    {
      title: "Volunteer Canvass Launch",
      startAt: "Saturday 9:00 AM",
      projectedAttendance: 58,
      linkedSegments: ["District Teachers"],
    },
  ],
  auditTimeline: [
    "09:42 AM | Segment value retired: occupation_teacher",
    "10:05 AM | User invited: field.director@citizensignal.local",
    "10:22 AM | Source confidence updated: Kennebunk Currents",
    "11:10 AM | Privilege group change: Campaign Analyst",
  ],
  districts: [
    {
      districtName: "Maine House District 34",
      officeType: "State House",
      municipalities: ["Arundel", "Kennebunk", "Kennebunkport"],
      zipCodes: ["04043", "04046"],
      notes: "Focus on shoreline resilience, schools, and tax affordability.",
    },
    {
      districtName: "Maine House District 35",
      officeType: "State House",
      municipalities: ["Biddeford"],
      zipCodes: ["04005"],
      notes: "Companion district included for multi-district admin review.",
    },
  ],
};

const state = {
  role: null,
  screen: "login",
};

const roleScreens = {
  admin: [
    { id: "admin-dashboard", label: "Admin Dashboard" },
    { id: "district-setup", label: "District Setup" },
    { id: "sources", label: "Sources" },
  ],
  manager: [
    { id: "manager-dashboard", label: "Campaign Dashboard" },
    { id: "district-setup", label: "District Setup" },
    { id: "sources", label: "Sources" },
  ],
};

const screenHost = document.getElementById("screenHost");
const navLinks = document.getElementById("navLinks");
const sidebarRole = document.getElementById("sidebarRole");
const logoutButton = document.getElementById("logoutButton");
const roleSwitchButtons = Array.from(document.querySelectorAll("[data-role-switch]"));

function badge(text, className = "") {
  return `<span class="pill ${className}">${text}</span>`;
}

function renderLogin() {
  const roleTiles = data.loginProfiles
    .map(
      (profile) => `
        <div class="role-tile" data-login-role="${profile.id}">
          <h3>${profile.label}</h3>
          <div class="detail-line">${profile.name}</div>
          <div class="detail-line">${profile.email}</div>
          <div class="actions" style="margin-top:12px;">
            <button class="glass-button" data-login-role="${profile.id}">Enter ${profile.label} View</button>
          </div>
        </div>
      `,
    )
    .join("");

  return `
    <section class="screen">
      <div class="login-layout">
        <div class="login-shell glass">
          <div class="eyebrow">Liquid Glass Prototype</div>
          <h2>Responsive political intelligence workspace</h2>
          <p class="muted">
            Explore the administrator and campaign manager experiences with desktop and mobile-friendly layouts.
            This prototype is static but fully clickable.
          </p>
          <div class="role-grid" style="margin-top: 18px;">
            ${roleTiles}
          </div>
        </div>
        <div class="login-shell glass">
          <h3>Prototype includes</h3>
          <div class="list">
            <div class="list-item">Login and role selection</div>
            <div class="list-item">Administrator dashboard</div>
            <div class="list-item">Campaign manager dashboard</div>
            <div class="list-item">District setup screen</div>
            <div class="list-item">Source registry and review screen</div>
          </div>
          <div style="margin-top: 18px;">
            ${badge(data.theme.name)}
            ${badge("Desktop + Mobile")}
            ${badge("Sample Data")}
          </div>
        </div>
      </div>
    </section>
  `;
}

function renderAdminDashboard() {
  return `
    <section class="screen">
      <div class="hero glass">
        <div class="eyebrow">Administrator</div>
        <h2>Control access, districts, and source quality</h2>
        <p>Review user access, maintain normalized segment definitions, and keep district source coverage clean and explainable.</p>
        <div class="mobile-nav">
          ${renderMobileNav()}
        </div>
      </div>

      <div class="stats-grid">
        <div class="stat-card glass">
          <h3>42 Active Users</h3>
          <div class="muted">4 pending invites</div>
        </div>
        <div class="stat-card glass">
          <h3>5 Segment Dimensions</h3>
          <div class="muted">29 allowed values</div>
        </div>
        <div class="stat-card glass">
          <h3>18 Tracked Sources</h3>
          <div class="muted">3 need review</div>
        </div>
        <div class="stat-card glass">
          <h3>7 Audit Events</h3>
          <div class="muted">1 high-priority impact</div>
        </div>
      </div>

      <div class="content-grid">
        <div class="panel-card glass">
          <h3>Segment Definitions</h3>
          <div class="list">
            ${data.segmentDefinitions
              .map(
                (definition) => `
                  <div class="list-item">
                    <strong>${definition.dimensionKey}</strong>
                    <div class="detail-line">${definition.values.join(", ")}</div>
                  </div>
                `,
              )
              .join("")}
          </div>
        </div>
        <div class="panel-card glass">
          <h3>User &amp; Privilege Overview</h3>
          <div class="list">
            ${data.users
              .map(
                (user) => `
                  <div class="list-item">
                    <strong>${user.name}</strong>
                    <div class="detail-line">${user.roleLabel}</div>
                    <div class="detail-line">${user.screens.join(" • ")}</div>
                  </div>
                `,
              )
              .join("")}
          </div>
        </div>
      </div>

      <div class="content-grid">
        <div class="panel-card glass">
          <h3>Source Review Queue</h3>
          <div class="list">
            ${data.sources
              .slice(0, 4)
              .map(
                (source) => `
                  <div class="source-row">
                    <strong>${source.name}</strong>
                    <div class="detail-line">${source.sourceType} • ${source.coverage}</div>
                    <div style="margin-top: 8px;">
                      ${badge(source.status, `status-${source.status}`)}
                      ${badge(`Confidence ${Math.round(source.confidenceScore * 100)}%`)}
                    </div>
                  </div>
                `,
              )
              .join("")}
          </div>
        </div>
        <div class="panel-card glass">
          <h3>Audit Timeline</h3>
          <div class="list">
            ${data.auditTimeline
              .map((item) => `<div class="list-item">${item}</div>`)
              .join("")}
          </div>
        </div>
      </div>
    </section>
  `;
}

function renderManagerDashboard() {
  return `
    <section class="screen">
      <div class="hero glass">
        <div class="eyebrow">Campaign Manager</div>
        <h2>${data.district.districtName} pulse</h2>
        <p>Track the strongest local issues, connect them to segments, and move quickly into event and outreach planning.</p>
        <div class="mobile-nav">
          ${renderMobileNav()}
        </div>
      </div>

      <div class="stats-grid">
        <div class="stat-card glass">
          <h3>Top Issue</h3>
          <div class="muted">School budget pressure</div>
        </div>
        <div class="stat-card glass">
          <h3>236 Projected</h3>
          <div class="muted">Town hall attendance</div>
        </div>
        <div class="stat-card glass">
          <h3>8 Active Sources</h3>
          <div class="muted">3 hyperlocal leaders</div>
        </div>
        <div class="stat-card glass">
          <h3>4 Saved Segments</h3>
          <div class="muted">Ready for outreach</div>
        </div>
      </div>

      <div class="content-grid three-up">
        <div class="panel-card glass">
          <h3>Issue Feed</h3>
          <div class="list">
            ${data.issues
              .map(
                (issue) => `
                  <div class="list-item">
                    <strong>${issue.title}</strong>
                    <div class="detail-line">${issue.trendDelta7d} in 7 days • ${issue.reach}</div>
                    <div style="margin-top: 8px;">${issue.segments.map((segment) => badge(segment)).join("")}</div>
                  </div>
                `,
              )
              .join("")}
          </div>
        </div>
        <div class="panel-card glass">
          <h3>Audience Segments</h3>
          <div class="list">
            ${data.audienceSegments
              .map(
                (segment) => `
                  <div class="list-item">
                    <strong>${segment.name}</strong>
                    <div class="detail-line">${segment.estimatedAudienceSize} estimated audience</div>
                    <div style="margin-top: 8px;">${segment.tags.map((tag) => badge(tag)).join("")}</div>
                  </div>
                `,
              )
              .join("")}
          </div>
        </div>
        <div class="panel-card glass">
          <h3>Events</h3>
          <div class="list">
            ${data.events
              .map(
                (event) => `
                  <div class="list-item">
                    <strong>${event.title}</strong>
                    <div class="detail-line">${event.startAt}</div>
                    <div class="detail-line">${event.projectedAttendance} projected attendees</div>
                  </div>
                `,
              )
              .join("")}
          </div>
        </div>
      </div>
    </section>
  `;
}

function renderDistrictSetup() {
  return `
    <section class="screen">
      <div class="hero glass">
        <div class="eyebrow">District Setup</div>
        <h2>Configure campaign geography and working assumptions</h2>
        <p>Designed for mobile and desktop editing with compact fields, reusable district records, and high-signal notes.</p>
        <div class="mobile-nav">
          ${renderMobileNav()}
        </div>
      </div>

      <div class="content-grid">
        <div class="section-card glass">
          <h3>Edit District Profile</h3>
          <div class="form-grid">
            <div class="field">
              <label>State</label>
              <input value="Maine" />
            </div>
            <div class="field">
              <label>Office Type</label>
              <select>
                <option selected>State House</option>
                <option>State Senate</option>
                <option>Mayor</option>
              </select>
            </div>
            <div class="field">
              <label>District Name</label>
              <input value="Maine House District 34" />
            </div>
            <div class="field">
              <label>District Number</label>
              <input value="34" />
            </div>
            <div class="field">
              <label>Municipalities</label>
              <input value="Arundel, Kennebunk, Kennebunkport" />
            </div>
            <div class="field">
              <label>ZIP Codes</label>
              <input value="04043, 04046" />
            </div>
            <div class="field" style="grid-column: 1 / -1;">
              <label>Notes</label>
              <textarea>Focus on shoreline resilience, school budget pressure, and local tax affordability.</textarea>
            </div>
          </div>
          <div class="actions" style="margin-top: 16px;">
            <button class="glass-button">Save District</button>
            <button class="glass-button subtle">Duplicate Setup</button>
          </div>
        </div>

        <div class="section-card glass">
          <h3>Saved District Profiles</h3>
          <div class="list">
            ${data.districts
              .map(
                (district) => `
                  <div class="list-item">
                    <strong>${district.districtName}</strong>
                    <div class="detail-line">${district.officeType}</div>
                    <div class="detail-line">${district.municipalities.join(", ")}</div>
                    <div style="margin-top: 8px;">${district.zipCodes.map((zip) => badge(zip)).join("")}</div>
                  </div>
                `,
              )
              .join("")}
          </div>
        </div>
      </div>
    </section>
  `;
}

function renderSources() {
  return `
    <section class="screen">
      <div class="hero glass">
        <div class="eyebrow">Sources</div>
        <h2>District source registry and review workflow</h2>
        <p>Review hyperlocal and regional sources, adjust confidence, and keep the district intelligence base current.</p>
        <div class="mobile-nav">
          ${renderMobileNav()}
        </div>
      </div>

      <div class="content-grid">
        <div class="section-card glass">
          <h3>Filters</h3>
          <div class="two-column">
            <div class="field">
              <label>District</label>
              <select>
                <option selected>Maine House District 34</option>
                <option>Maine House District 35</option>
              </select>
            </div>
            <div class="field">
              <label>Source Type</label>
              <select>
                <option selected>All source types</option>
                <option>Local Newspaper</option>
                <option>Town Newsletter</option>
                <option>Community Discussion</option>
              </select>
            </div>
            <div class="field">
              <label>Status</label>
              <select>
                <option selected>All statuses</option>
                <option>active</option>
                <option>review</option>
                <option>monitor</option>
              </select>
            </div>
            <div class="field">
              <label>Priority</label>
              <select>
                <option selected>All priorities</option>
                <option>high</option>
                <option>regional</option>
                <option>monitor</option>
              </select>
            </div>
          </div>
          <div class="actions" style="margin-top:16px;">
            <button class="glass-button">Apply Filters</button>
            <button class="glass-button subtle">Add Source</button>
          </div>
        </div>

        <div class="section-card glass">
          <h3>Review Summary</h3>
          <div class="list">
            <div class="list-item"><strong>Priority Collection</strong><div class="detail-line">Kennebunk Post, Weekly Sentinel, Kennebunk Currents, Village Facebook Group</div></div>
            <div class="list-item"><strong>Needs Review</strong><div class="detail-line">Weekly Sentinel, Village Facebook Group</div></div>
            <div class="list-item"><strong>Regional Support</strong><div class="detail-line">Portland Press Herald, Times Record</div></div>
          </div>
        </div>
      </div>

      <div class="section-card glass">
        <h3>Source Registry</h3>
        <div class="list">
          ${data.sources
            .map(
              (source) => `
                <div class="source-row">
                  <div style="display:flex; justify-content:space-between; gap:16px; flex-wrap:wrap;">
                    <div>
                      <strong>${source.name}</strong>
                      <div class="detail-line">${source.sourceType} • ${source.coverage}</div>
                    </div>
                    <div class="detail-line">Confidence ${Math.round(source.confidenceScore * 100)}%</div>
                  </div>
                  <div style="margin-top:10px;">
                    ${badge(source.priority)}
                    ${badge(source.status, `status-${source.status}`)}
                  </div>
                </div>
              `,
            )
            .join("")}
        </div>
      </div>
    </section>
  `;
}

function renderMobileNav() {
  if (!state.role) {
    return "";
  }

  return roleScreens[state.role]
    .map(
      (screen) => `
        <button class="glass-button ${screen.id === state.screen ? "active" : ""}" data-screen="${screen.id}">
          ${screen.label}
        </button>
      `,
    )
    .join("");
}

function renderNavigation() {
  if (!state.role) {
    sidebarRole.textContent = "Choose a role";
    navLinks.innerHTML = "";
    return;
  }

  const profile = data.loginProfiles.find((item) => item.id === state.role);
  sidebarRole.textContent = `${profile.label} View`;

  navLinks.innerHTML = roleScreens[state.role]
    .map(
      (screen) => `
        <button class="nav-link ${screen.id === state.screen ? "active" : ""}" data-screen="${screen.id}">
          ${screen.label}
        </button>
      `,
    )
    .join("");
}

function renderScreen() {
  let html = "";

  switch (state.screen) {
    case "admin-dashboard":
      html = renderAdminDashboard();
      break;
    case "manager-dashboard":
      html = renderManagerDashboard();
      break;
    case "district-setup":
      html = renderDistrictSetup();
      break;
    case "sources":
      html = renderSources();
      break;
    case "login":
    default:
      html = renderLogin();
      break;
  }

  screenHost.innerHTML = html;
  bindScreenEvents();
}

function bindScreenEvents() {
  screenHost.querySelectorAll("[data-login-role]").forEach((button) => {
    button.addEventListener("click", () => {
      const role = button.getAttribute("data-login-role");
      const profile = data.loginProfiles.find((item) => item.id === role);
      if (!profile) {
        return;
      }
      state.role = role;
      state.screen = profile.landingScreen;
      syncRoleButtons();
      renderNavigation();
      renderScreen();
    });
  });

  screenHost.querySelectorAll("[data-screen]").forEach((button) => {
    button.addEventListener("click", () => {
      const nextScreen = button.getAttribute("data-screen");
      if (!nextScreen) {
        return;
      }
      state.screen = nextScreen;
      renderNavigation();
      renderScreen();
    });
  });
}

function syncRoleButtons() {
  roleSwitchButtons.forEach((button) => {
    const role = button.getAttribute("data-role-switch");
    button.classList.toggle("active", role === state.role);
  });
}

roleSwitchButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const role = button.getAttribute("data-role-switch");
    const profile = data.loginProfiles.find((item) => item.id === role);
    if (!profile) {
      return;
    }
    state.role = role;
    state.screen = profile.landingScreen;
    syncRoleButtons();
    renderNavigation();
    renderScreen();
  });
});

logoutButton.addEventListener("click", () => {
  state.role = null;
  state.screen = "login";
  syncRoleButtons();
  renderNavigation();
  renderScreen();
});

renderNavigation();
renderScreen();
