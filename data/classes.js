/* eslint-disable no-unused-vars */

class StorageClass {
    constructor() {
        this.classInstance = 'StorageClass';
        this.combatOnly = false;
        this.hidden = true;
        this.iconName = '';
        this.iconShade = 'var(--textColor)';
        this.minutesLeft = 0;
        this.neverSerialize = false;
        this.storageName = '';
        this.tooltip = '';
        this.value1 = 0;
        this.value2 = 0;
        this.value3 = 0;
        this.value4 = 0;
        this.version = 1;
    }
}

class Cock {
    constructor() {
        this.classInstance = 'Cock';
        this.cLengthMod = 0;
        this.cLengthRaw = 5.5;
        this.cThicknessRatioMod = 0;
        this.cThicknessRatioRaw = 1;
        this.cType = 0;
        this.cockColor = 'pink';
        this.cocksock = null;
        this.flaccidMultiplier = 0.25;
        this.flags = [];
        this.knotMultiplier = 1;
        this.neverSerialize = false;
        this.piercing = null;
        this.version = 3;
        this.virgin = true;
    }
}

class Vagina {
    constructor() {
        this.bonusCapacity = 0;
        this.classInstance = 'Vagina';
        this.clitPiercing = null;
        this.clits = 1;
        this.flags = [];
        this.fullness = 0;
        this.hymen = true;
        this.loosenessMod = 0;
        this.loosenessRaw = 1;
        this.minLooseness = 1;
        this.neverSerialize = false;
        this.piercing = null;
        this.shrinkCounter = 0;
        this.type = 0;
        this.vaginaColor = 'pink';
        this.version = 3;
        this.wetnessMod = 0;
        this.wetnessRaw = 1;
    }
}

class BreastRow {
    constructor() {
        this.areolaFlags = [];
        this.breastRatingHoneypotMod = 0;
        this.breastRatingLactationMod = 0;
        this.breastRatingMod = 0;
        this.breastRatingRaw = 3;
        this.breasts = 2;
        this.classInstance = 'BreastRow';
        this.fullness = 0;
        this.neverSerialize = false;
        this.nippleType = 0;
        this.piercing = null;
        this.version = 2;
    }
}