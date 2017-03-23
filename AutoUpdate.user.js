// ==UserScript==
// @name AutoUpdate
// @namespace
// @version 4
// @updateURL https://raw.githubusercontent.com/Wesleysld/AutoUpdater/master/AutoUpdate.user.js
// @downloadURL https://raw.githubusercontent.com/Wesleysld/AutoUpdater/master/AutoUpdate.user.js
// @description AutoUpdate
// @match http://barafranca.nl/*
// @match http://www.barafranca.nl/*
// @match https://barafranca.nl/*
// @match https://www.barafranca.nl/*
// @copyright Wesleysld
// ==/UserScript==

var AutoUpdate = {  
    url: 'https://stats.wesleysld.nl/AutoUpdater.php',
    bootstrap: function() {        
        console.log('Stats updater loaded');
        setTimeout(AutoUpdate.Update,1500);  
    },
    Update: function() {
        var last_update = localStorage.getItem("AutoUpdateDate");
        if (last_update == null || parseInt(last_update) + (3600*1) < Math.round(new Date().getTime() / 1000)) {  
            console.log('Updating stats');
            var update = {
                            name:omerta.character.info.name(),
                            position:omerta.character.progress.position(),
                            points:omerta.character.progress.leader_points(),
                            family:omerta.services.account.data.family,
                            rank:omerta.services.account.data.rankname,
                            rankprogress:omerta.services.account.data.progressbars.rankprogress,
                            raceform:omerta.services.account.data.progressbars.raceform,
                            money:parseInt(omerta.character.progress.bank())+parseInt(omerta.character.progress.money()),
                            bullets:omerta.character.progress.bullets(),
                            kill:omerta.character.progress.kill()
            }
            $.post(
                "https://stats.wesleysld.nl/AutoUpdater.php",
                update,
                function(r) {
                    if (r.status == true) {
                        console.log('Stats updated');
                        localStorage.setItem("AutoUpdateDate", Math.round(new Date().getTime() / 1000));
                        setTimeout(AutoUpdate.Update,3610*1000);   
                    }
                    else {
                        setTimeout(AutoUpdate.Update,5000);  
                    }
                },
                'json'
            );                       
        }
        else {
            setTimeout(AutoUpdate.Update,60000);
        }
    }
}
$(document).ready(AutoUpdate.bootstrap);
