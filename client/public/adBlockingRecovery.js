// Load Google Funding Choices script dynamically
(function () {
  var script = document.createElement("script");
  script.async = true;
  script.src =
    "https://fundingchoicesmessages.google.com/i/pub-6209982480530655?ers=1";
  document.head.appendChild(script);

  function signalGooglefcPresent() {
    if (!window.frames["googlefcPresent"]) {
      if (document.body) {
        const iframe = document.createElement("iframe");
        iframe.style =
          "width: 0; height: 0; border: none; z-index: -1000; left: -1000px; top: -1000px;";
        iframe.style.display = "none";
        iframe.name = "googlefcPresent";
        document.body.appendChild(iframe);
      } else {
        setTimeout(signalGooglefcPresent, 0);
      }
    }
  }
  signalGooglefcPresent();
})();
