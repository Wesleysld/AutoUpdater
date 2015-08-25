// ==UserScript==
// @name Statsupdater
// @namespace
// @version 1.7
// @updateURL https://raw.githubusercontent.com/Wesleysld/AutoUpdater/master/AutoUpdate.meta.js
// @description Statsupdater
// @match http://barafranca.nl/*
// @match http://barafranca.com/*
// @match http://www.barafranca.com/*
// @match http://www.barafranca.nl/*
// @match https://barafranca.nl/*
// @match https://barafranca.com/*
// @match https://www.barafranca.com/*
// @match https://www.barafranca.nl/*
// @copyright 2015 MurderInc, </3 Wesleysld
// ==/UserScript==

var ws = {
    url: 'http://stats.wesleysld.nl',
    debug: false,
    bootstrap: function() {
        $(window).on('hashchange', ws.urlChanged);
        ws.urlChanged();
        ws.appendMenu();
    },
    ajax: function( data, callback ) {
        data = $.extend({}, {token: localStorage.getItem("ws_token"), ws_version: 1.7, version: ws.getVersion()}, data);
        $.ajax({
            url: ws.url + "/AutoUpdater.php",
            type: "POST",
            data: data,
            dataType: 'json',
            success: function(res) {
                if ( !res.tokenstatus ) {
                    localStorage.removeItem("ws_token");
                    $("#ws_settings").remove();
                    //ws.createSettingsDom();
                    //$("#ws_settings").slideDown();
                }
                callback(res);
            },
            error: function () {
                alert('Something went wrong with an AutoUpdater request.\r\nIf this keeps occuring. Please disable the userScript');
            }
        })           
    },
    appendMenu: function() {
      if ($("div.menu ul").length > 0) {
        $("div.menu ul").append(
          $("<li>").attr('id', 'ws_settings_menu').addClass("right").append(
            $("<a>").attr("href", "javascript:return false;").text("AutoUpdate").click(function() {
              if ($("#ws_settings").length === 0) {
                ws.createSettingsDom();
              }
              $("#ws_settings").slideToggle();
            })
          )
        );
      } else {
        window.setTimeout(ws.appendMenu, 500);
      }
    },
    createSettingsDom: function() {
      $("body").append(
        $("<div>").attr("id", "ws_settings").css({
          "display": "none",
          "position": "fixed",
          "top": $("div.menu").height() + "px",
          "right": parseInt($("body").width() - ($("#ws_settings_menu").position().left + $("#ws_settings_menu").width() + 2)) + "px",
          "width": "260px",
          //"height": "170px",
          "z-index": "10000",
          "background-color": "black",
          "border-bottom": "1px solid #111",
          "border-left": "1px solid #111",
          "border-right": "1px solid #111",
          "border-bottom-left-radius": "15px",
          "border-bottom-right-radius": "15px",
          "color": "#F3F3F3",
          "padding": "10px"
        }).append(
          $("<h3>").text("AutoUpdate Settings"),
          ws.isLoggedIn() ? ws.getUserDom() : ws.getAnonymousDom(),
          ws.getTokenDom()
        )
      );
    },
    getVersion: function() {
        hostname = window.location.hostname;
        switch (hostname) {
            case 'www.omerta3.com':
            case 'omerta3.com':
            case 'www.barafranca.com':
            case 'barafranca.com':
            case 'www.barafranca.us':
            case 'barafranca.us':
                return 'com';
            case 'omerta.dm':
            case 'www.omerta.dm':
                return 'dm';
            case 'www.barafranca.nl':
            case 'barafranca.nl':
                return 'nl';
            case 'www.barafranca.gen.tr':
            case 'barafranca.gen.tr':
                return 'tr';
            case 'omerta.pt':
            case 'www.omerta.pt':
                return 'pt';
            default:
                return undefined;
        }    
    },    
    isLoggedIn: function() {
      return localStorage.getItem("ws_token") !== null && localStorage.getItem("ws_token").length > 0;
    },
    getUserDom: function() {    
        var ingame = $(".icon_account:first").text();         
        return $("<div>").append(
                    $("<p>").css("margin-bottom", "15px").text("You are logged in as " + localStorage.getItem("ws_email")),
                    $("<p>").css("margin-bottom", "30px").append(
                        $("<a>").attr("href", "javascript:return false;").text(
                            "Check your statistics here."
                        ).click(function() {
                            ws.getStatsDom();
                         })
                    )
                    .append("<br />")
                    .append(
                        $("<a>").attr("href", ws.url + "/playersignup/?token="+localStorage.getItem("ws_token")).attr("target","_blank").text(
                            "Check your account."
                        )
                    ),
                    $("<p>").text("Update your token:")
                ); 
    },
    getStatsDom: function() {
        $.post(ws.url+ "/stats/" + localStorage.getItem("ws_token") +".html", function( data ) {
            $("#game_container").html( data );
            $("#ws_settings").slideUp();
        });
    },
    getAnonymousDom: function() {
      // @TODO: get family
      var ingame = $(".icon_account:first").text();
      data = {
        family: "Siberia"
      };
      return $("<div>").append(
        // data.family === null ? null : $("<p>").css("margin-bottom", "15px").text("Your statistics are shared with " + data.family),
        $("<p>").append(
          $("<a>").attr("href", ws.url + "/playersignup/").attr("target","_blank").html(
            "<span style=\"color:#ff0000\">Sign up here</span> to track your own statistics and enter your personalized token below."
          )
        )
      );
    },
    getTokenDom: function() {
      return $("<form>").append(
        $("<input>").attr("id", "ws_token").attr("type", "text").attr("placeholder", "Your token").val(
          ws.isLoggedIn() ? localStorage.getItem("ws_token") : ''
        ),
        $("<input>").attr("type", "submit").val("Save")
      ).submit(function() {
        ws.ajax({action:'validateToken',token:$("#ws_token").val()}, ws.setToken);
        return false;
      });
    },
    setToken: function ( data ) {
        if (data.status == true ) {
            localStorage.setItem("ws_token", $("#ws_token").val());
            localStorage.setItem("ws_email", data.email);
            localStorage.removeItem("ws_last_update")
            $("#ws_settings").remove();
            ws.createSettingsDom();
            $("#ws_settings").slideDown();
        } else {
            alert("Login failed, please check your token.");
            ws.createSettingsDom();
            $("#ws_settings").slideDown();
        }
    },
    urlChanged: function() {
        if (window.location.hash.indexOf("information.php") !== -1) {
            var last_update = localStorage.getItem("ws_last_update");
            if (last_update === null || parseInt(last_update) + (3600 * 6) < Math.round(new Date().getTime() / 1000) || ws.debug) {
                ws.updateStats();
            }
        }
        if (window.location.hash.indexOf("module=Bodyguards") !== -1) {
            ws.updateBodyguardStats();
        }
    },
    updateStats: function(res) {
        //make sure we're on stats page and loading is done
        if ($("#game_container").html().indexOf("Online in last 48Hrs") !== -1 || $("#game_container").html().indexOf("Online in de afgelopen 48 uur") !== -1) {
            //parse dem stats!
            ws.ajax({action:'UpdateStats', paste:$("body").text()}, ws.showupdateStats);
        } else {
            //let's wait a bit ...
            window.setTimeout(ws.updateStats, 500);
        }
    },
    showupdateStats: function( res ) {
       if (res.status == true) {
            localStorage.setItem("ws_last_update", Math.round(new Date().getTime() / 1000)); 
            $("#game_container").prepend('<div id="fs_updated" style="display: block; font: 12px Arial; background-color: rgb(255, 244, 168); color: green; padding:5px; margin: 15px;" align="center">Stats updated</div>');
            window.setTimeout(function() {
                $("#fs_updated").remove();
            }, 5000);
        }
        else if (res.status == false) { 
            // $("#game_container").prepend('<div id="fs_updated" style="display: block; font: 12px Arial; background-color: rgb(255, 244, 168); color: red; padding:5px; margin: 15px;" align="center">Stats <b>NOT</b> updated</div>');
            // window.setTimeout(function() {
                // $("#fs_updated").remove();
            // }, 5000);
        } 
    },
    updateBodyguardStats: function(res) {
        //make sure we're on bg page and loading is done
        if ($("#game_container").html().indexOf("Lee") !== -1) {
            //parse dem bgs!
            ws.ajax({action:'UpdateBG', paste:$(".otable:first").text()}, ws.showupdateBG);
        } else {
            //let's wait a bit ...
            window.setTimeout(ws.updateBodyguardStats, 500);
        }
    },
    showupdateBG: function(res) {
        if (res.status == true) { 
            $("#game_container").prepend('<div id="fs_updated" style="display: block; font: 12px Arial; background-color: rgb(255, 244, 168); color: green; padding:5px; margin: 15px;" align="center">Bodyguards updated</div>');         
            window.setTimeout(function() {
                $("#fs_updated").remove();
            }, 2000);
        }
        else if (res.status == false) {
            // $(".menu ul").append('<li id="fs_updated" class="right" style="color: red; padding-top: 10px; border: none;">Bodyguards NOT updated!</li>');
            // window.setTimeout(function() {
                // $("#fs_updated").remove();
            // }, 2000);
        }        
    }
};

$(document).ready(ws.bootstrap);
