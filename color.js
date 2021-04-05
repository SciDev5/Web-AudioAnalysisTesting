class Color {
    /**@type {number}*/r = 0;
    /**@type {number}*/g = 0;
    /**@type {number}*/b = 0;

    constructor(...inp) {
        if (inp.length == 1 && typeof(inp[0]) == "number") {
            this.b = (inp[0]) & 0xff;
            this.g = (inp[0] >> 16) & 0xff;
            this.r = (inp[0] >> 24) & 0xff;
        } else if (inp.length == 3 && typeof(inp[0]) == "number" && typeof(inp[1]) == "number" && typeof(inp[2]) == "number") {
            this.r = inp[0];
            this.g = inp[1];
            this.b = inp[2];
        }
    }

    static mix(a,b,fac) {
        var lerp = (na,nb) => na*(1-fac)+nb*fac;
        return new Color(lerp(a.r,b.r),lerp(a.g,b.g),lerp(a.g,b.g))
    }

    get hex() {
        var s = (((Math.floor(this.r)&0xff)<<16)|((Math.floor(this.g)&0xff)<<8)|((Math.floor(this.b))&0xff)).toString(16);
        while (s.length < 6) s = "0"+s;
        return "#"+s;
    }
}

export default Color;