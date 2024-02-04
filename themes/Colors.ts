import {StatusBarStyle} from "expo-status-bar";

/**
 * General class to get the desired colors
 */
export class Colors {

    private static _theme : StatusBarStyle = "dark";

    private static _white_theme = {
        bg: "#f2f2f2",
        fg: "#0C2F27",
        primary: "#0E5D58",
        secondary: "#87B1AE",
        accent: "#FE621F",
        accent2: "#ff9669",
        whiteGrey: "#e8e0dd",
        lightGrey: "#d5cdca",
        grey: "#5A5A5A",
        red: "#ff361c"
    }


    public static get theme(){
        return this._theme;
    }

    public static get bg(){
        return this._white_theme.bg;
    }
    public static get fg(){
        return this._white_theme.fg;
    }
    public static get primary(){
        return this._white_theme.primary;
    }
    public static get secondary(){
        return this._white_theme.secondary;
    }
    public static get accent(){
        return this._white_theme.accent;
    }
    public static get accent2(){
        return this._white_theme.accent2;
    }
    public static get whiteGrey(){
        return this._white_theme.whiteGrey;
    }
    public static get lightGrey(){
        return this._white_theme.lightGrey;
    }
    public static get grey(){
        return this._white_theme.grey;
    }
    public static get red(){
        return this._white_theme.red;
    }
}


function formatColor(colorString = null){
    let red = 0;
    let green = 0;
    let blue = 0;
    let alpha = 255;

    if (colorString === null || colorString === undefined)
        return { red: red, green: green, blue: blue, alpha: alpha };

    if (typeof colorString === 'object'){
        if (colorString["red"] === undefined || colorString["green"] === undefined || colorString["blue"] === undefined)
            return { red: red, green: green, blue: blue, alpha: alpha };
        if (colorString["alpha"] === undefined)
            colorString["alpha"] = 255;
        return colorString;
    }

    colorString = colorString.replace('#','').trim().toLowerCase();

    // Validate if hex
    if (colorString.length === 3 && colorString.match('^[0-9a-fA-F]+$') !== null){ // 34f
        let rgb = colorString;
        red = parseInt(rgb[0] + "" + rgb[0], 16);
        green = parseInt(rgb[1] + "" + rgb[1], 16);
        blue = parseInt(rgb[2] + "" + rgb[2], 16);
    } else if (colorString.length === 6 && colorString.match('^[0-9a-fA-F]+$') !== null){ // 34ffcc
        let rgb = colorString.match(/.{1,2}/g);
        red = parseInt(rgb[0], 16);
        green = parseInt(rgb[1], 16);
        blue = parseInt(rgb[2], 16);
    }else if (colorString.length === 8 && colorString.match('^[0-9a-fA-F]+$') !== null){ // 34ffccff
        let rgba = colorString.match(/.{1,2}/g);
        red = parseInt(rgba[0], 16);
        green = parseInt(rgba[1], 16);
        blue = parseInt(rgba[2], 16);
        alpha = parseInt(rgba[3], 16);
    }else if ((colorString.match(/[^0-9]+/g) || []).length >= 2 && (colorString.match(/[0-9]+/g) || []).length === 3){ // 123 231 214
        let rgb = (colorString.match(/[0-9]+/g) || []);
        red = parseInt(rgb[0]);
        green = parseInt(rgb[1]);
        blue = parseInt(rgb[2]);
    }else if ((colorString.match(/[^0-9.]+/g) || []).length >= 3 && (colorString.match(/[0-9.]+/g) || []).length >= 4){ // 123 231 214 255
        let rgba = (colorString.match(/[0-9.%]+/g) || []);
        red = parseInt(rgba[0]);
        green = parseInt(rgba[1]);
        blue = parseInt(rgba[2]);

        // Handling of alpha
        let alphaString = rgba[3];
        if (alphaString.includes("%")){ // If percentage
            alpha = (255 * (alphaString.replace('%','')) / 100)
        }else if (1 >= parseFloat(alphaString)){ // If less than 1
            alpha = 255 * parseFloat(alphaString);
        }else { // Assuming value between 0 and 255
            alpha = parseInt(alphaString);
        }
    }

    red =   Math.max(Math.min(red,  255), 0); // Min 0, Max 255
    green = Math.max(Math.min(green,255), 0); // Min 0, Max 255
    blue =  Math.max(Math.min(blue, 255), 0); // Min 0, Max 255
    alpha = Math.max(Math.min(alpha,255), 0); // Min 0, Max 255

    return { red: red, green: green, blue: blue, alpha: alpha };
}

export const colorBetween = (startColor, endColor, percentage) => {
    // Format colors to array
    startColor = formatColor(startColor);
    endColor = formatColor(endColor);

    // Return instantly if max start / end
    if (percentage >= 1)
        return colorToHEX(endColor);
    if (percentage <= 0)
        return colorToHEX(startColor);

    let rgb = formatColor(); // No arguments = black

    // Calculations for each color
    rgb["red"] =   startColor["red"]   - Math.round((startColor["red"]   - endColor["red"])   * percentage);
    rgb["green"] = startColor["green"] - Math.round((startColor["green"] - endColor["green"]) * percentage);
    rgb["blue"] =  startColor["blue"]  - Math.round((startColor["blue"]  - endColor["blue"])  * percentage);

    return colorToHEX(rgb);
}

function colorToHEX(colorString){
    let color = formatColor(colorString);
    let red = (color.red >= 16) ? color.red.toString(16) : "0" + color.red.toString(16);
    let green = (color.green >= 16) ? color.green.toString(16) : "0" + color.green.toString(16);
    let blue = (color.blue >= 16) ? color.blue.toString(16) : "0" + color.blue.toString(16);
    return `#${red}${green}${blue}`;
}