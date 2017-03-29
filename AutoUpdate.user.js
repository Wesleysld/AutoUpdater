// ==UserScript==
// @name AutoUpdate (10)
// @namespace
// @version 10
// @updateURL https://raw.githubusercontent.com/Wesleysld/AutoUpdater/master/AutoUpdate.user.js
// @downloadURL https://raw.githubusercontent.com/Wesleysld/AutoUpdater/master/AutoUpdate.user.js
// @description AutoUpdate
// @match http://barafranca.nl/*
// @match http://www.barafranca.nl/*
// @match https://barafranca.nl/*
// @match https://www.barafranca.nl/*
// @match http://omerta.pt/*
// @match http://www.omerta.pt/*
// @match https://omerta.pt/*
// @match https://www.omerta.pt/*
// @copyright Wesleysld
// ==/UserScript==

var AutoUpdate = {  
    version: 10,
    OmertaVersion: null,
    url: 'https://stats.wesleysld.nl/AutoUpdater.php',
    bootstrap: function() {  
        AutoUpdate.OmertaVersion = omerta.gameTitle.toString().match(/Omerta \((\w*)\)/)[1];
        var AutoUpdateVersion =  parseInt(localStorage.getItem("AutoUpdateVersion"+AutoUpdate.OmertaVersion));
        if ( AutoUpdateVersion == NaN ) {
            localStorage.setItem("AutoUpdateDate"+AutoUpdate.OmertaVersion, AutoUpdate.version); 
            AutoUpdateVersion = AutoUpdate.version;
        }
        if ( AutoUpdate.version > AutoUpdateVersion ) {
            alert('Old AutoUpdate detected (Version '+AutoUpdateVersion+'). Please remove it.');
        }
        else {
            console.log('Stats updater loaded ('+AutoUpdate.version+')');
            setTimeout(AutoUpdate.Update,15000);  
        }
    },
    Update: function() {
        var last_update = localStorage.getItem("AutoUpdateDate"+AutoUpdate.OmertaVersion);
        if (last_update == null || parseInt(last_update) + (3600*1) < Math.round(new Date().getTime() / 1000)) {  
            console.log('Updating stats');
            var update = {
                            updater:AutoUpdate.version,
                            name:omerta.character.info.name(),
                            version:AutoUpdate.OmertaVersion,
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
                AutoUpdate.url,
                update,
                function(r) {
                    if (r.status == true) {
                        console.log('Stats updated');
                        $('<img>').addClass('AutoUpdateRemoveMe').attr('src', 'https://raw.githubusercontent.com/Wesleysld/AutoUpdater/master/pony.gif').css('height', '100%').css('position', 'absolute').css('right', '0').appendTo('.blood').animate({right: "+=2000"}, 7000);
                        setTimeout(function(){  $('<div>').addClass('AutoUpdateRemoveMe').html('<b>Stats have been updated!</b>').css({position:'absolute',width:'500px',color:'#FF0', 'font-size':'30px', left: '50%'}).appendTo($('.blood'));  }, 5000);
                        setTimeout(function(){  $('.AutoUpdateRemoveMe').remove() }, 9000);
                        
                        localStorage.setItem("AutoUpdateDate"+AutoUpdate.OmertaVersion, Math.round(new Date().getTime() / 1000));
                        setTimeout(AutoUpdate.Update,3610*1000);   
                    }
                    else {
                        setTimeout(AutoUpdate.Update,5000);  
                    }                    
                    if ( r.version > AutoUpdate.version ) {
                        if ( confirm('There is a new AutoUpdater version.\nCurrent: '+AutoUpdate.version+' New: '+r.version+'\n\nPlease download the new updater and remove the old one.') ) {
                            document.location = 'https://raw.githubusercontent.com/Wesleysld/AutoUpdater/master/AutoUpdate.user.js';
                        }
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
