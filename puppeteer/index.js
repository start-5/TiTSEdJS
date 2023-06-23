const puppeteer = require('puppeteer');
const prettier = require('prettier');
const sort_json = require('prettier-plugin-sort-json');
const fs = require('fs');
const path = require('path');
//const readline = require('readline');
//const rl = readline.createInterface({
//    input: process.stdin,
//    output: process.stdout
//});


/* eslint-disable no-useless-escape */


// Observations:
// Perks are part of the StorageClass class, from what I saw, they are not globally defined, they are instantiated and added to characters on demand.
// You could create a "custom" perk with whatever value and the game would count it as valid, but to actually have an effect it
// would need to be checked at some point with this.hasPerk, otherwise it just sits there.
// (afaik) This is the same with everything that inherits from StorageClass
//
// The window.GLOBAL object is actually inaccurate when dealing with valid flags/types. Though to be fair since flags are loosely added/checked on demand
// it makes sense that it's outdated/inaccurate
//
// - Regarding face flags: 'FLAG_FLUFFY' is added but never checked (Korgonne Snacks). 'FLAG_GOOEY' is checked but never added (Appearance)
// - Regarding leg flags: 'FLAG_TAPERED' is added but never checked (Naleen Nip).
// - Regarding penis flags: 'FLAG_FLARED', 'FLAG_NUBBY', 'FLAG_STINGER_TIPPED', some of Penny's interactions check flags backwards
// I'm gonna stop counting cause there's too many cases where this happens



(async () => {

    const util = {

        /**
        * Capitalizes the first letter
        * @param {string} str
        */
        capitalize: function (str) {
            return str && str[0].toUpperCase() + str.slice(1);
        },

        /**
        * Iterate through all contents using a regex
        * @param {RegExp} regex
        * @param {Function} callback
        * @param {Array<string>} names
        */
        execRegexOnContents: function (regex, callback, names = []) {
            for (var index = 0; index < contents.length; ++index) {
                var content = contents[index];

                if (names.length) {
                    if (!names.some(n => content.includes(n))) {
                        continue;
                    }
                }

                var m;
                while ((m = regex.exec(content)) !== null) {
                    if (m.index === regex.lastIndex) {
                        regex.lastIndex++;
                    }

                    m.forEach((match, groupIndex) => {
                        callback(match, groupIndex, m);
                    });
                }
            }
        },

        /**
        * Format a name value array
        * @param {Array<{name:string, value:number}>} arr
        */
        formatNameValueArray: function (arr) {
            return arr
                .filter((item, index, self) => self.findIndex(item2 => (item2.value === item.value)) === index)
                .sort((l, r) => l.value - r.value);
        },

        /**
        * Format a name value array by name
        * @param {Array<{name:string, value:number}>} arr
        */
        formatNameValueArrayByName: function (arr) {
            return arr
                .filter((item, index, self) => self.findIndex(item2 => (item2.name === item.name)) === index)
                .sort((l, r) => l.value - r.value);
        },

        /**
        * Format a 'StorageClass' flag array
        * @param {Array<StorageClass>} arr
        */
        formatStorageClassArray: function (arr) {

            function tryGetMaxValue(curr, existing, key, acc) {
                if (curr[key] > existing[key]) {
                    acc[key] = curr[key];
                }
            }

            function tryGetMaxText(curr, existing, key, acc) {
                if (curr[key].length > existing[key].length) {
                    acc[key] = curr[key];
                }
            }

            return arr
                .reduce((acc, curr) => {

                    const existingEffect = acc.find(e => e.storageName === curr.storageName);
                    if (existingEffect) {
                        const existingIndex = acc.indexOf(existingEffect);

                        tryGetMaxValue(curr, existingEffect, 'value1', acc[existingIndex]);
                        tryGetMaxValue(curr, existingEffect, 'value2', acc[existingIndex]);
                        tryGetMaxValue(curr, existingEffect, 'value3', acc[existingIndex]);
                        tryGetMaxValue(curr, existingEffect, 'value4', acc[existingIndex]);

                        tryGetMaxText(curr, existingEffect, 'tooltip', acc[existingIndex]);
                        tryGetMaxText(curr, existingEffect, 'iconName', acc[existingIndex]);

                        tryGetMaxValue(curr, existingEffect, 'minutesLeft', acc[existingIndex]);

                        const defaultShade = 'var(--textColor)';
                        if (curr.iconShade != defaultShade && existingEffect.iconShade == defaultShade) {
                            acc[existingIndex].iconShade = curr.iconShade;
                        }
                    }
                    else {
                        acc.push(curr);
                    }

                    return acc;

                }, [])
                .sort((l, r) => l.storageName.localeCompare(r.storageName));
        },

        /**
        * Format game data when saving to diff file
        * @param {any} data
        */
        formatToDiff: function (data) {
            return prettier.format(data, {
                parser: 'babel',
                tabWidth: 4
            });
        },

        /**
        * Format game data when saving to file
        * @param {string} name
        * @param {any} data
        */
        formatToFile: function (name, data) {
            const format1 = prettier.format(JSON.stringify(data), {
                parser: 'json',
                plugins: [sort_json],
                ...{
                    jsonRecursiveSort: true,
                },
            });

            var format2 = prettier.format(format1, {
                endOfLine: 'crlf',
                parser: 'json5',
                singleQuote: true,
                tabWidth: 4
            });
            format2 = format2.substr(0, format2.lastIndexOf('\r\n')); // Remove the stupid newline https://github.com/prettier/prettier/issues/6360

            return '/* eslint-disable no-unused-vars */\r\n\r\nconst ' + name + ' = ' + format2 + ';';
        },

        /**
        * Format data when saving to a json file
        * @param {any} data
        */
        formatToJSON: function (data) {
            return prettier.format(JSON.stringify(data), {
                endOfLine: 'crlf',
                parser: 'json',
                tabWidth: 4
            });
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

    const appConfig = {

        runDiffs: false,
        runDiffsPath: ''

    };


    if (appConfig.runDiffs) {
        //rl.question('Enter diffs path ', function (answer) {
        //    appConfig.runDiffsPath = answer;
        //    rl.close();
        //});
    }


    const operationStart = Date.now();


    const browser = await puppeteer.launch();// ({ devtools: true, headless: false });
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
        return 1;
    }


    console.log();
    console.log('urls', urls);
    console.log();


    var evalResult;


    try {
        console.log('evaluating game instance');
        const evalGameStart = Date.now();

        evalResult = await page.evaluate(async () => {
            try {


                // Note:
                // By this point we have started evaluating the page, which means that we are scoped to the browser page and not the file


                // #region Funcs

                /* eslint-disable no-inner-declarations */

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
                                .map(str => str.slice(0, 1).toUpperCase() + str.slice(1).toLowerCase())
                                .join(' '),
                            value: window.GLOBAL[key]
                        }))
                        .filter(key => typeof key.value !== 'object');
                }

                /**
                * Wait for completion of stuff
                * @param {number} time
                */
                function delay(time) {
                    return new Promise(function (resolve) {
                        setTimeout(resolve, time);
                    });
                }

                /* eslint-enable no-inner-declarations */

                // #endregion


                // #region Save File

                let raw = '{"classInstance":"GameState","neverSerialize":false,"version":21,"gameInstanceInfo":{"classInstance":"SaveSlotData","neverSerialize":false,"version":21,"note":null,"gender":"M","location":"FIRST-14, Kalas","name":"Donut","level":1,"occupation":"Smuggler","avatar":null,"miniMapVisible":true,"minimapRolledOut":false,"bustRolledOut":false,"dateTimeVisible":true},"debugMode":false,"easyMode":false,"sillyMode":false,"minutes":43,"hours":6,"days":1,"characters":{"PC":{"classInstance":"PlayerCharacter","neverSerialize":false,"version":2,"cocks":[{"classInstance":"Cock","neverSerialize":false,"version":3,"cLengthRaw":4,"cLengthMod":0,"cThicknessRatioRaw":1,"cThicknessRatioMod":0,"cType":0,"cockColor":"pink","knotMultiplier":1,"flaccidMultiplier":0.25,"virgin":true,"flags":[],"piercing":null,"cocksock":null}],"vaginas":[],"ass":{"classInstance":"Vagina","neverSerialize":false,"version":3,"type":0,"hymen":false,"clits":0,"vaginaColor":"pink","wetnessRaw":0,"wetnessMod":0,"loosenessRaw":1,"loosenessMod":0,"minLooseness":1,"bonusCapacity":0,"shrinkCounter":0,"flags":[],"fullness":0,"piercing":null,"clitPiercing":null},"breastRows":[{"classInstance":"BreastRow","neverSerialize":false,"version":2,"breasts":2,"nippleType":0,"areolaFlags":[],"breastRatingRaw":0,"breastRatingMod":0,"breastRatingLactationMod":0,"breastRatingHoneypotMod":0,"piercing":null,"fullness":0}],"perks":[{"classInstance":"StorageClass","neverSerialize":false,"version":1,"storageName":"Virile","value1":1.15,"value2":0,"value3":0,"value4":0,"hidden":true,"iconName":"","tooltip":"Increases the quality of your sperm.","combatOnly":false,"minutesLeft":0,"iconShade":"var(--textColor)"}],"statusEffects":[],"keyItems":[],"inventory":{"classInstance":"Inventory","neverSerialize":false,"version":1,"locationKey":"GLOBAL","storage":[],"decorationStorage":[],"transientStorage":[],"equippedItems":{"classInstance":"EquippedItems","neverSerialize":false,"version":1,"meleeWeapon":{"classInstance":"Knife","quantity":1},"rangedWeapon":{"classInstance":"HoldOutPistol","quantity":1},"armor":{"classInstance":"DressClothes","quantity":1},"upperUndergarment":{"classInstance":"PlainUndershirt","quantity":1},"lowerUndergarment":{"classInstance":"PlainBriefs","quantity":1},"accessory":null,"shield":{"classInstance":"BasicShield","quantity":1}},"transientEquipment":{"classInstance":"EquippedItems","neverSerialize":false,"version":1,"meleeWeapon":null,"rangedWeapon":null,"armor":null,"upperUndergarment":null,"lowerUndergarment":null,"accessory":null,"shield":null},"equippedPiercings":{"classInstance":"EquippedPiercings","neverSerialize":false,"version":1,"eyebrow":null,"nose":null,"tongue":null,"lip":null,"ear":null,"belly":null},"equippedImplants":{"classInstance":"EquippedImplants","neverSerialize":false,"version":1,"combatImplant":null,"utilityImplant":null},"equippedTent":{"classInstance":"HLTent","neverSerialize":false,"version":1,"hasDynamicProperties":true,"stackSize":1,"quantity":1,"hasUniqueName":false,"shortName":"HL Tent I","longName":"hardlight survival tent","description_internal":"a JoyCo-branded hardlight survival tent","tooltip":"While traditional tents are known for their reliability, hardlight tents have come into popularity in the last several centuries, owing to their durability, ability to vacuum-seal themselves to protect against hazards like toxic storms, and surprising lightness. Typical hardlight survival tents weigh no more than the lightest grenades.\n\nThis particular JoyCo model is lighter than most, manufactured for light survival use. Its small power core requires <b>three days</b> to replenish its charge via its miniaturized kinetic generator. To many, this is a major flaw. To explorers who might need to avoid one surprise downpour when they’re too far from town, it’s perfect.\n\n<b>This item is only usable in hazardous areas.</b>\n<b>Cooldown:</b> 3 days.","attackVerb":"","attackNoun":"","type":20,"basePrice":250,"level":1,"rarity":0,"customImage":"","customIcon":"","itemFlags":[],"attack":0,"baseDamage":{"classInstance":"TypeCollection","values":[0,0,0,0,0,0,0,0,0,0,0,0],"flags":[]},"defense":0,"shieldDefense":0,"shields":0,"sexiness":0,"resolve":0,"critBonus":0,"evasion":0,"fortification":0,"hardLightEquipped":false,"resistances":{"classInstance":"TypeCollection","values":[0,0,0,0,0,0,0,0,0,0,0,0],"flags":[]},"lustGain":0,"lustMin":0,"isUsable":true,"combatUsable":false,"targetsSelf":true,"requiresTarget":false,"dynamicProperties":null,"lastUseAt":-10000,"cooldown":4320}},"sexualPreferences":{"classInstance":"SexualPreferences","neverSerialize":false,"version":1,"sexPrefs":{}},"pregnancyData":[{"classInstance":"PregnancyData","neverSerialize":false,"version":1,"pregnancyIncubation":0,"pregnancyType":"","pregnancyQuantity":0,"pregnancyIncubationMulti":1,"pregnancyBellyRatingContribution":0},{"classInstance":"PregnancyData","neverSerialize":false,"version":1,"pregnancyIncubation":0,"pregnancyType":"","pregnancyQuantity":0,"pregnancyIncubationMulti":1,"pregnancyBellyRatingContribution":0},{"classInstance":"PregnancyData","neverSerialize":false,"version":1,"pregnancyIncubation":0,"pregnancyType":"","pregnancyQuantity":0,"pregnancyIncubationMulti":1,"pregnancyBellyRatingContribution":0},{"classInstance":"PregnancyData","neverSerialize":false,"version":1,"pregnancyIncubation":0,"pregnancyType":"","pregnancyQuantity":0,"pregnancyIncubationMulti":1,"pregnancyBellyRatingContribution":0}],"short":"Donut","long_internal":"You scrawny, yo.","originalRace":"human","a":"a ","isPlural":false,"fluidSimulate":false,"lustSimulate":false,"statusSimulate":false,"customDodge":"","customBlock":"","typesBought":[],"sellMarkup":1,"buyMarkdown":1,"keeperGreeting":"<i>“Hello and welcome to my shop. Take a gander and let me know if you see anything you like,”</i> a  says with a smile.\n","keeperBuy":"What would you like to buy?\n","keeperSell":"What would you like to sell?\n","Internal_physiqueRaw":3,"Internal_reflexesRaw":3,"Internal_aimRaw":3,"Internal_intelligenceRaw":4,"Internal_willpowerRaw":2,"Internal_libidoRaw":3,"Internal_taintRaw":0,"physiqueMod":0,"reflexesMod":0,"aimMod":0,"intelligenceMod":0,"willpowerMod":0,"libidoMod":0,"taintMod":0,"affinity":"intelligence","characterClass":0,"personality":17,"exhibitionismRaw":0,"HPRaw":15,"HPMod":0,"shieldsRaw":14,"lustRaw":2.3916666666666666,"lustMod":0,"energyRaw":100,"energyMod":0,"teaseLevel":0,"teaseXP":0,"baseHPResistances":{"classInstance":"TypeCollection","values":[0,0,0,0,0,0,0,0,0,0,0,0],"flags":[]},"baseShieldResistances":{"classInstance":"TypeCollection","values":[0,0,0,0,0,0,0,0,0,0,0,0],"flags":[]},"isLustImmune":false,"level":1,"credits":2500,"perkPoints":0,"femininity":30,"eyeType":0,"eyeColor":"blue","tallness":48,"thickness":20,"tone":50,"hairColor":"black","beardColor":"no","scaleColor":"blue","furColor":"black","hairLength":1,"hairStyle":"null","hairType":0,"beardType":0,"beardLength":0,"beardStyle":0,"skinType":0,"skinTone":"pale","skinAccent":"","skinFlags":[],"faceType":0,"faceFlags":[],"tongueType":0,"tongueFlags":[],"lipMod":0,"lipColor":"peach","earType":0,"earLength":0,"antennae":0,"antennaeType":0,"horns":0,"hornType":0,"hornLength":0,"armType":0,"armFlags":[],"gills":false,"wingCount":0,"wingType":0,"legType":0,"legCount":2,"legFlags":[16],"earFlags":[],"cumType":2,"genitalSpot":0,"crotchFlags":[],"tailType":0,"tailCount":0,"tailFlags":[],"tailCock":{"classInstance":"Cock","neverSerialize":false,"version":3,"cLengthRaw":5,"cLengthMod":0,"cThicknessRatioRaw":1,"cThicknessRatioMod":0,"cType":0,"cockColor":"pink","knotMultiplier":1,"flaccidMultiplier":0.25,"virgin":true,"flags":[],"piercing":null,"cocksock":null},"tailCunt":{"classInstance":"Vagina","neverSerialize":false,"version":3,"type":0,"hymen":true,"clits":1,"vaginaColor":"pink","wetnessRaw":1,"wetnessMod":0,"loosenessRaw":1,"loosenessMod":0,"minLooseness":1,"bonusCapacity":0,"shrinkCounter":0,"flags":[],"fullness":0,"piercing":null,"clitPiercing":null},"tailVenom":0,"tailRecharge":5,"tailCumType":2,"tailGirlCumType":5,"hipRatingRaw":1,"hipRatingMod":0,"buttRatingRaw":2,"buttRatingMod":0,"balls":2,"ballSizeRaw":1.5,"ballSizeMod":0,"Internal_ballFullness":51.36666666666667,"Internal_ballEfficiency":3,"refractoryRate":1,"scrotumTypeRaw":-1,"scrotumColorRaw":"","minutesSinceCum":41,"timesCum":0,"cockVirgin":true,"clitLength":0.5,"elasticity":1,"girlCumType":5,"vaginalVirgin":true,"nippleColor":"pink","nipplesPerBreast":1,"nippleLengthRatio":1,"nippleWidthRatio":1,"dickNippleMultiplier":3,"dickNippleType":0,"milkMultiplier":0,"milkType":0,"milkStorageMultiplier":1,"milkFullness":0,"milkRate":10,"analVirgin":true,"cumMultiplierRaw":1,"cumMultiplierMod":0,"girlCumMultiplierRaw":1,"girlCumMultiplierMod":0,"impregnationType":"","cumQualityRaw":1,"cumQualityMod":0,"pregnancyIncubationBonusFatherRaw":1,"pregnancyIncubationBonusFatherMod":0,"pregnancyMultiplierRaw":1,"pregnancyMultiplierMod":0,"fertilityRaw":1,"fertilityMod":0,"pregnancyIncubationBonusMotherRaw":1,"pregnancyIncubationBonusMotherMod":0,"bellyRatingRaw":0,"bellyRatingMod":0,"eggs":0,"fertilizedEggs":0,"isUniqueInFight":false,"uniqueName":null,"alreadyDefeated":false,"shieldDisplayName":"SHIELDS","hpDisplayName":"HP","btnTargetText":null,"buttonText":null,"energyDisplayName":"ENERGY","defaultCockIndex":0,"defaultVaginaIndex":-1,"defaultBreastRowIndex":0,"XPRaw":0,"unspentStatPoints":0,"unclaimedClassPerks":0,"unclaimedGenericPerks":0,"synthWombSetting":1,"inseminatorProEnabled":0,"inseminatorProVirility":1,"inseminatorProMaxCum":1,"inseminatorProRefractoryRate":1,"inseminatorProRefractoryRateOrig":1,"inseminatorProCumQ":0,"dildo":null,"forceCreatureRace":null}},"ships":{"SHIP":{"classInstance":"Casstech","neverSerialize":false,"version":6,"short":"Casstech Z14","long":"It’s been painted gold with black stripes. Looking at it again, you realize that you recognize this from some of your father’s holo-pics, at least the ones he’d let you see. This is the same ship that he took out on the Thirteenth Planet Rush, almost two centuries ago.","internalDescription":"","shieldDisplayName":"SHIELDS","hpDisplayName":"ARMOR","inventory":{"classInstance":"ShipInventory","neverSerialize":false,"version":1,"locationKey":"GLOBAL","storage":[],"decorationStorage":[],"storageLimits":{"0":10,"1":10,"2":10,"3":10,"4":10},"equippedItems":{"classInstance":"EquippedShipItems","neverSerialize":false,"version":3,"weapons":[{"classInstance":"MGun","quantity":1},{"classInstance":"LCannon","quantity":1}],"armor":{"classInstance":"ShipArmor","neverSerialize":false,"version":1,"hasDynamicProperties":true,"stackSize":1,"quantity":1,"hasUniqueName":false,"shortName":"Armor","longName":"armor plating","description_internal":"an armor plate","tooltip":"TBD","attackVerb":"shoot","attackNoun":"shot","type":5,"basePrice":5000,"level":1,"rarity":0,"customImage":"","customIcon":"","itemFlags":[],"attack":0,"baseDamage":{"classInstance":"TypeCollection","values":[0,0,0,0,0,0,0,0,0,0,0,0],"flags":[]},"defense":30,"shieldDefense":0,"shields":0,"sexiness":0,"resolve":0,"critBonus":0,"evasion":0,"fortification":0,"hardLightEquipped":false,"resistances":{"classInstance":"TypeCollection","values":[0,25,25,0,-50,0,0,0,0,0,0,0],"flags":[]},"lustGain":0,"lustMin":0,"isUsable":true,"combatUsable":false,"targetsSelf":true,"requiresTarget":false,"dynamicProperties":null},"shield":{"classInstance":"ShipShield","neverSerialize":false,"version":1,"hasDynamicProperties":true,"stackSize":1,"quantity":1,"hasUniqueName":false,"shortName":"ShieldGen","longName":"shield generator","description_internal":"a shield generator","tooltip":"TBD","attackVerb":"shoot","attackNoun":"shot","type":6,"basePrice":5000,"level":1,"rarity":0,"customImage":"","customIcon":"","itemFlags":[],"attack":0,"baseDamage":{"classInstance":"TypeCollection","values":[0,0,0,0,0,0,0,0,0,0,0,0],"flags":[]},"defense":0,"shieldDefense":20,"shields":3000,"sexiness":0,"resolve":0,"critBonus":0,"evasion":0,"fortification":0,"hardLightEquipped":false,"resistances":{"classInstance":"TypeCollection","values":[50,-50,-25,0,25,0,0,0,0,0,0,0],"flags":[]},"lustGain":0,"lustMin":0,"isUsable":true,"combatUsable":false,"targetsSelf":true,"requiresTarget":false,"dynamicProperties":null}}},"perks":[],"statusEffects":[],"keyItems":[],"captainDisplay":"UNKNOWN","modelDisplay":"Casstech Z14","factionDisplay":"UNKNOWN","gunCapacityRaw":2,"capacityRaw":4,"agilityRaw":20,"speedRaw":33,"powerRaw":25,"sensorsRaw":14,"systemsRaw":25,"baseHPResistances":{"classInstance":"TypeCollection","values":[0,0,0,0,0,0,0,0,0,0,0,0],"flags":[]},"baseShieldResistances":{"classInstance":"TypeCollection","values":[0,0,0,0,0,0,0,0,0,0,0,0],"flags":[]},"HPRaw":2000,"HPMod":2000,"shieldsRaw":3000,"energyRaw":200,"energyMod":0,"level":0,"holodeck":false,"isUniqueInFight":true,"ownerIndex":"PC","wardrobeSizeRaw":10,"equipmentSizeRaw":10,"consumableSizeRaw":10,"valuablesSizeRaw":10,"toysSizeRaw":10,"a":"the ","capitalA":"The ","customBlock":"<b>Placeholder</b>.","customDodge":"It’s too evasive!","isPlural":false,"credits":25000,"btnTargetText":"CT.Z14"}},"flags":{"artistOverrides":{"pc":"mannequin_auto","pc_nude":"mannequin_auto"},"pathOverrides":{},"customMannequin":{"pc":{"femininity":0,"tone":0,"thickness":0,"hipRating":0,"buttRating":0,"bellyRating":0,"breasts0":2,"breastRating0":0,"breasts1":0,"breastRating1":0,"breasts2":0,"breastRating2":0,"breastRatingMax":100},"pc_nude":{"femininity":0,"tone":0,"thickness":0,"hipRating":0,"buttRating":0,"bellyRating":0,"breasts0":2,"breastRating0":0,"breasts1":0,"breastRating1":0,"breasts2":0,"breastRating2":0,"breastRatingMax":100}},"PC_UPBRINGING":0,"PREV_LOCATION":"CASSTECH.BOARDINGRAMP","PREV_SHIP_LOCATION":"KALAS.INTRO_SPACE_PLACE.INTRO_SPACE","RIVALCONFIGURED":1,"BIANCA_PLANET":"mhen’ga","BIANCA_LAST_DAY_MOVED":1,"MAJIN_LAST_FLIGHT":1,"MAJIN_SHIZZY_LOC":2,"MAJIN_LAST_SHIFT":66,"LUCA_ADDICTION":0,"LUCA_SUBMISSION":0,"KIRO_TRUST":40,"STEPH_FIRST_WATCHED":1802,"STEPH_DEFAULT_UNLOCKED":"STEPH_NYAN","TIMES_HAD_SEX_WITH_DELILAH_IN_SOME_WAY":0,"NYKKE_VERSION":2,"ENCOUNTERS_DISABLED":1},"inactivePlayerOwnedShips":[],"mailState":{"classInstance":"MailStateStorage","neverSerialize":false,"version":1,"mails":{"sorryIMissedTheFuneral":{"classInstance":"MailStateStorageEntry","neverSerialize":false,"version":1,"UnlockedTimestamp":1802,"ContentCache":"<i>You recognize the company email of Anyxine Rhenesuune, the daughter of one of your father’s leithan business partners and a friend from your pre-teen years, though she <b>did</b> become kind of a bully later on.</i><br><br>Hey, Donut, long time no talk. My dad finally told me you switched emails. Guess I was screaming into the void for a couple weeks there. Anyway. I’m real sorry I couldn’t make the funeral. I’m just getting set up in a new office over Uveto, made planetary director finally. Shitty excuse, but I just couldn’t get away. :{<br><br>You know how much your old man meant to me and the whole family. Still kind of hard to believe Uncle Vic’s gone. You’ve probably heard this like fifty times already, but he really was my hero growing up.<br><br>Look, I know I was kind of a dick the last time we hung out but you’re still my friend. I hope you’re doing okay. Sending you big comfy lizard hugs! <3<br><br>P.S. There’s a Steele Tech science outpost here, and the nerds are saying you’re not being bumped up to E-suite yet? Any idea why?<br><br>If you need a job or something, I’m sure I can find a janitor’s bucket or something for you :)<br><br>-Anyx","ToCache":"Donut Steele","ToAddressCache":"Donut_Steele@SteeleTech.corp","Folder":0}}},"childState":{"classInstance":"ChildStateStorage","neverSerialize":false,"version":2,"children":[]},"codexState":{"classInstance":"CodexStateStorage","neverSerialize":false,"version":1,"unlockedEntries":["Ausar","Dzaan","Galotians","Gryvain","Humans","Kaithrit","Kui-Tan","Ovir","Saurmorians","Thraggen","Aegis","J’ejune","JoyCo","KihaCorp","Nova Securities","Pyrite","Reaper","RhenWorld","Steele Tech","Xenogen","Black Void","J.A.F.","T.S.C.","U.G.C.","Soak","AI Systems","Item Mechanics","Taint","Bull’s Strength","Dildo Snakes","Dragon’s Hoard"],"viewedEntries":[]},"mapState":{"classInstance":"MapStateStorage","neverSerialize":false,"version":1,"sector":{"Systems":{"KALAS":{"TAVROS":{"NURSERYSTAIRS2F":0,"NURSERYC6":0,"NURSERYE8":0,"NURSERYE6":0,"NURSERYE4":0,"NURSERYG8":0,"NURSERYG6":0,"NURSERYG4":0,"NURSERYI6":0,"NURSERYSERA":0,"TAVROS LIFT":0,"TAVROS HANGAR":0},"FIRST-14":{"FIRST R20":0,"FIRST R18":0,"FIRST T20":0,"FIRST V22":0,"FIRST V20":0,"FIRST X24":0,"FIRST X22":0,"FIRST X20":0}}},"Ships":{}}},"locationStorage":{"classInstance":"LocationStorage","neverSerialize":false,"version":3,"locations":{}},"timestampedEventBuffer":[],"eventQueue":[],"currentLocation":"KALAS.FIRST-14.FIRST X24","shipLocation":"KALAS.FIRST-14.FIRST X24","inSceneBlockSaving":false,"gameOverEvent":false,"statStorage":{"movement":{"time travelled":1}}}';
                raw = raw.replaceAll('\n', ''); // No clue how this doesn't explode when loading a save normally

                const file = new File([raw], 'save.json', { type: 'application/json' });
                const data = new DataTransfer();
                data.items.add(file);

                window.showSaveLoad();
                await delay(500);

                const fileInput = document.getElementById('fileToLoad');
                fileInput.files = data.files;

                await delay(500);
                window.pressButton(3);
                await delay(500);

                fileInput.dispatchEvent(new Event('change', { 'bubbles': true }));

                await delay(5000);

                // #endregion


                const pc = window.pc;


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
                    StatusEffectShades: getGlobalsByPrefix('STATUS_'),
                    TailGenital: getGlobalsByPrefix('TAIL_GENITAL_'),
                    Upbringing: getGlobalsByPrefix('UPBRINGING_'),
                    ValidColors: {},
                    ValidFlags: {},
                    ValidTypes: {}
                };


                // #region Beard Styles

                const beardStyles = [];

                for (var i = 0; i < 20; i++) {
                    pc.beardStyle = i;

                    beardStyles.push({
                        name: pc.beardStyles(),
                        value: i
                    });
                }

                global.BeardStyle = beardStyles;

                // #endregion


                // #region PantyData

                const pantyData = {};
                const pantyDataArr = window.PantyData.toJSON();
                for (let i = 0; i < pantyDataArr.length; i++) {
                    pantyData[pantyDataArr[i][0]] = pantyDataArr[i][1].panty;
                }

                // #endregion


                // #region Colors

                const globalSkinColors = window.GLOBAL.SKIN_COLORS;

                var validSkinColors = [];

                for (const skinColorType in globalSkinColors) {

                    // 0: the actual color value
                    // 1: some kind of pretty print description

                    const colorArrays = window.GLOBAL.SKIN_COLORS[skinColorType];

                    if (colorArrays.length) {
                        colorArrays.forEach(colorArray => {
                            validSkinColors.push(colorArray[0]);
                        });
                    }

                }

                validSkinColors = validSkinColors
                    .filter((color, index, self) => self.findIndex(color2 => (color2 === color)) === index)
                    .sort((l, r) => l.localeCompare(r));

                global.ValidColors.Skin = validSkinColors;

                // #endregion


                const version = window.version;


                return { global, pantyData, version };

            }
            catch (e) {
                return { error: e.toString() };
            }
        });

        const evalGameEnd = Date.now();
        util.printOperationTime('game instance', evalGameStart, evalGameEnd, 'evaluated ');
    }
    catch (err) {
        console.log(err);
        await browser.close();
        return 1;
    }



    if (evalResult.error) {
        console.log(evalResult.error);
        await browser.close();
        return 1;
    }


    const obj = evalResult.global;
    const pantyData = evalResult.pantyData;
    const version = {
        game: evalResult.version
    };


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


    // #region Diffs

    if (appConfig.runDiffs) {

        console.log('\ngetting diffs');
        const diffsStart = Date.now();

        (function () {
            var diffPath = path.join(appConfig.runDiffsPath, version);

            if (!fs.existsSync(diffPath)) {
                fs.mkdirSync(diffPath);
            }

            for (let i = 0; i < contents.length; i++) {

                const urlRx = /[\w]+.[\w]+.js/g;

                var url = urls[i];
                var content = contents[i];

                var fileNameCurr = url.match(urlRx)[0];
                var fileParts = fileNameCurr.split('.');
                fileNameCurr = fileParts[0] + '.current.' + fileParts[2];

                var filePathCurr = path.join(diffPath, fileNameCurr);
                var filePathPrev = path.join(diffPath, fileNameCurr.replace('current', 'previous'));

                if (!fs.existsSync(filePathPrev)) {
                    fs.writeFileSync(filePathPrev, util.formatToDiff(content));
                }
                else if (fs.existsSync(filePathCurr)) {
                    fs.writeFileSync(filePathPrev, fs.readFileSync(filePathCurr, 'utf-8'));
                }

                fs.writeFileSync(filePathCurr, util.formatToDiff(content));
            }
        })();

        const diffsEnd = Date.now();
        util.printOperationTime('diffs', diffsStart, diffsEnd);
    }

    // #endregion


    // #region Valid Body Flags/Types


    /**
    * Get GLOBAL object of type by name
    * @param {string} type
    * @param {string} name
    */
    function getGlobalByName(type, name) {
        const found = obj[type].find(o => o.name.toLocaleLowerCase() == name.replace('_', ' ').toLocaleLowerCase());
        return {
            name: found.name,
            value: found.value
        };
    }

    /**
    * Get valid body x by type, using regex and boolean callback
    * @param {string} type
    * @param {RegExp} regex
    * @param {Function} callback
    */
    function getValidBodyParts(type, regex, callback) {
        var validArray = [];

        util.execRegexOnContents(regex, (match, groupIndex, matches) => {
            if (callback(match, groupIndex, matches)) {
                validArray.push(getGlobalByName(type, match));
            }
        });

        validArray = util.formatNameValueArray(validArray);

        return validArray;
    }


    // #region Flags


    // The idea here is, if the game adds it or checks for it, it's valid.


    /**
    * Get accurate VALID_<BODYPART>_FLAGS using regex
    * @param {RegExp} regex
    */
    function getValidBodyFlagsDefault(regex) {
        return getValidBodyParts('BodyFlag', regex, (_, groupIndex) => {
            return groupIndex == 2;
        });
    }

    /**
    * Get accurate VALID_<BODYPART>_FLAGS for arrays using regex
    * @param {RegExp} regex
    */
    function getValidBodyFlagsForArray(regex) {
        return getValidBodyParts('BodyFlag', regex, (_, groupIndex, matches) => {
            return (!matches[5] && groupIndex == 3) || (matches[5] && groupIndex == 5); // 3 => simple check, 5 => array check
        });
    }

    /**
    * Get a regex that can be used to check for valid body flags
    * @param {string} name
    */
    function getFlagCheckRegex(name) {
        return new RegExp(`\\.(add|has)${name}Flag\\(GLOBAL\\.FLAG_([\\S ][^)]+)\\)*`, 'g');
    }

    /**
    * Get a regex that can be used to check for valid body flags that are called on arrays
    * @param {string} name
    * @param {string} arrayName
    */
    function getFlagCheckForArrayRegex(simpleName, arrayName) {
        // Here two checks need to be done. One for char.(add|has)(), another for the array access array[x].(add|has)()

        const charCheck = `\\.(add|has)${simpleName}Flag\\(GLOBAL\\.FLAG_([\\S ][^),]+)\\)*`;
        const arrayCheck = `\\.${arrayName}\\[[\\S]\\]\\.(add|has)Flag\\(GLOBAL.FLAG_([\\S ][^)]+)\\)*`;

        return new RegExp(`(${charCheck}|${arrayCheck})`, 'g');
    }


    console.log('\ngetting valid body flags');
    const validBodyFlagsStart = Date.now();


    // Simple add|has checks
    ['Areola', 'Arm', 'Crotch', 'Ear', 'Face', 'Leg', 'Skin', 'Tail', 'Tongue'].forEach(name => {
        obj.ValidFlags[name] = getValidBodyFlagsDefault(getFlagCheckRegex(name));
    });

    // Array add|has checks
    obj.ValidFlags.Penis = getValidBodyFlagsForArray(getFlagCheckForArrayRegex('Cock', 'cocks'));
    obj.ValidFlags.Vagina = getValidBodyFlagsForArray(getFlagCheckForArrayRegex('Vagina', 'vaginas'));

    // Other
    obj.ValidFlags.Butt = getValidBodyFlagsDefault(/ass\.(add|has)Flag\(GLOBAL\.FLAG_([\S][^)]+)\)*/g);


    const validBodyFlagsEnd = Date.now();
    util.printOperationTime('valid body flags', validBodyFlagsStart, validBodyFlagsEnd);

    // #endregion


    // #region Types


    // The idea here is, if the game assigns it or checks for it, it's valid.


    /**
    * Get accurate VALID_<BODYPART>_TYPES using regex
    * @param {RegExp} regex
    */
    function getValidBodyTypesDefault(regex) {
        return getValidBodyParts('BodyType', regex, (_, groupIndex) => {
            return groupIndex == 2;
        });
    }

    /**
    * Get accurate VALID_<BODYPART>_TYPES for arrays using regex
    * @param {RegExp} regex
    */
    function getValidBodyTypesForArray(regex) {
        return getValidBodyParts('BodyType', regex, (_, groupIndex, matches) => {
            return ((!matches[4] && groupIndex == 2) || (matches[4] && groupIndex == 4)); // 2 => simple check, 4 => array check
        });
    }

    // After fiddling with this shit for almost an hour it turns out it wasn't working because the spaces around the equal sign were getting removed, silly me

    /**
    * Get a regex that can be used to check for valid body part types
    * @param {string} name
    */
    function getTypeCheckRegex(name) {
        return new RegExp(`\.${name}Type(!|)={1,3}GLOBAL\\.TYPE_([\\w]+)*`, 'g');
    }

    /**
    * Get a regex that can be used to check for valid body part types that are called on arrays
    * @param {string} name
    * @param {string} arrayName
    * @param {string} keyName
    */
    function getTypeCheckForArrayRegex(simpleName, arrayName, keyName = 'type') {
        // Again, two checks need to be done. One for char.hasXType(), another for the array access array[x].type==

        const charCheck = `\\.has${simpleName}Type\\(GLOBAL\\.TYPE_([\\S ][^),]+)\\)*`;
        const arrayCheck = `\\.${arrayName}\\[[\\S]\\]\\.${keyName}(!|)={1,3}GLOBAL\\.TYPE_([\\w]+)`;

        return new RegExp(`(${charCheck}|${arrayCheck})`, 'g');
    }


    console.log('\ngetting valid body types');
    const validBodyTypesStart = Date.now();


    // Simple assignment|equality checks
    ['Antennae', 'Arm', 'Ear', 'Eye', 'Face', 'Horn', 'Leg', 'Tail', 'Tongue', 'Wing'].forEach(name => {
        obj.ValidTypes[name] = getValidBodyTypesDefault(getTypeCheckRegex(name.toLocaleLowerCase()));
    });

    // Array assignment|equality checks
    obj.ValidTypes.Penis = getValidBodyTypesForArray(getTypeCheckForArrayRegex('Cock', 'cocks', 'cType'));
    obj.ValidTypes.Vagina = getValidBodyTypesForArray(getTypeCheckForArrayRegex('Vagina', 'vaginas'));


    const validBodyTypesEnd = Date.now();
    util.printOperationTime('valid body types', validBodyTypesStart, validBodyTypesEnd);

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

            m = content.match(/flags\["([\S ][^"]*)"\]/g);
            if (m && m.length > 0) {
                gameFlags = gameFlags.concat(m.map((value) => value.substring(7, value.length - 2)));
            }

            m = content.match(/IncrementFlag\("([\S ][^"]*)"\)/g);
            if (m && m.length > 0) {
                gameFlags = gameFlags.concat(m.map((value) => value.substring(15, value.length - 2)));
            }
        }
    })();


    // Format
    gameFlags = gameFlags.filter((value, index, self) => self.indexOf(value) === index).sort();

    // Clean
    ['artistOverrides', 'pathOverrides', 'customMannequin', 'includes', 'indexOf', 'length', 'map', 'push', 'splice'].forEach(name => {
        const index = gameFlags.findIndex(f => f === name);
        if (index > -1) {
            gameFlags.splice(index, 1);
        }
    });

    // Convert to dictionary, set all values to null
    gameFlags = gameFlags.reduce((acc, curr) => (acc[curr] = null, acc), {});

    const gameFlagsEnd = Date.now();
    util.printOperationTime('game flags', gameFlagsStart, gameFlagsEnd);

    // #endregion


    // #region StorageClass


    // #region Class

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

        /**
        * Parse 'StorageClass' values using the default implementation
        * @param {string} text
        */
        parseFromTextDefault(text) {
            const texts = text.split('"');

            for (var i = 0; i < texts.length; i++) {
                text = text.replace(`${i === 0 ? '' : '"'}${texts[i]}"`, '');
            }

            const args = text.split(',');

            this.storageName = texts[0] || '';

            this.value1 = +args[1] || 0;
            this.value2 = +args[2] || 0;
            this.value3 = +args[3] || 0;
            this.value4 = +args[4] || 0;

            this.tooltip = texts[2] || '';
        }

        /**
        * Parse 'StorageClass' status effects
        * @param {string} text
        */
        parseStatusEffect(text) {
            const texts = text.split('"');

            this.parseFromTextDefault(text);

            for (var i = 0; i < texts.length; i++) {
                text = text.replace(`${i === 0 ? '' : '"'}${texts[i]}"`, '');
            }

            const args = text.split(',');

            this.tooltip = texts[4] || '';

            this.hidden = args[5] ? args[5] === '!0' : true;
            this.iconName = texts[2] || '';
            this.combatOnly = args[8] ? args[8] === '!0' : false;
            this.minutesLeft = +args[9] || 0;

            // Icon Shade
            // Some status effects have a shade like '12030916' or similar, which may be a remnant from the old version.
            const iconShadeRaw = args[10];
            if (iconShadeRaw && !+iconShadeRaw) {
                if (iconShadeRaw.startsWith('"var')) { // already in var() format
                    this.iconShade = iconShadeRaw.replaceAll('"', '') + ')';
                }
                else if (iconShadeRaw.startsWith('GLOBAL')) { // global.status_ format
                    const shadeName = args[10].replace('GLOBAL.STATUS_', '').split('_')
                        .map(str => str.slice(0, 1).toUpperCase() + str.slice(1).toLowerCase())
                        .join(' ');

                    this.iconShade = obj.StatusEffectShades.find(s => s.name === shadeName).value;
                }
            }
        }
    }

    /**
    * Parse game data into a 'StorageClass' array using the default implementation
    * @param {RegExp} regex
    * @param {boolean} skipFormat
    * @param {Function} func
    * @returns {Array<StorageClass>}
    */
    function getStorageClassData(regex, skipFormat = false, func = null) {
        var storageArray = [];

        util.execRegexOnContents(regex, (match, groupIndex) => {
            if (groupIndex == 2) {
                if (!func) {
                    const storage = new StorageClass();
                    storage.parseFromTextDefault(match);
                    storageArray.push(storage);
                }
                else {
                    storageArray.push(func(match));
                }
            }
        });

        if (!skipFormat) {
            storageArray = util.formatStorageClassArray(storageArray);
        }

        return storageArray;
    }

    // #endregion


    // #region Perks

    console.log('\ngetting perks');
    const perksStart = Date.now();

    const perks = getStorageClassData(/\.(create|has|remove)Perk\("([\S ][^)]+)\)*/g);

    const perksEnd = Date.now();
    util.printOperationTime('perks', perksStart, perksEnd);

    // #endregion


    // #region Status Effects

    console.log('\ngetting status effects');
    const statusEffectsStart = Date.now();

    var statusEffects = getStorageClassData(/\.(create|has|remove)StatusEffect\("([\S ][^)]+)\)/g, false, match => {
        const statusEffect = new StorageClass();
        statusEffect.parseStatusEffect(match);
        return statusEffect;
    });

    const statusEffectsEnd = Date.now();
    util.printOperationTime('status effects', statusEffectsStart, statusEffectsEnd);

    // #endregion


    // #region Key Items

    console.log('\ngetting key items');
    const keyItemsStart = Date.now();

    var keyitems = getStorageClassData(/\.(create|has|remove)KeyItem\("([\S ][^)]+)\)*/g, true);

    const panties = [];

    util.execRegexOnContents(/\.createKeyItem\((PantyData\.get\("([\S ][^")]+)"\)[^)][\S ][^)]+)\)*/g, (match, groupIndex, matches) => {
        if (groupIndex == 2) {
            const panty = new StorageClass();

            // Handle tooltip
            if (matches[0].indexOf(',') > -1) {
                const texts = matches[1].split('"');
                panty.tooltip = texts[3];
            }

            panty.storageName = pantyData[match];

            panties.push(panty);
        }
    });

    keyitems = keyitems.concat(panties);

    keyitems = util.formatStorageClassArray(keyitems);

    const keyItemsEnd = Date.now();
    util.printOperationTime('key items', keyItemsStart, keyItemsEnd);

    // #endregion


    // #endregion


    // #region Codex

    // TODO: Codex is not as shallow as just text

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


    // #region Hair Styles

    console.log('\ngetting hair styles');
    const hairStylesStart = Date.now();


    var hairStyles = [];

    util.execRegexOnContents(/\.push\(\["([\S ][^)]+)[0-9]+\]\)/g, (match, groupIndex) => {
        if (groupIndex == 1) {

            const texts = match.split('"');

            const hairName = texts[0];
            const hairValue = texts[2];

            hairStyles.push({
                name: hairName,
                value: hairValue
            });

        }
    }, ['sourceMappingURL=content_tavros']);

    // Default hair style
    hairStyles.push({
        name: 'Unstyled',
        value: 'null'
    });

    hairStyles = hairStyles.sort((l, r) => l.value.localeCompare(r.value));

    obj.HairStyle = hairStyles;


    const hairStylesEnd = Date.now();
    util.printOperationTime('hair styles', hairStylesStart, hairStylesEnd);

    // #endregion


    // #region Colors

    // haha, yet again another system that relies on string comparisons that aren't defined anywhere (except for skin)

    /**
    * Get valid colors, using regex and boolean callback
    * @param {RegExp} regex
    * @param {Function} callback
    */
    function getValidColors(regex, callback) {

        var validColors = [];

        util.execRegexOnContents(regex, (match, groupIndex, matches) => {
            if (callback(match, groupIndex, matches)) {
                validColors.push(match);
            }
        });

        validColors = validColors
            .filter((color, index, self) => self.findIndex(color2 => (color2 === color)) === index)
            .sort((l, r) => l.localeCompare(r));

        return validColors;

    }

    /**
    * Get valid colors using the default implementation
    * @param {string} name
    * @param {string} type
    */
    function getValidColorsDefault(name, type) {
        return getValidColors(getColorCheckRegex(name, type), (_, groupIndex, matches) => {
            return (!matches[4] && groupIndex == 3) || (matches[4] && groupIndex == 4);
        });
    }

    /**
    * Get a regex that can be used to check for valid colors
    * @param {string} name
    * @param {string} type
    */
    function getColorCheckRegex(name, type = 'Color') {
        return new RegExp(`(\\.${name}${type}(!|)={1,3}"([\\S ][^"),]+)"|"([\\S ][^"),]+)"(!|)={1,3}[\\w]+\\.${name}${type})`, 'g');
    }


    console.log('\ngetting colors');
    const colorsStart = Date.now();


    ['Hair', 'Lip', 'Eye', 'Fur', 'Scale', 'Nipple', 'Penis', 'Vagina'].forEach(name => {
        obj.ValidColors[name] = getValidColorsDefault(name.toLocaleLowerCase());
    });

    obj.ValidColors.Penis = getValidColorsDefault('cock');

    obj.ValidColors.SkinTone = getValidColorsDefault('skin', 'Tone');


    const colorsEnd = Date.now();
    util.printOperationTime('colors', colorsStart, colorsEnd);

    // #endregion


    // #region Misc


    console.log('\ngetting misc');
    const miscStart = Date.now();


    // #region Beard Style

    for (var i = 0; i < obj.BeardStyle.length; i++) {
        obj.BeardStyle[i].name = util.capitalize(obj.BeardStyle[i].name);
    }

    obj.BeardStyle = util.formatNameValueArrayByName(obj.BeardStyle);


    // #endregion


    // #region Manual clean


    // #region Colors

    ['FIXME', 'NOT SET', 'PLACEHOLDER', 'no', 'none', 'unknown'].forEach(name => {
        for (const colorType in obj.ValidColors) {
            const colors = obj.ValidColors[colorType];
            const index = colors.findIndex(c => c === name);
            if (index > -1) {
                colors.splice(index, 1);
            }
        }
    });

    // #endregion


    // #region Key Items

    [''].forEach(name => {
        const index = keyitems.findIndex(k => k.storageName === name);
        if (index > -1) {
            keyitems.splice(index, 1);
        }
    });

    // #endregion


    // #endregion


    // #region Counts

    const objLength = o => Object.keys(o).length;

    const nestedObjLength = (root, key,) => {

        const lengths = {};

        Object.keys(root[key]).forEach(k => {
            const items = root[key][k];

            const length = items.length || objLength(items);

            lengths[k] = length;
        });

        return lengths;

    };

    const arrLength = a => a.length;


    const counts = {};


    // Global
    counts.Global = {};

    Object.keys(obj).forEach(k => {
        if (!k.toLocaleLowerCase().startsWith('valid')) {
            counts.Global[k] = objLength(obj[k]);
        }
    });

    counts.Global.ValidFlags = nestedObjLength(obj, 'ValidFlags');
    counts.Global.ValidTypes = nestedObjLength(obj, 'ValidTypes');
    counts.Global.ValidColors = nestedObjLength(obj, 'ValidColors');


    // Codex
    counts.Codex = objLength(codexEntries);

    // Game Flags
    counts.GameFlags = objLength(gameFlags);

    // Key Items
    counts.KeyItems = arrLength(keyitems);

    // Perks
    counts.Perks = arrLength(perks);

    // Status Effects
    counts.StatusEffects = arrLength(statusEffects);


    // #endregion


    const miscEnd = Date.now();
    util.printOperationTime('misc', miscStart, miscEnd);


    // #endregion


    console.log('\nwriting to disk');
    const writeStart = Date.now();

    fs.writeFileSync('../data/global.js', util.formatToFile('Globals', obj));
    fs.writeFileSync('../data/flags.js', util.formatToFile('Flags', gameFlags));
    fs.writeFileSync('../data/perks.js', util.formatToFile('Perks', perks));
    fs.writeFileSync('../data/status.js', util.formatToFile('StatusEffects', statusEffects));
    fs.writeFileSync('../data/codex.js', util.formatToFile('CodexEntries', codexEntries));
    fs.writeFileSync('../data/keyitems.js', util.formatToFile('KeyItems', keyitems));
    fs.writeFileSync('../data/counts.js', util.formatToFile('Counts', counts));
    fs.writeFileSync('version.json', util.formatToJSON(version));

    const writeEnd = Date.now();
    util.printOperationTime('written', writeStart, writeEnd, 'files ');


    await browser.close();


    var operationEnd = Date.now();
    console.log('\nall operations completed, total time: ' + util.getElapsedTime(operationStart, operationEnd));
})();