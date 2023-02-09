const puppeteer = require('puppeteer');
const prettier = require('prettier');
const fs = require('fs');


// Observations:

// Perks are part of the StorageClass class, from what I saw, they are not globally defined, they are instantiated and added to characters on demand.
// You could create a "custom" perk with whatever value and the game would count it as valid, but to actually have an effect it
// would need to be checked at some point with this.hasPerk, otherwise it just sits there.
// (afaik) This is the same with everything that inherits from StorageClass


(async () => {

    const operationStart = Date.now();


    const util = {

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

            sec = (sec < 10 && min > 0) ? "0" + sec : sec;

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

    }


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

            var log = '';

            /**
            * @param {string} msg
            */
            function write(msg) {
                log += msg + '\n'
            }


            try {

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
                    return getValidFor(bodyPartName, '_FLAGS', bodyFlagsArray)
                }

                /**
                * Get valid types for a body part
                * @param {string} bodyPartName
                * @param {Array} bodyPartsArray
                */
                function getValidTypesFor(bodyPartName, bodyPartsArray) {
                    return getValidFor(bodyPartName, '_TYPES', bodyPartsArray)
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



                const global = {
                    Class: getGlobalsByPrefix('CLASS_'),
                    BodyFlag: getGlobalsByPrefix('FLAG_'),
                    BodyType: getGlobalsByPrefix('TYPE_'),
                    TailGenital: getGlobalsByPrefix('TAIL_GENITAL_'),
                    SkinType: getGlobalsByPrefix('SKIN_TYPE_'),
                    NippleType: getGlobalsByPrefix('NIPPLE_TYPE_'),
                    FluidType: getGlobalsByPrefix('FLUID_TYPE_'),
                    HairType: getGlobalsByPrefix('HAIR_TYPE_'),
                    GenitalSpot: getGlobalsByPrefix('GENITAL_SPOT_'),
                    ItemFlag: getGlobalsByPrefix('ITEM_FLAG_'),
                    SexPref: getGlobalsByPrefix('SEXPREF_'),
                    ValidFlags: {},
                    ValidTypes: {}
                }

                global.ValidFlags = {
                    Face: getValidFlagsFor('FACE', global.BodyFlag),
                    Tongue: getValidFlagsFor('TONGUE', global.BodyFlag),
                    Arm: getValidFlagsFor('ARM', global.BodyFlag),
                    Leg: getValidFlagsFor('LEG', global.BodyFlag),
                    Tail: getValidFlagsFor('TAIL', global.BodyFlag),
                    Skin: getValidFlagsFor('SKIN', global.BodyFlag),
                    Areola: getValidFlagsFor('AREOLA', global.BodyFlag),
                    Cock: getValidFlagsFor("COCK", global.BodyFlag),
                    Vagina: getValidFlagsFor("VAGINA", global.BodyFlag),
                    Tailcunt: getValidFlagsFor("VAGINA", global.BodyFlag)
                };

                global.ValidTypes = {
                    Face: getValidTypesFor('FACE', global.BodyType),
                    Eye: getValidTypesFor('EYE', global.BodyType),
                    Tongue: getValidTypesFor('TONGUE', global.BodyType),
                    Ear: getValidTypesFor('EAR', global.BodyType),
                    Arm: getValidTypesFor('ARM', global.BodyType),
                    Leg: getValidTypesFor('LEG', global.BodyType),
                    Antennae: getValidTypesFor('ANTENNAE', global.BodyType),
                    Horn: getValidTypesFor('HORN', global.BodyType),
                    Wing: getValidTypesFor('WING', global.BodyType),
                    Tail: getValidTypesFor('TAIL', global.BodyType)
                };

                return { global };
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


    /**
    * Get the index of the nth ocurrence of a value in a string, or -1 if the value is not contained in the target string
    * @param {string} target
    * @param {string} value
    * @param {number} nth
    */
    function nthIndex(target, value, nth) {
        const len = target.length;
        var index = -1;

        while (nth-- && index++ < len) {
            index = target.indexOf(value, index);
            if (index < 0) break;
        }

        return index;
    }


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


    // #region Flags

    console.log('\ngetting game flags');
    const gameFlagsStart = Date.now();

    var gameFlags = [];

    for (var index = 0; index < contents.length; ++index) {
        var content = contents[index];

        var m = content.match(/flags\.[\w_]+/g);
        if (m && m.length > 0) {
            gameFlags = gameFlags.concat(m.map((value) => value.substr(6)));
        }

        var m = content.match(/flags\[['"][\w_]+['"]\]/g);
        if (m && m.length > 0) {
            gameFlags = gameFlags.concat(m.map((value) => value.substr(7, value.length - 2)));
        }

        var m = content.match(/incFlags\('[\w_]+/g);
        if (m && m.length > 0) {
            gameFlags = gameFlags.concat(m.map((value) => value.substr(10)));
        }
    }

    // Remove duplicates
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

    for (var index = 0; index < contents.length; ++index) {
        var content = contents[index];
        const regex = /\.(create|has)Perk\("([\S ][^)]+)\)*/g

        var m;
        while ((m = regex.exec(content)) !== null) {
            if (m.index === regex.lastIndex) {
                regex.lastIndex++;
            }

            m.forEach((match, groupIndex) => {
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

    // Remove duplicates
    perks = perks.filter((v, i, a) => a.findIndex(v2 => (v2.storageName === v.storageName)) === i).sort();

    const perksEnd = Date.now();
    util.printOperationTime('perks', perksStart, perksEnd);

    // #endregion


    // #region Status Effects

    console.log('\ngetting status effects');
    const statusEffectsStart = Date.now();

    var statusEffects = [];

    for (var index = 0; index < contents.length; ++index) {
        var content = contents[index];
        const regex = /\.(create|has)StatusEffect\(([\"\w\ \,\+\%\.\'\-\’\!\?\$\#\@\/\&\*]+)\)/g;

        var m;
        while ((m = regex.exec(content)) !== null) {
            if (m.index === regex.lastIndex) {
                regex.lastIndex++;
            }

            m.forEach((match, groupIndex) => {
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

    // Remove duplicates
    statusEffects = statusEffects.filter((v, i, a) => a.findIndex(v2 => (v2.storageName === v.storageName)) === i).sort();

    const statusEffectsEnd = Date.now();
    util.printOperationTime('status effects', statusEffectsStart, statusEffectsEnd);

    // #endregion


    // #region Codex

    console.log('\ngetting codex entries');
    const codexEntriesStart = Date.now();

    var codexEntries = [];

    for (var index = 0; index < contents.length; ++index) {
        var content = contents[index];
        const regex = /\.addCodexEntry\(([\S ][^)]+)\)*/g;

        var m;
        while ((m = regex.exec(content)) !== null) {
            if (m.index === regex.lastIndex) {
                regex.lastIndex++;
            }

            m.forEach((match, groupIndex) => {
                codexEntries.push(match.slice(nthIndex(match, '"', 3) + 1, nthIndex(match, '"', 4)));
            });
        }
    }

    // Remove duplicates
    codexEntries = codexEntries.filter((v, i, a) => a.findIndex(v2 => (v2 === v)) === i).sort();

    const codexEntriesEnd = Date.now();
    util.printOperationTime('codex entries', codexEntriesStart, codexEntriesEnd);

    // #endregion



    function format(str) {
        return prettier.format(str, {
            parser: 'babel',
            tabWidth: 4
        });
    }


    console.log('\nwriting to disk');
    const writeStart = Date.now();

    fs.writeFileSync('../data/global.js', format('const GlobalKeys = ' + JSON.stringify(evalResult.global)));
    fs.writeFileSync('../data/flags.js', format('const Flags = ' + JSON.stringify(gameFlags)));
    fs.writeFileSync('../data/perks.js', format('const Perks = ' + JSON.stringify(perks)));
    fs.writeFileSync('../data/status.js', format('const StatusEffects = ' + JSON.stringify(statusEffects)));
    fs.writeFileSync('../data/codex.js', format('const CodexEntries = ' + JSON.stringify(codexEntries)));

    const writeEnd = Date.now();
    util.printOperationTime('written', writeStart, writeEnd, 'files ');


    await browser.close();


    var operationEnd = Date.now()
    console.log('\nall operations completed, total time: ' + util.getElapsedTime(operationStart, operationEnd));
})();