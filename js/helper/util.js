function getBaseUrl(server, ssl, success, failure) {
  if (validateUrl(server)) {
    success((ssl ? "https" : "http") + "://" + server);
  } else {
    var quickConnect = new QuickConnect(server);
    quickConnect.determineServerURL(function(url) {
      success(url);
    }, function(error) {
      failure(error)
    });
  }
}

function validateUrl(value) {
  return (/^(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}(\.[a-z]{2,6})?:([1-9]+)$/gi.test(value)) || /^(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}):(\d{1,5})$/gi.test(value);
}

function doTranslation() {
  $("[data-translation]").each(function(index) {
    var translation = chrome.i18n.getMessage($(this).data('translation'));
    $(this).html(translation);
  });

  $("[data-translation-placeholder]").each(function(index) {
    var translation = chrome.i18n.getMessage($(this).data('translation-placeholder'));
    $(this).attr('placeholder', translation);
  });
}

function showError(message) {
  $('.logged-in-panel .alert').addClass('alert-danger');
  $('.logged-in-panel .alert .text').html(message);
  $('.logged-in-panel .alert').show();
}
