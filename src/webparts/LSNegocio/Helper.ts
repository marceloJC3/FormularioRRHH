export class H_QueryString {

    public static getParameter(name: string, url: string): string {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, '\\$&');
        var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
       
    }


}

export class H_Function{

public static convertDate(str) {
    if (str == "" || str == null) {
        return "";

    } else {
        var date = str.split("/");
        date = date[2] + "-" + date[1] + "-" + date[0] + " 12:00:00";

        return date;
    }
}

public static  convertDateInverse(t) {
    if (t == "" || t == null) {
        return "";

    } else {


        var newMonth = t.substr(5, 2);
        var newDate = t.substr(8, 2);
        var newYear = t.substr(0, 4);

        return newDate + "/" + newMonth + "/" + newYear;
    }


}
    
}