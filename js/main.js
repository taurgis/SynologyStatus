requirejs(["./synology", "vendor/jquery-2.1.4.min", "helper/util", ], function(Synology) {
  $(document).ready(function() {
    doTranslation();
    reloadMain();
    initJqueryEvents();
  });

  function initJqueryEvents() {
    $('#login-submit').on('click', function(e) {
      var username = $('#login-form').find('#username').val();
      var password = $('#login-form').find('#password').val();
      var server = $('#login-form').find('#server').val();
      var ssl = $('#login-form').find('#ssl').prop('checked');

      chrome.storage.sync.set({
        'username': username,
        'password': password,
        'server': server,
        'ssl': ssl
      }, function(result) {
        $('.dsm-info').hide();
        $('.loader').show();
        reloadMain();
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
  }

  function reloadMain() {
    $('.dsm-info').hide();
    $('.logged-in-panel').hide();

    chrome.storage.sync.get(['username', 'password', 'server', 'ssl'], function(result) {
      if (result.username && result.password) {
        $('.login-panel').hide();
        $('.loader').show();
        $('.logged-in-panel').show();

        $('.logged-in-as').text(chrome.i18n.getMessage("welcome") + result.username);

        loginAndLoadDSMData(result.username, result.password, result.server, result.ssl);
      } else {
        $('.logged-in-panel').hide();
        $('.login-panel').show();

        $('#login-form').find('#username').val(result.username);
        $('#login-form').find('#server').val(result.server);
        if (result.ssl) {
          $('#login-form').find('#ssl').prop('checked', true);
        } else {
          $('#login-form').find('#ssl').prop('checked', false);
        }
      }
    });
  }

  function loginAndLoadDSMData(username, password, server, ssl) {
    Synology.authenticate(username, password, server, ssl, function(baseUrl) {
      loadDSMData(baseUrl);
    }, function(errorMessage) {
      $('.loader').hide();
      showError((errorMessage) ? errorMessage : chrome.i18n.getMessage("loginError"));
    });
  }

  function loadDSMData(baseUrl) {
    Synology.startFetchDSMData(baseUrl, function(result) {
      var infoResult = result.info;
      var entryResult = result.entry;
      var baseUrl = result.baseUrl;

      var uptime = infoResult.optime;
      var splitUptime = uptime.split(':');


      $('.dsmmodel').text(infoResult.disks[0].container.str);
      $('.dsmtemperature').text(infoResult.disks[0].temp + ' (' + ((infoResult.temperature_warning) ? "NOK" : "OK") + ")");
      $('.dsmuptime').text(splitUptime[0] + ' ' + chrome.i18n.getMessage("hours") + ' ' + splitUptime[1] + ' ' + chrome.i18n.getMessage("minutes") + ' ' + splitUptime[2] + ' ' + chrome.i18n.getMessage("seconds"));

      var diskUsage = infoResult.vol_info[0].used_size / infoResult.vol_info[0].total_size;
      var used_size_mb = Math.trunc(infoResult.vol_info[0].used_size / 1024 / 1024 / 1024);
      var total_size_mb = Math.trunc(infoResult.vol_info[0].total_size / 1024 / 1024 / 1024);
      $('.dsmdisktext').text(used_size_mb + " / " + total_size_mb + " MB");

      updatePercentageBar('disk', Math.trunc(diskUsage * 100));

      var cpuPercentage = entryResult.data.result[1].data.cpu.other_load + entryResult.data.result[1].data.cpu.system_load + entryResult.data.result[1].data.cpu.user_load;
      updatePercentageBar('cpu', cpuPercentage);

      var memoryUsage = entryResult.data.result[1].data.memory.real_usage;
      updatePercentageBar('memory', memoryUsage);

      $('.dsm-info').show();
      $('.loader').hide();
      
      _gaq.push(['_trackPageview', '/refresh.html']);

      setTimeout(loadDSMData, 5000, baseUrl);
    }, function(error) {
      showError(error);
    });
  }

  function updatePercentageBar(field, fieldValue) {
    $('.dsm' + field).text(fieldValue + " %");
    $('.dsm' + field + 'percentage').width(fieldValue + "%");

    if (fieldValue > 70) {
      $('.dsm' + field + 'percentage').addClass('progress-bar-warning');
    } else if (fieldValue > 90) {
      $('.dsm' + field + 'percentage').addClass('progress-bar-danger');
    }
  }

  function logout() {
    chrome.storage.sync.remove('password', function() {
      location.reload();
    });
  }
});
