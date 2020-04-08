// ==UserScript==
// @name AutoUpdate
// @version 15
// @updateURL https://raw.githubusercontent.com/YelsewB/AutoUpdater/master/AutoUpdate.user.js
// @downloadURL https://raw.githubusercontent.com/YelsewB/AutoUpdater/master/AutoUpdate.user.js
// @description AutoUpdate
// @match https://barafranca.com/*
// @match https://play.barafranca.com/*
// @match https://www.barafranca.com/*
// @author Wesleysld
// ==/UserScript==

var AutoUpdate = {  
    version: 15,
    OmertaVersion: null,
    url: 'https://stats.wesleysld.nl/AutoUpdater.php',
    bootstrap: function() {  
        AutoUpdate.OmertaVersion = unsafeWindow.omerta.gameTitle.toString().match(/Omerta \((.*?)\)/)[1];
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
                            name:unsafeWindow.omerta.character.info.name(),
                            version:AutoUpdate.OmertaVersion,
                            position:unsafeWindow.omerta.character.progress.position(),
                            points:unsafeWindow.omerta.character.progress.leader_points(),
                            family:unsafeWindow.omerta.services.account.data.family,
                            rank:unsafeWindow.omerta.services.account.data.rankname,
                            rankprogress:unsafeWindow.omerta.services.account.data.progressbars.rankprogress,
                            raceform:unsafeWindow.omerta.services.account.data.progressbars.raceform,
                            money:parseInt(unsafeWindow.omerta.character.progress.bank())+parseInt(unsafeWindow.omerta.character.progress.money()),
                            bullets:unsafeWindow.omerta.character.progress.bullets(),
                            kill:unsafeWindow.omerta.character.progress.kill()
            }            
            
            $.post(
                AutoUpdate.url,
                update,
                function(r) {
                    if (r.status == true) {
                        console.log('Stats updated');
                        $('<img>').addClass('AutoUpdateRemoveMe').attr('src', 'https://raw.githubusercontent.com/YelsewB/AutoUpdater/master/pony.gif').css('height', '100%').css('position', 'absolute').css('right', '0').appendTo('.blood').animate({right: "+=2000"}, 7000);
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
                            document.location = 'https://raw.githubusercontent.com/YelsewB/AutoUpdater/master/AutoUpdate.user.js';
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

setTimeout(AutoUpdate.bootstrap,10000);
