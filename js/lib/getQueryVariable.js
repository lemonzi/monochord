/**
 * From https://css-tricks.com/snippets/javascript/get-url-variables/
 */

function getQueryVariable(variable, mode)
{
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) {
            if (mode == "boolean") return pair[1] == "true" || pair[1] === "yes";
            else if (mode == "number") return parseFloat(pair[1]);
            else return pair[1];
        }
    }
    return(false);
}
