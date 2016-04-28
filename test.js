

var str = "#include <stdio.h>" +
    "c=1"
    +"return 0";
var patt = new RegExp(/(\w+)\s*=((\s*\w+\s*[-+\/%])\s*\w+\s*)/);
var res = patt.test(str);

console.log(res);

var patt1 = new RegExp(/(\w+\s*)=(\s*[1-9]\d{2,}|[0-9]\d)/);

var res1 = patt1.test(str);

console.log(res1);