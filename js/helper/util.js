function getBaseUrl(server, ssl) {
  if (validateUrl(server)) {
    return (ssl ? "https" : "http") + "://" + server;
  } else {
    return (ssl ? "https" : "http") + "://" + server + ".uk.quickconnect.to";
  }
}

function validateUrl(value) {
  return (/^(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/gi.test(value)) || /^(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}):(\d{1,5})$/gi.test(value);
}

function doTranslation() {
  $("[data-translation]").each(function(index) {
    var translation = chrome.i18n.getMessage($(this).data('translation'));
    $(this).text(translation);
  });

  $("[data-translation-placeholder]").each(function(index) {
    var translation = chrome.i18n.getMessage($(this).data('translation-placeholder'));
    $(this).attr('placeholder', translation);
  });
}

function showError(message) {
  $('.logged-in-panel .alert').addClass('alert-danger');
  $('.logged-in-panel .alert .text').text(message);
  $('.logged-in-panel .alert').show();
}
