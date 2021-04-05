class Color {
    /**@type {number}*/r = 0;
    /**@type {number}*/g = 0;
    /**@type {number}*/b = 0;

    constructor(...inp) {
        if (inp.length == 1 && typeof(inp[0]) == "number") {
            this.b = (inp[0]) & 0xff;
            this.g = (inp[0] >> 8) & 0xff;
            this.r = (inp[0] >> 16) & 0xff;
        } else if (inp.length == 3 && typeof(inp[0]) == "number" && typeof(inp[1]) == "number" && typeof(inp[2]) == "number") {
            this.r = inp[0];
            this.g = inp[1];
            this.b = inp[2];
        }
    }

    static mix(a,b,fac) {
        if (!a || !b) return null;
        var lerp = (na,nb) => na*(1-fac)+nb*fac;
        return new Color(lerp(a.r,b.r),lerp(a.g,b.g),lerp(a.b,b.b))
    }

    static hsv(h,s,v) {
        var r, g, b, i, f, p, q, t;
        if (arguments.length === 1) {
            s = h.s, v = h.v, h = h.h;
        }
        i = Math.floor(h * 6);
        f = h * 6 - i;
        p = v * (1 - s);
        q = v * (1 - f * s);
        t = v * (1 - (1 - f) * s);
        switch (i % 6) {
            case 0: r = v, g = t, b = p; break;
            case 1: r = q, g = v, b = p; break;
            case 2: r = p, g = v, b = t; break;
            case 3: r = p, g = q, b = v; break;
            case 4: r = t, g = p, b = v; break;
            case 5: r = v, g = p, b = q; break;
        }
        return new Color(Math.floor(r*256),Math.floor(g*256),Math.floor(b*256))
    }

    get hex() {
        var clampFloor = v=>Math.max(0,Math.min(255,Math.floor(v)));
        var s = (((clampFloor(this.r)&0xff)<<16)|((clampFloor(this.g)&0xff)<<8)|(clampFloor(this.b)&0xff)).toString(16);
        while (s.length < 6) s = "0"+s;
        return "#"+s;
    }
}

export default Color;