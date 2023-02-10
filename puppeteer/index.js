const puppeteer = require('puppeteer');
const prettier = require('prettier');
const fs = require('fs');


/* eslint-disable no-useless-escape */


// Observations:

// Perks are part of the StorageClass class, from what I saw, they are not globally defined, they are instantiated and added to characters on demand.
// You could create a "custom" perk with whatever value and the game would count it as valid, but to actually have an effect it
// would need to be checked at some point with this.hasPerk, otherwise it just sits there.
// (afaik) This is the same with everything that inherits from StorageClass


(async () => {

    const operationStart = Date.now();


    const util = {

        /**
        * Format a 'StorageClass' flag array
        * @param {Array<StorageClass>} arr
        */
        formatStorageClassArray: function (arr) {
            return arr.filter((v, i, a) => a.findIndex(v2 => (v2.storageName === v.storageName)) === i).sort();
        },

        /**
        * Format game data when saving to file
        * @param {string} name
        * @param {any} data
        */
        formatToFile: function (name, data) {
            const src = `const ${name} = ${JSON.stringify(data)}`;

            return prettier.format(src, {
                parser: 'babel',
                tabWidth: 4
            });
        },

        /**
        * Format a valid flag array
        * @param {Array} arr
        */
        formatValidFlagArray: function (arr) {
            return arr.filter((v, i, a) => a.findIndex(v2 => (v2.value === v.value)) === i).sort();
        },

        /**
        * Get a pretty print time elapsed result based on start and end time
        * @param {number} start
        * @param {number} end
        */
        getElapsedTime: function (start, end) {

            const duration = end - start;

            const milli = Math.floor((duration % 1000) / 1);
            var sec = Math.floor((duration / 1000) % 60);
            const min = Math.floor((duration / (1000 * 60)) % 60);

            sec = (sec < 10 && min > 0) ? '0' + sec : sec;

            var result = (min > 0 ? min + ':' : '') + (sec > 0 ? sec + '.' : '') + milli;

            if (sec > 0 && min < 1) {
                return result += 's';
            }
            else if (sec < 1 && min < 1) {
                return result += 'ms';
            }
            else {
                return result;
            }
        },

        /**
        * Print operation timing info to the console
        * @param {string} msg
        * @param {number} start
        * @param {number} end
        * @param {string} prefix
        */
        printOperationTime: function (msg, start, end, prefix = null) {
            console.log((prefix ?? 'got ') + msg + ', operation took ' + util.getElapsedTime(start, end) + ' to complete');

        }

    };


    const browser = await puppeteer.launch();
    const page = await browser.newPage();


    var urls = [];
    var contents = [];

    page.on('response', async (response) => {

        const url = response.url();

        if (url.endsWith('.js')) {
            urls.push(url);
            contents.push(await response.text());
        }

    });


    try {
        console.log('loading game');
        const gameLoadStart = Date.now();

        await page.goto('https://www.fenoxo.com/play/TiTS/release/', { timeout: 0 });

        const gameLoadEnd = Date.now();
        util.printOperationTime('game instance', gameLoadStart, gameLoadEnd, 'loaded ');
    }
    catch (e) {
        console.log(e);
        await browser.close();
        return;
    }


    console.log();
    console.log('urls', urls);
    console.log();


    var evalResult;


    try {
        console.log('evaluating game instance');
        const evalGameStart = Date.now();

        evalResult = await page.evaluate(() => {
            try {


                // Note:
                // By this point we have started evaluating the page, which means that we are scoped to the browser page and not the file


                // #region Funcs

                /* eslint-disable no-inner-declarations */

                /**
                * Get an object/value with the specified key inside another object, recursively
                * @param {string} key
                */
                function getObjectRecursive(obj, key) {

                    var result = null;

                    if (obj instanceof Array) {
                        for (var i = 0; i < obj.length; i++) {
                            result = getObjectRecursive(obj[i]);
                        }
                    }
                    else {
                        for (var prop in obj) {
                            if (prop == key) {
                                return obj[key];
                            }
                            if (obj[prop] instanceof Object || obj[prop] instanceof Array)
                                result = getObjectRecursive(obj[prop]);
                        }
                    }

                    return result;
                }

                /**
                * Get valid xyz for a body part
                * @param {string} bodyPartName
                * @param {string} type
                * @param {Array} bodyPartArray
                */
                function getValidFor(bodyPartName, type, bodyPartArray) {
                    const validArray = [];

                    const key = 'VALID_' + bodyPartName + type;

                    const gameArray = getObjectRecursive(window.GLOBAL, key);

                    for (var i = 0; i < gameArray.length; i++) {
                        validArray.push(bodyPartArray.find(f => f.value == gameArray[i]));
                    }

                    return validArray;
                }

                /**
                * Get valid flags for a body part
                * @param {string} bodyPartName
                * @param {Array} bodyFlagsArray
                */
                function getValidFlagsFor(bodyPartName, bodyFlagsArray) {
                    return getValidFor(bodyPartName, '_FLAGS', bodyFlagsArray);
                }

                /**
                * Get valid types for a body part
                * @param {string} bodyPartName
                * @param {Array} bodyPartsArray
                */
                function getValidTypesFor(bodyPartName, bodyPartsArray) {
                    return getValidFor(bodyPartName, '_TYPES', bodyPartsArray);
                }

                /**
                * Get data in the game's GLOBAL var by their prefix
                * @param {string} prefix
                */
                function getGlobalsByPrefix(prefix) {
                    return Object.keys(window.GLOBAL)
                        .filter(key => key.startsWith(prefix))
                        .sort(key => window.GLOBAL[key])
                        .map(key => ({
                            name: key.slice(prefix.length)
                                .split('_')
                                .map(str => str.slice(0, 1).toUpperCase() + str.slice(1).toLowerCase()).join(' '),
                            value: window.GLOBAL[key]
                        }))
                        .filter(key => key.name != 'Names');
                }

                /* eslint-enable no-inner-declarations */

                // #endregion


                const global = {
                    BodyFlag: getGlobalsByPrefix('FLAG_'),
                    BodyType: getGlobalsByPrefix('TYPE_'),
                    Class: getGlobalsByPrefix('CLASS_'),
                    FluidType: getGlobalsByPrefix('FLUID_TYPE_'),
                    GenitalSpot: getGlobalsByPrefix('GENITAL_SPOT_'),
                    HairType: getGlobalsByPrefix('HAIR_TYPE_'),
                    ItemFlag: getGlobalsByPrefix('ITEM_FLAG_'),
                    NippleType: getGlobalsByPrefix('NIPPLE_TYPE_'),
                    SexPref: getGlobalsByPrefix('SEXPREF_'),
                    SkinType: getGlobalsByPrefix('SKIN_TYPE_'),
                    TailGenital: getGlobalsByPrefix('TAIL_GENITAL_'),
                    ValidFlags: {},
                    ValidTypes: {}
                };
                const bf = global.BodyFlag;
                const bt = global.BodyType;

                global.ValidFlags = {
                    Areola: getValidFlagsFor('AREOLA', bf),
                    Arm: getValidFlagsFor('ARM', bf),
                    Cock: getValidFlagsFor('COCK', bf),
                    Face: getValidFlagsFor('FACE', bf),
                    Leg: getValidFlagsFor('LEG', bf),
                    Skin: getValidFlagsFor('SKIN', bf),
                    Tail: getValidFlagsFor('TAIL', bf),
                    Tailcunt: getValidFlagsFor('VAGINA', bf),
                    Tongue: getValidFlagsFor('TONGUE', bf),
                    Vagina: getValidFlagsFor('VAGINA', bf)
                };

                global.ValidFlags.Tail.push({ name: 'Parasitic', value: 55 });
                global.ValidFlags.Tailcunt.push({ name: 'Tailcunt', value: 42 });

                global.ValidTypes = {
                    Antennae: getValidTypesFor('ANTENNAE', bt),
                    Arm: getValidTypesFor('ARM', bt),
                    Cock: getValidTypesFor('COCK', bt),
                    Dicknipple: getValidTypesFor('DICKNIPPLE', bt),
                    Ear: getValidTypesFor('EAR', bt),
                    Eye: getValidTypesFor('EYE', bt),
                    Face: getValidTypesFor('FACE', bt),
                    Horn: getValidTypesFor('HORN', bt),
                    Leg: getValidTypesFor('LEG', bt),
                    Tail: getValidTypesFor('TAIL', bt),
                    TailGenital: getValidFor('TAIL_GENITAL', '_ARGS', bt),
                    Tongue: getValidTypesFor('TONGUE', bt),
                    Vagina: getValidTypesFor('VAGINA', bt),
                    Wing: getValidTypesFor('WING', bt)
                };

                const pantyData = {};
                const pantyDataArr = window.PantyData.toJSON();
                for (let i = 0; i < pantyDataArr.length; i++) {
                    pantyData[pantyDataArr[i][0]] = pantyDataArr[i][1].panty;
                }

                return { global, pantyData };
            }
            catch (e) {
                return { error: e };
            }
        });

        const evalGameEnd = Date.now();
        util.printOperationTime('game instance', evalGameStart, evalGameEnd, 'evaluated ');
    }
    catch (err) {
        console.log(err);
        await browser.close();
        return;
    }



    if (evalResult.error) {
        console.log('Error: ' + evalResult.error);
        await browser.close();
        return;
    }


    const obj = evalResult.global;
    const pantyData = evalResult.pantyData;


    // #region Util

    /**
    * Get the index of the nth ocurrence of a value in a string, or -1 if the value is not contained in the target string
    * @param {string} target
    * @param {string} value
    * @param {number} nth
    */
    // yeah this should go in the util obj to keep consistency but this is used a lot and icba to type util. like 500 times, whos gonna stop me
    function nthIndex(target, value, nth) {
        const len = target.length;
        var index = -1;

        while (nth-- && index++ < len) {
            index = target.indexOf(value, index);
            if (index < 0) break;
        }

        return index;
    }


    // #endregion


    // #region StorageClass stuff

    class StorageClass {
        constructor() {
            this.classInstance = 'StorageClass';
            this.neverSerialize = false;
            this.version = 1;
            this.storageName = '';
            this.value1 = 0;
            this.value2 = 0;
            this.value3 = 0;
            this.value4 = 0;
            this.hidden = true;
            this.iconName = '';
            this.tooltip = '';
            this.combatOnly = false;
            this.minutesLeft = 0;
            this.iconShade = 'var(--textColor)';
        }
    }

    /**
    * Get data for a StorageClass 'Value' field at the specified position from a string
    * @param {number} position
    * @param {string} str
    */
    function getStorageClassValue(position, str) {
        var value = 0;

        if (nthIndex(str, ',', position) > 0) {
            if (nthIndex(str, ',', position + 1) > 0) {
                value = str.slice(nthIndex(str, ',', position) + 1, nthIndex(str, ',', position + 1));
            }
            else {
                value = str.slice(nthIndex(str, ',', position) + 1, nthIndex(str, ')', 1));
            }

            value = !isNaN(parseFloat(value)) ? parseFloat(value) : 0;
        }

        return value;
    }

    // #endregion


    // #region Valid Body Flags (handle valid body flags that aren't part of GLOBALS)


    // #region Ear

    console.log('\ngetting valid ear flags');
    const validEarFlagsStart = Date.now();

    var validEarFlags = [];

    (function () {
        for (var index = 0; index < contents.length; ++index) {
            var content = contents[index];
            // const regex = /\.(addEarFlag)\(([\S ][^)]+)\)*/g;
            const regex = /\.(addEarFlag)\((GLOBAL.FLAG_([\S ][^)]+))\)*/g;

            var m;
            while ((m = regex.exec(content)) !== null) {
                if (m.index === regex.lastIndex) {
                    regex.lastIndex++;
                }

                m.forEach((match, groupIndex) => {
                    if (groupIndex == 3) {
                        const flag = obj.BodyFlag.find((body) => body.name.toLocaleLowerCase() == match.toLocaleLowerCase());

                        validEarFlags.push({
                            name: flag.name,
                            value: flag.value
                        });
                    }
                });
            }
        }
    })();

    validEarFlags = util.formatValidFlagArray(validEarFlags);

    obj.ValidFlags.Ear = validEarFlags;

    const validEarFlagsEnd = Date.now();
    util.printOperationTime('valid ear flags', validEarFlagsStart, validEarFlagsEnd);

    // #endregion


    // #region Ass

    console.log('\ngetting valid ass flags');
    const validAssFlagsStart = Date.now();

    var validAssFlags = [];

    (function () {
        for (var index = 0; index < contents.length; ++index) {
            var content = contents[index];
            const regex = /(ass.flags)[= ]+(\[(GLOBAL.FLAG_[\S ][^)]+)\])/g;

            var m;
            while ((m = regex.exec(content)) !== null) {
                if (m.index === regex.lastIndex) {
                    regex.lastIndex++;
                }

                m.forEach((match, groupIndex) => {
                    if (groupIndex == 2) {
                        var assFlagArray = match.match(/_([\S ])[^\,\]]*/g);

                        assFlagArray.forEach((item, index, arr) => arr[index] = item.slice(1));

                        for (let i = 0; i < assFlagArray.length; i++) {
                            const flag = obj.BodyFlag.find((body) => body.name.toLocaleLowerCase() == assFlagArray[i].toLocaleLowerCase());

                            validAssFlags.push({
                                name: flag.name,
                                value: flag.value
                            });
                        }
                    }
                });
            }
        }
    })();

    validAssFlags = util.formatValidFlagArray(validAssFlags);

    obj.ValidFlags.Ass = validAssFlags;

    const validAssFlagsEnd = Date.now();
    util.printOperationTime('valid ass flags', validAssFlagsStart, validAssFlagsEnd);

    // #endregion


    // #endregion


    // #region State Flags

    console.log('\ngetting game state flags');
    const gameFlagsStart = Date.now();

    var gameFlags = [];

    (function () {
        for (var index = 0; index < contents.length; ++index) {
            var content = contents[index];

            var m = content.match(/flags\.[\w_]+/g);
            if (m && m.length > 0) {
                gameFlags = gameFlags.concat(m.map((value) => value.substr(6)));
            }

            m = content.match(/flags\[['"][\w_]+['"]\]/g);
            if (m && m.length > 0) {
                gameFlags = gameFlags.concat(m.map((value) => value.substr(7, value.length - 2)));
            }

            m = content.match(/incFlags\('[\w_]+/g);
            if (m && m.length > 0) {
                gameFlags = gameFlags.concat(m.map((value) => value.substr(10)));
            }
        }
    })();


    // Format
    gameFlags = gameFlags.filter((value, index, self) => self.indexOf(value) === index && value.toUpperCase() === value).sort();

    // Convert to dictionary, set all values to null
    gameFlags = gameFlags.reduce((acc, curr) => (acc[curr] = null, acc), {});

    const gameFlagsEnd = Date.now();
    util.printOperationTime('game flags', gameFlagsStart, gameFlagsEnd);

    // #endregion


    // #region Perks

    console.log('\ngetting perks');
    const perksStart = Date.now();

    var perks = [];

    (function () {
        for (var index = 0; index < contents.length; ++index) {
            var content = contents[index];
            const regex = /\.(create|has)Perk\("([\S ][^)]+)\)*/g;

            var m;
            while ((m = regex.exec(content)) !== null) {
                if (m.index === regex.lastIndex) {
                    regex.lastIndex++;
                }

                m.forEach(match => {
                    var perk = new StorageClass();

                    if (match.startsWith('.create')) {
                        perk.storageName = match.slice(nthIndex(match, '"', 1) + 1, nthIndex(match, '"', 2));
                        perk.value1 = getStorageClassValue(1, match);
                        perk.value2 = getStorageClassValue(2, match);
                        perk.value3 = getStorageClassValue(3, match);
                        perk.value4 = getStorageClassValue(4, match);

                        if (nthIndex(match, '"', 3) > 0) {
                            perk.tooltip = match.slice(nthIndex(match, '"', 3) + 1, nthIndex(match, ')', 1) - 1);
                        }

                        perks.push(perk);
                    }
                });
            }
        }
    })();

    perks = util.formatStorageClassArray(perks);

    const perksEnd = Date.now();
    util.printOperationTime('perks', perksStart, perksEnd);

    // #endregion


    // #region Status Effects

    console.log('\ngetting status effects');
    const statusEffectsStart = Date.now();

    var statusEffects = [];

    (function () {
        for (var index = 0; index < contents.length; ++index) {
            var content = contents[index];
            const regex = /\.(create|has)StatusEffect\(([\"\w\ \,\+\%\.\'\-\’\!\?\$\#\@\/\&\*]+)\)/g;

            var m;
            while ((m = regex.exec(content)) !== null) {
                if (m.index === regex.lastIndex) {
                    regex.lastIndex++;
                }

                m.forEach(match => {
                    var statusEffect = new StorageClass();

                    if (match.startsWith('.create')) {
                        if (nthIndex(match, '"', 1) === nthIndex(match, '(', 1) + 1) {
                            statusEffect.storageName = match.slice(nthIndex(match, '"', 1) + 1, nthIndex(match, '"', 2));
                        }

                        statusEffect.value1 = getStorageClassValue(1, match);
                        statusEffect.value2 = getStorageClassValue(2, match);
                        statusEffect.value3 = getStorageClassValue(3, match);
                        statusEffect.value4 = getStorageClassValue(4, match);

                        if (nthIndex(match, '"', 5) > 0) {
                            if (nthIndex(match, ',', 8) > 0) {
                                statusEffect.tooltip = match.slice(nthIndex(match, '"', 5) + 1, nthIndex(match, '"', 6));
                            }
                            else {
                                if (nthIndex(match, ',', 9) > 0) {
                                    statusEffect.tooltip = match.slice(nthIndex(match, '"', 5) + 1, nthIndex(match, ',', 9) - 1);
                                }
                                else {
                                    statusEffect.tooltip = match.slice(nthIndex(match, '"', 5) + 1, nthIndex(match, ')', 1) - 1);
                                }
                            }
                        }

                        if (nthIndex(match, '"', 3) > 0) {
                            statusEffect.iconName = match.slice(nthIndex(match, '"', 3) + 1, nthIndex(match, '"', 4));
                        }

                        if (nthIndex(match, ',', 5) > 0) {
                            let strBool = '';
                            let bool = false;
                            if (nthIndex(match, ',', 6) > 0) {
                                strBool = match.slice(nthIndex(match, ',', 5) + 1, nthIndex(match, ',', 6));
                            }
                            else {
                                strBool = match.slice(nthIndex(match, ',', 5) + 1, nthIndex(match, ')', 1) - 1);

                            }

                            if (strBool === '!0' || strBool === '!1') {
                                bool = strBool === '!0';
                            }
                            if (strBool === 'true' || strBool === 'false') {
                                bool = strBool === 'true';
                            }

                            statusEffect.hidden = bool;
                        }


                        statusEffects.push(statusEffect);
                    }
                });
            }
        }
    })();

    statusEffects = util.formatStorageClassArray(statusEffects);

    const statusEffectsEnd = Date.now();
    util.printOperationTime('status effects', statusEffectsStart, statusEffectsEnd);

    // #endregion


    // #region Codex

    console.log('\ngetting codex entries');
    const codexEntriesStart = Date.now();

    var codexEntries = [];

    (function () {
        for (var index = 0; index < contents.length; ++index) {
            var content = contents[index];
            const regex = /\.addCodexEntry\(([\S ][^)]+)\)*/g;

            var m;
            while ((m = regex.exec(content)) !== null) {
                if (m.index === regex.lastIndex) {
                    regex.lastIndex++;
                }

                m.forEach(match => {
                    codexEntries.push(match.slice(nthIndex(match, '"', 3) + 1, nthIndex(match, '"', 4)));
                });
            }
        }
    })();

    // Format
    codexEntries = codexEntries.filter((v, i, a) => a.findIndex(v2 => (v2 === v)) === i).sort();

    const codexEntriesEnd = Date.now();
    util.printOperationTime('codex entries', codexEntriesStart, codexEntriesEnd);

    // #endregion


    // #region Key Items

    console.log('\ngetting key items');
    const keyItemsStart = Date.now();

    var keyitems = [];

    (function () {
        for (var index = 0; index < contents.length; ++index) {
            var content = contents[index];
            const regex = /\.(create|has)KeyItem\("([\S ][^)]+)\)*/g;

            var m;
            while ((m = regex.exec(content)) !== null) {
                if (m.index === regex.lastIndex) {
                    regex.lastIndex++;
                }

                m.forEach((match) => {
                    var keyitem = new StorageClass();

                    if (match.startsWith('.create')) {
                        keyitem.storageName = match.slice(nthIndex(match, '"', 1) + 1, nthIndex(match, '"', 2));
                        keyitem.value1 = getStorageClassValue(1, match);
                        keyitem.value2 = getStorageClassValue(2, match);
                        keyitem.value3 = getStorageClassValue(3, match);
                        keyitem.value4 = getStorageClassValue(4, match);

                        if (nthIndex(match, '"', 3) > 0) {
                            keyitem.tooltip = match.slice(nthIndex(match, '"', 3) + 1, nthIndex(match, ')', 1) - 1);
                        }

                        keyitems.push(keyitem);
                    }
                });
            }
        }
    })();

    var panties = [];

    (function () {
        for (var index = 0; index < contents.length; ++index) {
            var content = contents[index];
            const regex = /\.(create|has)KeyItem\((PantyData.get\([\S ][^)]+[\S ][^)]+)\)/g;

            var m;
            while ((m = regex.exec(content)) !== null) {
                if (m.index === regex.lastIndex) {
                    regex.lastIndex++;
                }

                m.forEach((match) => {
                    var panty = new StorageClass();

                    if (match.startsWith('.create')) {
                        panty.storageName = pantyData[(match.slice(nthIndex(match, '"', 1) + 1, nthIndex(match, '"', 2)))];
                        panty.value1 = getStorageClassValue(1, match);
                        panty.value2 = getStorageClassValue(2, match);
                        panty.value3 = getStorageClassValue(3, match);
                        panty.value4 = getStorageClassValue(4, match);

                        if (nthIndex(match, '"', 3) > 0) {
                            panty.tooltip = match.slice(nthIndex(match, '"', 3) + 1, nthIndex(match, ')', 2) - 1);
                        }

                        panties.push(panty);
                    }
                });
            }
        }
    })();

    keyitems = keyitems.concat(panties);

    keyitems = util.formatStorageClassArray(keyitems);

    const keyItemsEnd = Date.now();
    util.printOperationTime('key items', keyItemsStart, keyItemsEnd);

    // #endregion


    // #region Hair Styles


    // #region Data

    class HairClass {
        constructor() {
            this.displayName = '';
            this.name = '';
            this.desc = '';
            this.extra = '';
        }
    }

    function getHairVal(str, num) {
        var value = 0;
        if (nthIndex(str, '",', num) > 0) {
            if (nthIndex(str, '",', num + 1) > 0) {
                value = str.slice(nthIndex(str, '",', num) + 3, nthIndex(str, '",', num + 1));
            }
            else {
                value = str.slice(nthIndex(str, '",', num) + 3, nthIndex(str, '",', 1));
            }
        } else {
            value = str.slice(nthIndex(str, '"', num) + 2, nthIndex(str, '","', 1));
        }
        return value;
    }

    // #endregion


    console.log('\ngetting hair styles');
    const hairStylesStart = Date.now();

    var hairStyles = [];

    (function () {
        for (var index = 0; index < contents.length; ++index) {
            var content = contents[index];

            // only check tavros (cause only ceria is a hairdresser)
            if (!content.includes('sourceMappingURL=content_tavros')) {
                continue;
            }
            const regex = /\.(push)\(\[([\S ][^)]+[\S ][^)])\]\)/g;

            var m;
            while ((m = regex.exec(content)) !== null) {
                if (m.index === regex.lastIndex) {
                    regex.lastIndex++;
                }

                m.forEach((match, groupIndex) => {
                    var hair = new HairClass();

                    if (groupIndex == 2 && (match.match(/\"/g) || []).length == 8 && !match.includes('+') && (match.match(/\,/g) || []).length >= 5) {
                        hair.name = getHairVal(match, 0);
                        hair.value = getHairVal(match, 1);
                        hair.desc = getHairVal(match, 2);
                        hair.extra = getHairVal(match, 3);

                        hairStyles.push(hair);
                    }
                });
            }
        }
    })();

    hairStyles = hairStyles.filter((v, i, a) => a.findIndex(v2 => (v2 === v)) === i).sort();

    obj.HairStyles = hairStyles;

    const hairStylesEnd = Date.now();
    util.printOperationTime('hair styles', hairStylesStart, hairStylesEnd);

    // #endregion


    console.log('\nwriting to disk');
    const writeStart = Date.now();

    fs.writeFileSync('../data/global.js', util.formatToFile('GlobalKeys', obj));
    fs.writeFileSync('../data/flags.js', util.formatToFile('Flags', gameFlags));
    fs.writeFileSync('../data/perks.js', util.formatToFile('Perks', perks));
    fs.writeFileSync('../data/status.js', util.formatToFile('StatusEffects', statusEffects));
    fs.writeFileSync('../data/codex.js', util.formatToFile('CodexEntries', codexEntries));
    fs.writeFileSync('../data/keyitems.js', util.formatToFile('KeyItems', keyitems));

    const writeEnd = Date.now();
    util.printOperationTime('written', writeStart, writeEnd, 'files ');


    await browser.close();


    var operationEnd = Date.now();
    console.log('\nall operations completed, total time: ' + util.getElapsedTime(operationStart, operationEnd));
})();