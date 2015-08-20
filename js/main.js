requirejs(["./synology", "vendor/jquery-2.1.4.min", "helper/util", ], function(Synology) {
  var ticker;

  $(document).ready(function() {
    doTranslation();
    reloadMain();

    $('#login-submit').on('click', function(e) {
      var username = $('#login-form').find('#username').val();
      var password = $('#login-form').find('#password').val();
      var server = $('#login-form').find('#server').val();
      var ssl = $('#login-form').find('#ssl').prop('checked');

      chrome.storage.sync.set({
        'username': username
      }, function(result) {
        $('.dsminfo').hide();
        $('.loader').show();
        reloadMain();
      });

      chrome.storage.sync.set({
        'password': password
      });
      chrome.storage.sync.set({
        'server': server
      });
      chrome.storage.sync.set({
        'ssl': ssl
      });
    });

    $('#logout-button').on('click', function(result) {
      logout();

    });

    $('.close').on('click', function() {
      logout();
    });

    $('#login-form .form-control').keypress(function(e) {
      if (e.which == 13) {
        $('#login-submit').trigger('click');
      }
    });
  });

  function reloadMain() {
    chrome.storage.sync.get('username', function(result) {
      if (result.username) {
        $('.login-panel').hide();
        $('.logged-in-panel').show();

        $('.logged-in-as').text(chrome.i18n.getMessage("welcome") + result.username);

        Synology.fetchStatus(result.username);
      } else {
        $('.logged-in-panel').hide();
        $('.login-panel').show();
      }
    });
  }

  function logout() {
    chrome.storage.sync.remove('username', function() {
      location.reload();
    });
  }
});