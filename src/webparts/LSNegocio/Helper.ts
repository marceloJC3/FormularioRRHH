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
    
}