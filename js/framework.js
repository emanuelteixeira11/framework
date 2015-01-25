(function ($) {
    var settings;
    $.fn.initFramework = function (jsonpath) {
        var msg = new SpeechSynthesisUtterance(''); //inicialização do sistema de fala
        msg.lang = $("html").attr("lang") + "-" + $("html").attr("lang").toUpperCase();
        msg.pitch = .5;
        if (jsonpath == null)
            jsonpath = "../js/framework.json"
        $.ajax({
            type: "GET",
            url: jsonpath,
            dataType: "json",
            async: true,
            success: function (json) {
                var jsonIndex = 0;
                $.each(json.settings, function (i) {
                    if (json.settings[i].lang == $("html").attr("lang")) {
                        jsonIndex = i;
                    }
                });
                settings = json.settings[jsonIndex];
                var skipContent = $("[acs-type='skip-content']");
                if (skipContent.length > 1)
                    console.error(settings.skipContentError);
                acsTypeAttr("skip").each(function (i) {
                    if (skipContent.attr("id") == null)
                        skipContent.attr("id", "skip-content-id");
                    $(this).append("<a href='#' tabindex='1' id='skip-anchor-" + i + "'  title='" + settings.skipTitle + "'>" + settings.skipLabel + "</a>");
                    $("#skip-anchor-" + i).click(function () {
                        $('html, body').animate({
                            scrollTop: $("#" + skipContent.attr("id")).offset().top
                        }, 1000);
                    });
                });
                acsTypeAttr("font-set").each(function (i) {
                    $(this).append("<a href='#' id='font-set-more-anchor-" + i + "'  title='" + settings.fontSetTitleMore + "'>" + settings.fontSetLabelMore + "</a>");
                    $("#font-set-more-anchor-" + i).click(function () {
                        acsTypeAttr("font-set-content").each(function () {
                            var px = (eval($(this).css("font-size").split("px")[0]) + 2) + "px";
                            $(this).css("font-size", px);
                        });
                    });
                    $(this).append("<a href='#' id='font-set-replace-anchor-" + i + "'  title='" + settings.fontSetTitleReplace + "'>" + settings.fontSetLabelReplace + "</a>");
                    $("#font-set-replace-anchor-" + i).click(function () {
                        acsTypeAttr("font-set-content").each(function () {
                            $(this).css("font-size", "1em");
                        });
                    });
                    $(this).append("<a href='#' id='font-set-minus-anchor-" + i + "'  title='" + settings.fontSetTitleMinus + "'>" + settings.fontSetLabelMinus + "</a>");
                    $("#font-set-minus-anchor-" + i).click(function () {
                        acsTypeAttr("font-set-content").each(function () {
                            var px = (eval($(this).css("font-size").split("px")[0]) - 2) + "px";
                            $(this).css("font-size", px);
                        });
                    });
                    acsTypeAttr("speak").each(function () {
                        msg.text = "";
                        $(this).find("*").each(function () {
                            switch ($(this).prop("tagName")) {
                            case "H1":
                                msg.text += settings.speak[0].H1;
                                break;
                            case "P":
                                msg.text += settings.speak[0].P;
                                break;
                            default:
                                msg.text += settings.speak[0].Text;
                                break;
                            }
                            msg.text += " " + $(this).text() + "; ";
                        });
                        //window.speechSynthesis.speak(msg);
                    });
                });
                $("footer").append("<button id='recong'>Reconhecimento</button>");
                var flag = false;
                var newRecognition = new webkitSpeechRecognition();
                newRecognition.continuous = true;
                newRecognition.lang = $("html").attr("lang") + "-" + $("html").attr("lang").toUpperCase();
                newRecognition.onresult = function(event){
                    alert();
                }
                $("#recong").click(function () {
                    if (flag) {
                        newRecognition.stop();
                        flag = false;

                    } else {
                        newRecognition.start();
                        flag = true;
                    }
                });
            },
            error: function (xhr, textStatus, errorThrown) {
                alert('Json file unexpected');
            }
        });
    };
}(jQuery));

function acsTypeAttr(attr) {
    var array = [];
    $("[acs-type]").each(function () {
        var obj = $(this).attr("acs-type").split(" ");
        for (x in obj) {
            if (obj[x] == attr) {
                array.push($(this));
                break;
            }
        }
    });
    return $($.map(array, function (el) {
        return el.get();
    }));;
}