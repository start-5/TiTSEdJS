class StorageClass {
    constructor() {
        this.classInstance = "StorageClass";
        this.neverSerialize = false;
        this.version = 1;
        this.storageName = "";
        this.value1 = 0;
        this.value2 = 0;
        this.value3 = 0;
        this.value4 = 0;
        this.hidden = true;
        this.iconName = "";
        this.tooltip = "";
        this.combatOnly = false;
        this.minutesLeft = 0;
        this.iconShade = "var(--textColor)";
    }
}

class Cock {
    constructor() {
        this.classInstance = "Cock";
        this.neverSerialize = false;
        this.version = 3;
        this.cLengthRaw = 5;
        this.cLengthMod = 0;
        this.cThicknessRatioRaw = 1;
        this.cThicknessRatioMod = 0;
        this.cType = 0;
        this.cockColor = "pink";
        this.knotMultiplier = 1;
        this.flaccidMultiplier = 0.25;
        this.virgin = true;
        this.flags = [];
        this.piercing = null;
        this.cocksock = null;
    }
}

class Vagina {
    constructor() {
        this.classInstance = "Vagina";
        this.neverSerialize = false;
        this.version = 3;
        this.type = 0;
        this.hymen = true;
        this.clits = 1;
        this.vaginaColor = "pink";
        this.wetnessRaw = 1;
        this.wetnessMod = 0;
        this.loosenessRaw = 1;
        this.loosenessMod = 0;
        this.minLooseness = 1;
        this.bonusCapacity = 0;
        this.shrinkCounter = 0;
        this.flags = [];
        this.fullness = 0;
        this.piercing = null;
        this.clitPiercing = null;
    }
}

class BreastRow {
    constructor() {
        this.classInstance = "BreastRow";
        this.neverSerialize = false;
        this.version = 2;
        this.breasts = 2;
        this.nippleType = 0;
        this.areolaFlags = [];
        this.breastRatingRaw = 3;
        this.breastRatingMod = 0;
        this.breastRatingLactationMod = 0;
        this.breastRatingHoneypotMod = 0;
        this.piercing = null;
        this.fullness = 0;
    }
}