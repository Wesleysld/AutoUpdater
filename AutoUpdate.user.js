// ==UserScript==
// @name AutoUpdate
// @namespace
// @version 2.0
// @downloadURL https://raw.githubusercontent.com/Wesleysld/AutoUpdater/master/AutoUpdate.meta.js
// @description AutoUpdate
// @match http://barafranca.nl/*
// @match http://www.barafranca.nl/*
// @match https://barafranca.nl/*
// @match https://www.barafranca.nl/*
// @copyright Wesleysld
// ==/UserScript==

var AutoUpdate = {  
    url: 'https://stats.wesleysld.nl/AutoUpdater.php',
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
                    if (r.Status == "true") {                        
                        localStorage.setItem("AutoUpdateDate", Math.round(new Date().getTime() / 1000));
                        setTimeout(function(){AutoUpdate.Update},3610*1000);   
                    }
                    else {
                        setTimeout(function(){AutoUpdate.Update},5000);  
                    }
                }
            );                       
        }
    }
}
setTimeout(function(){AutoUpdate.Update},10000);



