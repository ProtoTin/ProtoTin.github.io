const clock = document.querySelector('#utc-clock');

function updateClock() {
  const now = new Date();
  clock.dateTime = now.toISOString();
  clock.textContent = `${now.toLocaleTimeString('en-US', {
    timeZone: 'UTC',
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })} UTC`;
}

updateClock();
setInterval(updateClock, 1000);

const rangeData = {
  '6h': {
    values: [18, 24, 16, 31, 28, 42, 36, 49, 44, 51, 47, 39, 54, 46, 41, 35],
    labels: ['09:00', '10:30', '12:00', '13:30', 'Now']
  },
  '24h': {
    values: [22, 19, 26, 23, 31, 41, 53, 44, 34, 30, 55, 43, 37, 28, 32, 25],
    labels: ['00:00', '06:00', '12:00', '18:00', 'Now']
  },
  '7d': {
    values: [34, 29, 38, 47, 43, 52, 58, 49, 41, 37, 45, 51, 48, 56, 44, 39],
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Today']
  }
};

const bars = [...document.querySelectorAll('.chart-bar')];
const chartLabels = document.querySelector('#chart-labels');

document.querySelectorAll('.range-control button').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.range-control button').forEach((item) => item.classList.remove('active'));
    button.classList.add('active');
    const data = rangeData[button.dataset.range];
    const max = Math.max(...data.values);

    bars.forEach((bar, index) => {
      const value = data.values[index];
      bar.style.setProperty('--height', `${Math.max(14, (value / max) * 92)}%`);
      bar.dataset.value = value;
      bar.setAttribute('aria-label', `${value} alerts`);
      bar.classList.toggle('hot', value >= max * .9);
    });

    chartLabels.innerHTML = data.labels.map((label) => `<span>${label}</span>`).join('');
  });
});

document.querySelectorAll('.filter-control button').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.filter-control button').forEach((item) => item.classList.remove('active'));
    button.classList.add('active');
    const filter = button.dataset.filter;

    document.querySelectorAll('#alert-table tr').forEach((row) => {
      row.hidden = filter !== 'all' && row.dataset.severity !== filter;
    });
  });
});

document.querySelectorAll('.rail-button[data-section]').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.rail-button[data-section]').forEach((item) => {
      const selected = item === button;
      item.classList.toggle('active', selected);
      item.setAttribute('aria-pressed', String(selected));
    });

    document.querySelector(`#${button.dataset.section}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

const alertDetails = {
  'DET-9482': {
    title: 'Brute-force attempt',
    source: 'VPN-Gateway-02',
    severity: 'Critical',
    state: 'Triage',
    technique: 'MITRE ATT&CK T1110',
    summary: 'Multiple failed authentication attempts were followed by a successful login from an anomalous source. The account has been queued for credential review and session revocation.'
  },
  'DET-9479': {
    title: 'Suspicious PowerShell',
    source: 'FIN-WS-118',
    severity: 'High',
    state: 'Open',
    technique: 'MITRE ATT&CK T1059.001',
    summary: 'An encoded PowerShell command launched from a user-writable directory. Endpoint isolation has been recommended while the process tree and parent-child relationships are reviewed.'
  },
  'DET-9468': {
    title: 'Malware signature',
    source: 'ENG-LT-044',
    severity: 'High',
    state: 'Contained',
    technique: 'MITRE ATT&CK T1204',
    summary: 'Endpoint protection matched a known malicious file signature. The file was quarantined and the host was isolated pending a full scan and evidence collection.'
  },
  'DET-9461': {
    title: 'Unusual outbound traffic',
    source: 'DB-PROD-01',
    severity: 'Medium',
    state: 'Review',
    technique: 'MITRE ATT&CK T1041',
    summary: 'The database server initiated an outbound connection to a previously unseen address. Network telemetry is under review to determine whether the transfer is authorized.'
  }
};

const dialog = document.querySelector('#alert-dialog');
const dialogTitle = document.querySelector('#dialog-title');
const dialogContent = document.querySelector('#dialog-content');

function openAlert(row) {
  const id = row.dataset.alert;
  const detail = alertDetails[id];
  dialogTitle.textContent = detail.title;
  dialogContent.innerHTML = `
    <div class="detail-grid">
      <div class="detail-field"><span>Detection ID</span><strong>${id}</strong></div>
      <div class="detail-field"><span>Source asset</span><strong>${detail.source}</strong></div>
      <div class="detail-field"><span>Severity</span><strong>${detail.severity}</strong></div>
      <div class="detail-field"><span>Workflow state</span><strong>${detail.state}</strong></div>
    </div>
    <p class="detail-summary">${detail.summary}</p>
    <span class="mitre-tag">${detail.technique}</span>
  `;
  dialog.showModal();
}

document.querySelectorAll('#alert-table tr').forEach((row) => {
  row.addEventListener('click', () => openAlert(row));
  row.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openAlert(row);
    }
  });
});

document.querySelector('#dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', (event) => {
  if (event.target === dialog) dialog.close();
});
