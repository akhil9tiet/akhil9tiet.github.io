(function () {
  'use strict';

  var output = document.getElementById('visitor-location-value');

  function publishLocation(location) {
    if (output) output.textContent = location;
    window.siteVisitorLocation = location;
    window.dispatchEvent(new CustomEvent('visitor-location-resolved', {
      detail: { location: location }
    }));
  }

  function lookupLocation() {
    if (output) output.textContent = 'checking...';

    return fetch('https://ipapi.co/json/', {
      method: 'GET',
      mode: 'cors',
      credentials: 'omit',
      cache: 'no-store'
    })
      .then(function (response) {
        if (!response.ok) throw new Error('Location lookup unavailable');
        return response.json();
      })
      .then(function (data) {
        if (data.error) throw new Error('Location lookup unavailable');

        var parts = [data.city, data.region, data.country_name]
          .filter(function (part, index, values) {
            return typeof part === 'string' && part.trim() && values.indexOf(part) === index;
          })
          .map(function (part) { return part.trim(); });

        if (!parts.length) throw new Error('Location not available');
        publishLocation(parts.join(', ') + ' (approx.)');
      })
      .catch(function () {
        publishLocation('approximate location unavailable');
      });
  }

  // Populate the terminal's `location --approx` command automatically on page load.
  lookupLocation();
}());
