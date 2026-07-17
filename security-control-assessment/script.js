const TARGET_TIER = 3;
const STORAGE_KEY = 'northstar-csf-assessment-v1';

const functions = [
  {
    id: 'govern', code: 'GV', name: 'Govern', color: '#435b4f',
    description: 'Strategy, expectations, policy, roles, and oversight',
    controls: [
      { id: 'GV.PO-01', title: 'Cybersecurity policy', description: 'A risk-based cybersecurity policy is established, communicated, and enforced.', baseline: 1, weight: 3, action: 'Approve and publish a concise cybersecurity policy tied to business priorities and assign an annual review owner.' },
      { id: 'GV.RR-02', title: 'Roles and accountability', description: 'Cybersecurity responsibilities and decision authority are defined and understood.', baseline: 2, weight: 3, action: 'Create a RACI for security decisions, incidents, access approvals, and third-party risk.' },
      { id: 'GV.SC-04', title: 'Supplier prioritization', description: 'Technology suppliers are known and prioritized according to criticality.', baseline: 1, weight: 2, action: 'Inventory vendors, identify critical providers, and document minimum security review requirements.' }
    ]
  },
  {
    id: 'identify', code: 'ID', name: 'Identify', color: '#496b78',
    description: 'Assets, risks, vulnerabilities, and improvement opportunities',
    controls: [
      { id: 'ID.AM-01/02', title: 'Asset inventory', description: 'Hardware, software, services, and systems are inventoried and maintained.', baseline: 2, weight: 3, action: 'Assign asset owners and reconcile endpoint, SaaS, and cloud inventories on a defined schedule.' },
      { id: 'ID.RA-01', title: 'Vulnerability tracking', description: 'Asset vulnerabilities are identified, validated, recorded, and prioritized.', baseline: 2, weight: 3, action: 'Establish recurring authenticated scans and a risk-based remediation queue with owners and due dates.' },
      { id: 'ID.IM-04', title: 'Plan improvement', description: 'Cybersecurity and incident plans are maintained and improved through lessons learned.', baseline: 1, weight: 2, action: 'Schedule a tabletop exercise and track lessons learned through approved plan updates.' }
    ]
  },
  {
    id: 'protect', code: 'PR', name: 'Protect', color: '#80652f',
    description: 'Identity, training, data security, platforms, and resilience',
    controls: [
      { id: 'PR.AA-05', title: 'Least-privilege access', description: 'Permissions are defined, enforced, reviewed, and separated by duty.', baseline: 2, weight: 3, action: 'Review privileged access quarterly, remove stale entitlements, and require MFA for administrative roles.' },
      { id: 'PR.AT-01', title: 'Security awareness', description: 'Personnel receive practical cybersecurity awareness and role-appropriate training.', baseline: 1, weight: 2, action: 'Launch annual awareness training with phishing simulations and targeted follow-up coaching.' },
      { id: 'PR.DS-11', title: 'Protected backups', description: 'Backups are created, protected, maintained, and regularly tested.', baseline: 2, weight: 3, action: 'Document backup coverage, add an isolated copy, and test restoration of a critical service.' }
    ]
  },
  {
    id: 'detect', code: 'DE', name: 'Detect', color: '#86513d',
    description: 'Continuous monitoring and analysis of adverse events',
    controls: [
      { id: 'DE.CM-01', title: 'Network monitoring', description: 'Networks and network services are monitored for potentially adverse events.', baseline: 2, weight: 3, action: 'Centralize firewall, VPN, DNS, and identity logs with defined retention and alert ownership.' },
      { id: 'DE.CM-09', title: 'Endpoint monitoring', description: 'Hardware, software, runtime environments, and data are monitored for anomalies.', baseline: 2, weight: 3, action: 'Confirm endpoint telemetry coverage and alert on disabled agents, suspicious scripts, and malware activity.' },
      { id: 'DE.AE-03', title: 'Event correlation', description: 'Information from multiple sources is correlated to characterize adverse events.', baseline: 1, weight: 2, action: 'Create correlation rules that combine authentication, endpoint, and network evidence for high-risk behavior.' }
    ]
  },
  {
    id: 'respond', code: 'RS', name: 'Respond', color: '#7a3f45',
    description: 'Incident management, analysis, communication, and mitigation',
    controls: [
      { id: 'RS.MA-02', title: 'Incident triage', description: 'Incident reports are consistently triaged, validated, categorized, and prioritized.', baseline: 2, weight: 3, action: 'Define severity criteria, triage evidence requirements, ownership, and escalation timeframes.' },
      { id: 'RS.AN-03', title: 'Root-cause analysis', description: 'Investigations establish what occurred and identify the incident root cause.', baseline: 1, weight: 2, action: 'Adopt a repeatable investigation worksheet covering timeline, scope, root cause, and evidence provenance.' },
      { id: 'RS.CO-02', title: 'Stakeholder notification', description: 'Internal and external stakeholders are notified according to approved requirements.', baseline: 1, weight: 3, action: 'Create an incident communication matrix with decision owners, contact paths, and notification triggers.' }
    ]
  },
  {
    id: 'recover', code: 'RC', name: 'Recover', color: '#4d6482',
    description: 'Restoration planning, validation, and recovery communication',
    controls: [
      { id: 'RC.RP-03', title: 'Restoration integrity', description: 'Backup and restoration assets are verified before they are used for recovery.', baseline: 2, weight: 3, action: 'Add integrity validation and malware checks to the recovery runbook before restoration begins.' },
      { id: 'RC.RP-05', title: 'Recovery validation', description: 'Restored assets are verified and normal operating status is formally confirmed.', baseline: 1, weight: 3, action: 'Define technical and business acceptance tests for declaring services restored.' },
      { id: 'RC.CO-03', title: 'Recovery communication', description: 'Recovery progress is communicated to designated internal and external stakeholders.', baseline: 1, weight: 2, action: 'Prepare recovery status templates and assign responsibility for update cadence and approval.' }
    ]
  }
];

const baselineScores = Object.fromEntries(functions.flatMap((fn) => fn.controls.map((control) => [control.id, control.baseline])));
let scores = loadScores();
let selectedPhase = 'all';

const assessmentRoot = document.querySelector('#function-assessments');
const breakdownRoot = document.querySelector('#score-breakdown');
const roadmapRoot = document.querySelector('#roadmap-list');
const completeState = document.querySelector('#complete-state');

function loadScores() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return stored && typeof stored === 'object' ? { ...baselineScores, ...stored } : { ...baselineScores };
  } catch {
    return { ...baselineScores };
  }
}

function tierName(score) {
  if (score >= 3.5) return 'Tier 4 · Adaptive';
  if (score >= 2.5) return 'Tier 3 · Repeatable';
  if (score >= 1.5) return 'Tier 2 · Risk Informed';
  return 'Tier 1 · Partial';
}

function renderAssessment() {
  assessmentRoot.innerHTML = functions.map((fn) => `
    <article class="function-card" style="--function-color:${fn.color}">
      <div class="function-head">
        <span class="function-code">${fn.code}</span>
        <div><h3>${fn.name}</h3><p>${fn.description}</p></div>
        <strong class="function-score" data-function-score="${fn.id}">0.0</strong>
      </div>
      <ul class="control-list">
        ${fn.controls.map((control) => `
          <li class="control-row">
            <div class="control-copy">
              <span class="control-id">${control.id}</span>
              <strong>${control.title}</strong>
              <p>${control.description}</p>
            </div>
            <div class="tier-buttons" role="group" aria-label="Maturity tier for ${control.title}">
              ${[1, 2, 3, 4].map((tier) => `<button class="tier-button ${scores[control.id] === tier ? 'selected' : ''}" type="button" data-control="${control.id}" data-tier="${tier}" aria-label="Set ${control.title} to Tier ${tier}" aria-pressed="${scores[control.id] === tier}">${tier}</button>`).join('')}
            </div>
          </li>
        `).join('')}
      </ul>
    </article>
  `).join('');

  assessmentRoot.querySelectorAll('.tier-button').forEach((button) => {
    button.addEventListener('click', () => {
      scores[button.dataset.control] = Number(button.dataset.tier);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(scores));
      document.querySelector('#save-status').textContent = 'Saved in this browser';
      renderAssessment();
      updateResults();
    });
  });
}

function functionAverage(fn) {
  return fn.controls.reduce((sum, control) => sum + scores[control.id], 0) / fn.controls.length;
}

function updateResults() {
  const allControls = functions.flatMap((fn) => fn.controls);
  const overall = allControls.reduce((sum, control) => sum + scores[control.id], 0) / allControls.length;
  const gaps = allControls.filter((control) => scores[control.id] < TARGET_TIER);
  const priorityGaps = gaps.filter((control) => control.weight === 3 && scores[control.id] <= 1);

  document.querySelector('#overall-score').textContent = overall.toFixed(1);
  document.querySelector('#tier-result').textContent = tierName(overall);
  document.querySelector('#gap-count').textContent = gaps.length;
  document.querySelector('#priority-count').textContent = priorityGaps.length;

  breakdownRoot.innerHTML = functions.map((fn) => {
    const average = functionAverage(fn);
    const scoreNode = document.querySelector(`[data-function-score="${fn.id}"]`);
    if (scoreNode) scoreNode.textContent = average.toFixed(1);
    return `<div class="score-row"><span>${fn.name}</span><div class="score-track"><i style="--score-width:${average / 4 * 100}%"></i></div><strong>${average.toFixed(1)}</strong></div>`;
  }).join('');

  renderRoadmap(gaps);
}

function phaseFor(control) {
  const gap = TARGET_TIER - scores[control.id];
  const priority = gap * control.weight;
  if (priority >= 5) return 'now';
  if (priority >= 3) return 'next';
  return 'later';
}

function renderRoadmap(gaps) {
  const phaseLabels = { now: '0–30 days', next: '31–90 days', later: '91–180 days' };
  const sorted = [...gaps].sort((a, b) => ((TARGET_TIER - scores[b.id]) * b.weight) - ((TARGET_TIER - scores[a.id]) * a.weight));
  completeState.hidden = sorted.length !== 0;
  roadmapRoot.hidden = sorted.length === 0;
  roadmapRoot.innerHTML = sorted.map((control) => {
    const phase = phaseFor(control);
    const functionName = functions.find((fn) => fn.controls.some((item) => item.id === control.id)).name;
    return `
      <article class="roadmap-item" data-phase="${phase}" ${selectedPhase !== 'all' && selectedPhase !== phase ? 'hidden' : ''}>
        <span class="phase-tag ${phase}">${phaseLabels[phase]}</span>
        <span class="roadmap-code">${control.id}</span>
        <div class="roadmap-copy"><strong>${control.title}</strong><p>${control.action}</p></div>
        <div class="roadmap-gap"><strong>+${TARGET_TIER - scores[control.id]}</strong><span>${functionName} gap</span></div>
      </article>`;
  }).join('');
}

document.querySelectorAll('.roadmap-filters button').forEach((button) => {
  button.addEventListener('click', () => {
    selectedPhase = button.dataset.phase;
    document.querySelectorAll('.roadmap-filters button').forEach((item) => item.classList.toggle('active', item === button));
    updateResults();
  });
});

document.querySelector('#reset-baseline').addEventListener('click', () => {
  scores = { ...baselineScores };
  localStorage.removeItem(STORAGE_KEY);
  document.querySelector('#save-status').textContent = 'Baseline scenario restored';
  renderAssessment();
  updateResults();
});

document.querySelector('#download-summary').addEventListener('click', () => {
  const allControls = functions.flatMap((fn) => fn.controls);
  const overall = allControls.reduce((sum, control) => sum + scores[control.id], 0) / allControls.length;
  const gaps = allControls.filter((control) => scores[control.id] < TARGET_TIER)
    .sort((a, b) => ((TARGET_TIER - scores[b.id]) * b.weight) - ((TARGET_TIER - scores[a.id]) * a.weight));
  const lines = [
    'NORTHSTAR SECURITY CONTROL ASSESSMENT',
    'Fictional organization: Harborlight Services',
    `Overall score: ${overall.toFixed(1)} / 4.0 (${tierName(overall)})`,
    'Target profile: Tier 3 · Repeatable',
    '',
    'FUNCTION SCORES',
    ...functions.map((fn) => `${fn.name}: ${functionAverage(fn).toFixed(1)} / 4.0`),
    '',
    'REMEDIATION ROADMAP',
    ...gaps.map((control, index) => `${index + 1}. [${phaseFor(control).toUpperCase()}] ${control.id} ${control.title}\n   ${control.action}`),
    '',
    'Disclosure: Educational NIST CSF 2.0-aligned demonstration; not an official audit or certification.',
    'Direction and content by Tin Aung. Design and code created with OpenAI Codex.'
  ];
  const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'northstar-security-assessment.txt';
  link.click();
  URL.revokeObjectURL(link.href);
});

renderAssessment();
updateResults();
