define(["vendor/quickconnectid.min"], function() {
  var Synology = {
    authenticate: function(username, password, server, ssl, success, error) {
      getBaseUrl(server, ssl, function(baseUrl) {
          $.get(baseUrl + "/webapi/auth.cgi?api=SYNO.API.Auth&version=2&method=login&account=" + encodeURIComponent(username) + "&passwd=" + encodeURIComponent(password) + "&session=DownloadStation&format=sid", function(data) {

            var loginResult = JSON.parse(data);
            if (loginResult.success) {
              success(baseUrl)
            } else {
              error(chrome.i18n.getMessage("loginError"));

            }
          }).error(function() {
            error(chrome.i18n.getMessage("loginError"));

          });
        },
        function(error) {
          error(error);
        });
    },
    startFetchDSMData: function(baseUrl, success, error) {
      $.get(baseUrl + "/webman/modules/SystemInfoApp/SystemInfo.cgi?query=systemHealth", function(info) {
        var infoResult = JSON.parse(info);
        $.get(baseUrl + "/webapi/entry.cgi?stop_when_error=false&compound=%5B%7B%22api%22%3A%22SYNO.Entry.Request%22%2C%22method%22%3A%22request%22%2C%22version%22%3A1%2C%22compound%22%3A%5B%7B%22api%22%3A%22SYNO.Core.AppNotify%22%2C%22method%22%3A%22get%22%2C%22version%22%3A1%7D%5D%7D%2C%7B%22api%22%3A%22SYNO.Core.System.Utilization%22%2C%22method%22%3A%22get%22%2C%22version%22%3A1%2C%22type%22%3A%22current%22%7D%5D&api=SYNO.Entry.Request&method=request&version=1", function(entry) {
          var entryResult = entry;
          if (infoResult.disks) {
            success({
              baseUrl: baseUrl,
              info: infoResult,
              entry: entryResult
            })
          } else {
            error("Error fetching DSM status!");
          }
        });

      });


    }
  };
  return Synology;
});
