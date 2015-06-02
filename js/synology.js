define(["graphs"], function(Graphs) {
  var Synology = {
    fetchStatus: function(username) {
      chrome.storage.sync.get(['password', 'server', 'ssl'], function(storageresult) {
        var baseUrl = getBaseUrl(storageresult.server, storageresult.ssl);

        $.get(baseUrl + "/webapi/auth.cgi?api=SYNO.API.Auth&version=2&method=login&account=" + encodeURIComponent(username) + "&passwd=" + encodeURIComponent(storageresult.password) + "&session=DownloadStation&format=sid", function(data) {

          var loginResult = JSON.parse(data);
          if (loginResult.success) {
            Synology.fetchDSMData(baseUrl, storageresult, false);

            ticker = setInterval(function(storageresult) {
              Synology.fetchDSMData(baseUrl, storageresult, true);
              _gaq.push(['_trackPageview', '/refresh.html']);
            }, 5000, storageresult);
          } else {
            showError(chrome.i18n.getMessage("loginError"));
            $('.loader').hide();
          }
        }).error(function() {
          showError(chrome.i18n.getMessage("loginError"));
          $('.loader').hide();
        });
      });
    },
    fetchDSMData: function(baseUrl, storageresult, reload) {
      $.get(baseUrl + "/webapi/dsm/info.cgi?api=SYNO.DSM.Info&version=1&method=getinfo", function(data) {
        var infoResult = JSON.parse(data);

        if (infoResult.success) {
          $('.dsminfo').show();
          $('.loader').hide();
          $('.dsmmodel').text(infoResult.data.model);
          $('.dsmversion').text(infoResult.data.version);
          $('.dsmtemperature').text(infoResult.data.temperature);
        } else {
          showError("Error fetching DSM status!");
        }
      });
      $.get(baseUrl + "/webapi/_______________________________________________________entry.cgi?stop_when_error=false&compound=%5B%7B%22api%22%3A%22SYNO.Entry.Request%22%2C%22method%22%3A%22request%22%2C%22version%22%3A1%2C%22compound%22%3A%5B%7B%22api%22%3A%22SYNO.Core.AppNotify%22%2C%22method%22%3A%22get%22%2C%22version%22%3A1%7D%5D%7D%2C%7B%22api%22%3A%22SYNO.Core.System.Utilization%22%2C%22method%22%3A%22get%22%2C%22version%22%3A1%2C%22type%22%3A%22current%22%7D%5D&api=SYNO.Entry.Request&method=request&version=1", function(data) {
        var sysResult = data;
        var cpuPercentage = sysResult.data.result[1].data.cpu.other_load + sysResult.data.result[1].data.cpu.system_load + sysResult.data.result[1].data.cpu.user_load;

        if (reload) {
          Graphs.update(sysResult);
        } else {
          Graphs.init(sysResult);
        }

        $('.loader').hide();
      });
    }
  };
  return Synology;
});
