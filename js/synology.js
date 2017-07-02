define([], function() {
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
            $.get(baseUrl + "/webman/modules/SystemInfoApp/SystemInfo.cgi?_dc=1499022065422&query=systemHealth", function(data) {
                var infoResult = JSON.parse(data);

                if (infoResult.disks) {
                    var uptime = infoResult.optime;
                    var splitUptime = uptime.split(':');


                    $('.dsmmodel').text(infoResult.disks[0].container.str);
                    $('.dsmtemperature').text(infoResult.disks[0].temp + ' (' + ((infoResult.temperature_warning) ? "NOK" : "OK") + ")");
                    $('.dsmuptime').text(splitUptime[0] + ' ' + chrome.i18n.getMessage("hours") + ' ' + splitUptime[1] + ' ' + chrome.i18n.getMessage("minutes") + ' ' + splitUptime[2] + ' ' + chrome.i18n.getMessage("seconds"));

                    var diskUsage = infoResult.vol_info[0].used_size / infoResult.vol_info[0].total_size;
                    var used_size_mb = Math.trunc(infoResult.vol_info[0].used_size / 1024 / 1024 / 1024);
                    var total_size_mb = Math.trunc(infoResult.vol_info[0].total_size / 1024 / 1024 / 1024);
                    $('.dsmdiskspaceused').text(used_size_mb + " / " + total_size_mb + " MB");
                    $('.dsmdiskspace').width(Math.trunc(diskUsage * 100) + '%');

                    $('.dsm-info').show();
                    $('.loader').hide();
                } else {
                    showError("Error fetching DSM status!");
                }
            });
            /*
                  $.get(baseUrl + "/webapi/entry.cgi?stop_when_error=false&compound=%5B%7B%22api%22%3A%22SYNO.Entry.Request%22%2C%22method%22%3A%22request%22%2C%22version%22%3A1%2C%22compound%22%3A%5B%7B%22api%22%3A%22SYNO.Core.AppNotify%22%2C%22method%22%3A%22get%22%2C%22version%22%3A1%7D%5D%7D%2C%7B%22api%22%3A%22SYNO.Core.System.Utilization%22%2C%22method%22%3A%22get%22%2C%22version%22%3A1%2C%22type%22%3A%22current%22%7D%5D&api=SYNO.Entry.Request&method=request&version=1", function(data) {
                      var sysResult = data;
                      var cpuPercentage = sysResult.data.result[1].data.cpu.other_load + sysResult.data.result[1].data.cpu.system_load + sysResult.data.result[1].data.cpu.user_load;



                  });
                        */
        }
    };
    return Synology;
});
