(function () {
  'use strict';

  var button = document.getElementById('visitor-location-button');
  var output = document.getElementById('visitor-location-value');
  if (!button || !output) return;

  button.addEventListener('click', function () {
    button.disabled = true;
    button.textContent = 'Checking approximate location...';
    output.textContent = 'checking';

    fetch('https://ipapi.co/json/', {
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
        output.textContent = parts.join(', ') + ' (approx.)';
        button.textContent = 'Refresh approximate location';
      })
      .catch(function () {
        output.textContent = 'location unavailable';
        button.textContent = 'Try location lookup again';
      })
      .finally(function () {
        button.disabled = false;
      });
  });
}());
