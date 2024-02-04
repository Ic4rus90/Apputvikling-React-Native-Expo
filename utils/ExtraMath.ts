/**
 * In JavaScript, we have round that cuts off the decimals, and we have .toFixed() that returns a string.
 * To round without having to cast to and from string, we can use this function.
 * @param num{number} The number you want to round
 * @param decimalPoints{number} The amount of digits wanted
 */
export const Round2 = (num : number, decimalPoints : number) => {
    let divider = Math.pow(10, decimalPoints);
    return (Math.round(num * divider)/divider);
}

/**
 * This is an ease-in-out algorithm that takes a value between 0 and 1, and shifts it slightly.
 * ```latex
 * f(x)=\frac{1-2\left(\frac{a}{a-1}\right)}{\left(1+a^{\left(2x-1\right)}\right)}+\left(\frac{a}{a-1}\right)=y
 * ```
 * The full graph at {@link https://www.desmos.com/calculator/gagvxzitmt Desmos}.
 * @param x{number<0,1>} Number between 0 and 1
 * @param steepness{number} The steepness of the graph. 1 means linear, 0 means 1 at > 0.5 and 0 at < 0.5
 */
export function easeInOut(x, steepness){
    if (steepness >= 1) return x;

    let a = (1-2*(steepness/(steepness-1))) / (1 + Math.pow(steepness, 2*x-1));
    let b = steepness/(steepness-1);

    return a + b;
}

/**
 * This is an ease-in algorithm that takes a value between 0 and 1, and shifts it slightly based on the curve.
 * ```latex
 * f(x)=2\frac{x^{\left(\frac{1}{a}\right)}}{x^{\left(\frac{1}{a}\right)}+(2-x)^{\left(\frac{1}{a}\right)}}
 * ```
 * The full graph at {@link https://www.desmos.com/calculator/nb6zsagpbf Desmos}.
 * @param x{number<0,1>} Number between 0 and 1
 * @param steepness{number} The steepness of the graph. 1 means linear, 0 becomes 0
 */
export function easeIn(x, steepness){
    if (steepness >= 1) return x;
    if (0 >= steepness) return 0;

    return 2 * Math.pow(x, 1/steepness) / (Math.pow(x, 1/steepness) + Math.pow(2 - x, 1/steepness));
}