const mdns = require('mdns-js');

const browser = mdns.createBrowser();
console.log(browser,'help');
browser.on('ready', function () {
  browser.discover();
});

browser.on('update', function (data) {
    console.log('hep');
  console.log('New service discovered:', data.fullname);
  // You can access the service details from the data object
  // For example, data.addresses will give you an array of IP addresses
});

browser.start(); // Start the browser

// You can also stop the browser by calling browser.stop()