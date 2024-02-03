class Font {

    constructor() {

        this.fontWidth = new Map(); 
        this.fontWidth.set('!',0.5);
        this.fontWidth.set('\'',0.5);
        this.fontWidth.set('(',0.5);
        this.fontWidth.set(')',0.5);
        this.fontWidth.set(',',0.5);
        this.fontWidth.set('.',0.5);
        this.fontWidth.set(':',0.5);
        this.fontWidth.set(';',0.5);
        this.fontWidth.set('[',0.5);
        this.fontWidth.set(']',0.5);
        this.fontWidth.set('^',0.5);
        this.fontWidth.set('`',0.5);
        this.fontWidth.set('i',0.5);
        this.fontWidth.set('j',0.5);
        this.fontWidth.set('l',0.5);
        this.fontWidth.set('t',0.5);
        this.fontWidth.set('{',0.5);
        this.fontWidth.set('}',0.5);
        this.fontWidth.set('|',0.5);

        this.yOffset = new Map();
        this.yOffset.set('g',0.25);
        this.yOffset.set('j',0.25);
        this.yOffset.set('p',0.25);
        this.yOffset.set('q',0.25);
        this.yOffset.set('y',0.25);
        this.yOffset.set(',',0.25);

    }

};
