(function () {
  // Degrees of latitude/longitude to move the simulated marker each refresh.
  const SIMULATED_MOVEMENT_DELTA = 0.01;
  // Degrees around the marker used to render the map bounding box.
  const MAP_BBOX_OFFSET = 0.2;

  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', function (event) {
      event.preventDefault();
      const formData = new FormData(loginForm);
      const role = formData.get('role') || 'customer';
      window.location.href = `dashboard.html?role=${encodeURIComponent(role)}`;
    });
  }

  const rolePanels = document.getElementById('role-panels');
  if (rolePanels) {
    const queryRole = new URLSearchParams(window.location.search).get('role');
    const role = queryRole === 'employee' ? 'employee' : 'customer';
    const title = document.getElementById('dashboard-title');
    const subtitle = document.getElementById('dashboard-subtitle');

    title.textContent = role === 'employee' ? 'Employee Operations Dashboard' : 'Customer Cargo Dashboard';
    subtitle.textContent =
      role === 'employee'
        ? 'Track customers, invoices and current trips from one operational view.'
        : 'Track your cargo, trips and billing information in real time.';

    const employeePanels = [
      ['Current Customers', 'Acme Foods, Portline Imports, Horizon Manufacturing'],
      ['Current Invoices', '#INV-10231 | #INV-10244 | #INV-10270'],
      ['Past Invoices', '#INV-10001 | #INV-10044 | #INV-10122'],
      ['Current Trips', 'TR-8912 (active), TR-9011 (loading), TR-9034 (in transit)']
    ];

    const customerPanels = [
      ['My Cargo', 'Container CX-2049 (in transit), Pallet P-932 (arrived)'],
      ['Past Trips', 'TR-8700 (completed), TR-8621 (completed), TR-8550 (completed)'],
      ['Current Invoice', '#INV-10231 - Due in 10 days'],
      ['Credit Line', 'Available: USD 120,000'],
      ['Past Invoices', '#INV-9931 (paid), #INV-9877 (paid), #INV-9802 (paid)']
    ];

    const selectedPanels = role === 'employee' ? employeePanels : customerPanels;
    rolePanels.innerHTML = selectedPanels
      .map(function ([heading, body]) {
        return `<article class="card"><h3>${heading}</h3><p>${body}</p></article>`;
      })
      .join('');

    const liveCoords = document.getElementById('live-coords');
    const liveMap = document.getElementById('live-map');
    let lat = 25.7617;
    let lon = -80.1918;
    let liveMapIntervalId;

    function updateLiveMap() {
      lat += SIMULATED_MOVEMENT_DELTA;
      lon += SIMULATED_MOVEMENT_DELTA;
      liveCoords.textContent = `Latest position: ${lat.toFixed(4)}, ${lon.toFixed(4)}`;
      liveMap.src = `https://www.openstreetmap.org/export/embed.html?bbox=${lon - MAP_BBOX_OFFSET}%2C${lat - MAP_BBOX_OFFSET}%2C${lon + MAP_BBOX_OFFSET}%2C${lat + MAP_BBOX_OFFSET}&layer=mapnik&marker=${lat}%2C${lon}`;
    }

    updateLiveMap();
    liveMapIntervalId = window.setInterval(updateLiveMap, 5000);
    window.addEventListener('beforeunload', function () {
      window.clearInterval(liveMapIntervalId);
    });
  }
})();
