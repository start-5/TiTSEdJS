const puppeteer = require('puppeteer');
const prettier = require('prettier');
const fs = require('fs');

(async () => {
    function getElapsedTime(start, end) {
        var duration = end - start;
        var ms = Math.floor((duration % 1000) / 1),
            s = Math.floor((duration / 1000) % 60),
            m = Math.floor((duration / (1000 * 60)) % 60);

        s = (s < 10 && m > 0) ? "0" + s : s;

        var result = (m > 0 ? m + ':' : '') + (s > 0 ? s + '.' : '') + ms;
        if (s > 0 && m < 1) { return result += 's'; }
        else if (s < 1 && m < 1) { return result += 'ms'; }
        else { return result; }
    }

    var browser_start = Date.now();
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
        await page.goto('https://www.fenoxo.com/play/TiTS/release/', { timeout: 0 });
        console.log('game loaded');
    }
    catch (err) {
        console.log(err);
        await browser.close();
        return;
    }

    console.log('urls', urls);

    var obj;
    try {
        console.log('beginning scrape');
        obj = await page.evaluate(() => {
            var log = '';
            function start(msg) { log += msg + '\n' }

            try {
                function getObjectRecursive(theObject, keyName) {
                    var result = null;
                    if (theObject instanceof Array) {
                        for (var i = 0; i < theObject.length; i++) {
                            result = getObjectRecursive(theObject[i]);
                        }
                    }
                    else {
                        for (var prop in theObject) {
                            if (prop == keyName) {
                                return theObject[keyName];
                            }
                            if (theObject[prop] instanceof Object || theObject[prop] instanceof Array)
                                result = getObjectRecursive(theObject[prop]);
                        }
                    }
                    return result;
                }

                function getValidFlagsFor(bodyPart, bodyFlagArr) {
                    var validFlags = [];
                    var propName = 'VALID_' + bodyPart + '_FLAGS';
                    var flagArr = getObjectRecursive(window.GLOBAL, propName);
                    for (var i = 0; i < flagArr.length; i++) {
                        validFlags.push(bodyFlagArr.find(f => f.value == flagArr[i]));
                    }
                    return validFlags;
                }

                function getValidTypesFor(bodyPart, bodyPartArr) {
                    var validTypes = [];
                    var propName = 'VALID_' + bodyPart + '_TYPES';
                    var typeArr = getObjectRecursive(window.GLOBAL, propName);
                    for (var i = 0; i < typeArr.length; i++) {
                        validTypes.push(bodyPartArr.find(f => f.value == typeArr[i]));
                    }
                    return validTypes;
                }

                function getGlobalsByPrefix(prefix) {
                    return Object.keys(window.GLOBAL)
                        .filter(key => key.startsWith(prefix))
                        .sort(key => window.GLOBAL[key])
                        .map(key => ({
                            name: key.slice(prefix.length)
                                .split('_')
                                .map(str => str.slice(0, 1).toUpperCase() + str.slice(1).toLowerCase()).join(' '),
                            value: window.GLOBAL[key]
                        }));
                }

                start('Generating globals');
                var globalsObj;
                {
                    start('getting classes');
                    const Class = getGlobalsByPrefix('CLASS_');

                    start('getting body flags');
                    const BodyFlag = getGlobalsByPrefix('FLAG_');

                    start('getting body types');
                    const BodyType = getGlobalsByPrefix('TYPE_');

                    start('getting tail genitals');
                    const TailGenital = getGlobalsByPrefix('TAIL_GENITAL_');

                    start('getting skin types');
                    const SkinType = getGlobalsByPrefix('SKIN_TYPE_');

                    start('getting nipple types');
                    const NippleType = getGlobalsByPrefix('NIPPLE_TYPE_');

                    start('getting fluid types');
                    const FluidType = getGlobalsByPrefix('FLUID_TYPE_');

                    start('getting hair types');
                    const HairType = getGlobalsByPrefix('HAIR_TYPE_');

                    start('getting genital positions');
                    const GenitalSpot = getGlobalsByPrefix('GENITAL_SPOT_');

                    start('getting item flags');
                    const ItemFlag = getGlobalsByPrefix('ITEM_FLAG_');

                    start('getting sexprefs');
                    const SexPref = getGlobalsByPrefix('SEXPREF_');

                    start('getting valid body flags');
                    const ValidFlags =
                    {
                        Face: getValidFlagsFor("FACE", BodyFlag),
                        Tongue: getValidFlagsFor("TONGUE", BodyFlag),
                        Arm: getValidFlagsFor("ARM", BodyFlag),
                        Leg: getValidFlagsFor("LEG", BodyFlag),
                        Tail: getValidFlagsFor("TAIL", BodyFlag),
                        Skin: getValidFlagsFor("SKIN", BodyFlag)
                    };

                    start('getting valid body types');
                    const ValidTypes =
                    {
                        Face: getValidTypesFor("FACE", BodyType),
                        Eye: getValidTypesFor("EYE", BodyType),
                        Tongue: getValidTypesFor("TONGUE", BodyType),
                        Ear: getValidTypesFor("EAR", BodyType),
                        Arm: getValidTypesFor("ARM", BodyType),
                        Leg: getValidTypesFor("LEG", BodyType),
                        Antennae: getValidTypesFor("ANTENNAE", BodyType), //kinda random but according to the game "human" is a valid antennae type????
                        Horn: getValidTypesFor("HORN", BodyType),
                        Wing: getValidTypesFor("WING", BodyType),
                        Tail: getValidTypesFor("TAIL", BodyType)
                    };

                    //todo stuff

                    globalsObj = {
                        Class, BodyFlag, BodyType, TailGenital, SkinType, NippleType, FluidType, HairType, GenitalSpot, ItemFlag, SexPref,
                        ValidFlags, ValidTypes
                    };
                }

                start('stringifying global');
                const globals = JSON.stringify(globalsObj);

                return { globals, log };
            }
            catch (err) {
                return { log, err: err + '' };
            }
        });
        console.log('completed scrape');
    }
    catch (err) {
        console.log(err);
        await browser.close();
        return;
    }

    console.log(obj.log);

    if (obj.err) {
        console.log('Error:' + obj.err + '');
        await browser.close();
        return;
    }

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
            this.toolTip = "";
            this.combatOnly = false;
            this.minutesLeft = 0;
            this.iconShade = "var(--textColor)";
        }
    }

    function nthIndex(str, pat, n) {
        var L = str.length, i = -1;
        while (n-- && i++ < L) {
            i = str.indexOf(pat, i);
            if (i < 0) break;
        }
        return i;
    }

    function getPerkVal(str, num) {
        var value = 0;
        if (nthIndex(str, ',', num) > 0) {
            if (nthIndex(str, ',', num + 1) > 0) {
                value = str.slice(nthIndex(str, ',', num) + 1, nthIndex(str, ',', num + 1));
            }
            else {
                value = str.slice(nthIndex(str, ',', num) + 1, nthIndex(str, ')', 1));
            }

            value = !isNaN(parseFloat(value)) ? parseFloat(value) : 0;
        }
        return value;
    }

    console.log('\nRetrieving game flags');
    var gameFlags_start = Date.now();
    var gameFlags = [];
    for (var index = 0; index < contents.length; ++index) {
        var content = contents[index];
        var matches = content.match(/flags\.[\w_]+/g);
        if (matches && matches.length > 0) {
            gameFlags = gameFlags.concat(matches.map((value) => value.substr(6)));
        }
        var matches = content.match(/flags\[['"][\w_]+['"]\]/g);
        if (matches && matches.length > 0) {
            gameFlags = gameFlags.concat(matches.map((value) => value.substr(7, value.length - 2)));
        }
        var matches = content.match(/incFlags\('[\w_]+/g);
        if (matches && matches.length > 0) {
            gameFlags = gameFlags.concat(matches.map((value) => value.substr(10)));
        }
    }
    gameFlags = gameFlags.filter((value, index, self) => self.indexOf(value) === index && value.toUpperCase() === value).sort();
    gameFlags = gameFlags.reduce((acc, curr) => (acc[curr] = null, acc), {});
    var gameFlags_end = Date.now();
    console.log('Retrieved game flags, operation took ' + getElapsedTime(gameFlags_start, gameFlags_end) + ' to complete');


    // Perks are part of the StorageClass class, from what I saw, they are not globally defined,
    // they are instantiated and added to a char when the game needs to.

    // You could create a "custom" perk with whatever value and the game would count it as valid, but to actually have an effect it
    // would need to be checked at some point with this.hasPerk, otherwise it just sits there.

    // I assume this is the same with Status Effects

    console.log('\nRetrieving perks');
    var perks_start = Date.now();
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
                    perk.value1 = getPerkVal(match, 1);
                    perk.value2 = getPerkVal(match, 2);
                    perk.value3 = getPerkVal(match, 3);
                    perk.value4 = getPerkVal(match, 4);

                    if (nthIndex(match, '"', 3) > 0) {
                        perk.toolTip = match.slice(nthIndex(match, '"', 3) + 1, nthIndex(match, ')', 1) - 1);
                    }

                    perks.push(perk);
                }
            });
        }
    }
    perks = perks.filter((v, i, a) => a.findIndex(v2 => (v2.storageName === v.storageName)) === i).sort();
    var perks_end = Date.now();
    console.log('Retrieved perks, operation took ' + getElapsedTime(perks_start, perks_end) + ' to complete');


    console.log('\nRetrieving status effects');
    var statusEffects_start = Date.now();
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

                    statusEffect.value1 = getPerkVal(match, 1);
                    statusEffect.value2 = getPerkVal(match, 2);
                    statusEffect.value3 = getPerkVal(match, 3);
                    statusEffect.value4 = getPerkVal(match, 4);

                    if (nthIndex(match, '"', 5) > 0) {
                        if (nthIndex(match, ',', 8) > 0) {
                            statusEffect.toolTip = match.slice(nthIndex(match, '"', 5) + 1, nthIndex(match, '"', 6));
                        }
                        else {
                            if (nthIndex(match, ',', 9) > 0) {
                                statusEffect.toolTip = match.slice(nthIndex(match, '"', 5) + 1, nthIndex(match, ',', 9) - 1);
                            }
                            else {
                                statusEffect.toolTip = match.slice(nthIndex(match, '"', 5) + 1, nthIndex(match, ')', 1) - 1);
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
    statusEffects = statusEffects.filter((v, i, a) => a.findIndex(v2 => (v2.storageName === v.storageName)) === i).sort();
    var statusEffects_end = Date.now();
    console.log('Retrieved status effects, operation took ' + getElapsedTime(statusEffects_start, statusEffects_end) + ' to complete');


    console.log('\nRetrieving codex entries');
    var codexEntries_start = Date.now();
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
    codexEntries = codexEntries.filter((v, i, a) => a.findIndex(v2 => (v2 === v)) === i).sort();
    var codexEntries_end = Date.now();
    console.log('Retrieved codex entries, operation took ' + getElapsedTime(codexEntries_start, codexEntries_end) + ' to complete');

    const format = str => prettier.format(str, { parser: 'babel', tabWidth: 4 });

    console.log('\nWriting to file(s)');
    var write_start = Date.now();
    fs.writeFileSync('../data/global.js', format('const GlobalKeys = ' + obj.globals));
    fs.writeFileSync('../data/flags.js', format('const Flags = ' + JSON.stringify(gameFlags)));
    fs.writeFileSync('../data/perks.js', format('const Perks = ' + JSON.stringify(perks)));
    fs.writeFileSync('../data/status.js', format('const StatusEffects = ' + JSON.stringify(statusEffects)));
    fs.writeFileSync('../data/codex.js', format('const CodexEntries = ' + JSON.stringify(codexEntries)));
    var write_end = Date.now();
    console.log('File(s) written, operation took ' + getElapsedTime(write_start, write_end) + ' to complete');


    await browser.close();
    var browser_end = Date.now()
    console.log('\n\nAll operations completed, total time: ' + getElapsedTime(browser_start, browser_end));
})();