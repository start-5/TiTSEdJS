/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable sort-keys */


const key_char = 'selectedCharacter().obj';
const key_butt = key_char + '.ass';
const key_tailP = key_char + '.tailCock';
const key_tailV = key_char + '.tailCunt';

const key_save = 'save()';
const key_flags = key_save + '.flags';
const key_pc = key_save + '.characters.PC';
const key_instance = key_save + '.gameInstanceInfo';


const display = {

    getGame: () => {
        return new Tab([
            new Row([
                new Group('Internal', [
                    //new TextField(flags, 'PC_EMAIL_ADDRESS', 'E-Mail', null, 'emailChanged'), TODO: This doesn't work at the moment
                    new TextField(key_instance, 'note', 'Note'),
                    new IntegerField(key_save, 'days', 'Days', { suffixText: 'days' }),
                    new IntegerField(key_save, 'hours', 'Hours', { suffixText: 'hours', max: 23 }),
                    new IntegerField(key_save, 'minutes', 'Minutes', { suffixText: 'minutes', max: 59 }),
                ]),
                new Group('Game Settings', [
                    new SwitchField(key_save, 'easyMode', 'Easy Mode'),
                    new SwitchField(key_save, 'sillyMode', 'Silly Mode'),
                    new SwitchField(key_save, 'debugMode', 'Debug Mode'),
                    new SwitchField(key_instance, 'miniMapVisible', 'Minimap visible'),
                    new SwitchField(key_instance, 'minimapRolledOut', 'Minimap rolled out'),
                    new SwitchField(key_instance, 'hideNavControls', 'Hide nav controls'),
                    new SwitchField(key_instance, 'bustRolledOut', 'Bust rolled out'),
                    new SwitchField(key_instance, 'dateTimeVisible', 'Date and Time visible')
                ])
            ])
        ]).build();
    },

    getStats: () => {
        return new Tab([
            new Row([
                new Group('General', [
                    new TextField(key_char, 'short', 'Name', { koChanged: 'nameChanged' }),
                    new IntegerField(key_char, 'credits', 'Credits'),
                    new IntegerField(key_char, 'personality', 'Personality', { max: 100 }),
                    new IntegerField(key_char, 'exhibitionismRaw', 'Exhibitionism', { max: 100 })
                ]),
                new Group('Advancement', [
                    new IntegerField(key_char, 'level', 'Level', { max: 12 }),
                    new IntegerField(key_pc, 'XPRaw', 'XP', { pcOnly: true }),
                    new IntegerField(key_pc, 'unspentStatPoints', 'Stat Points', { pcOnly: true })
                ]),
                new Group('Appearance', [
                    new IntegerField(key_char, 'tallness', 'Height', { suffixText: 'inches' }),
                    new IntegerField(key_char, 'thickness', 'Thickness', { max: 100 }),
                    new IntegerField(key_char, 'tone', 'Tone', { max: 100 }),
                    new IntegerField(key_char, 'femininity', 'Femininity', { max: 100 })
                ]),
            ]),
            new Row([
                new Group('Core', [
                    new NestedGroup([
                        new FloatField(key_char, 'Internal_aimRaw', 'Aim Raw'),
                        new IntegerField(key_char, 'aimMod', 'Aim Modifier')
                    ]),
                    new NestedGroup([
                        new FloatField(key_char, 'Internal_intelligenceRaw', 'Intelligence Raw'),
                        new IntegerField(key_char, 'intelligenceMod', 'Intelligence Modifier')
                    ]),
                    new NestedGroup([
                        new FloatField(key_char, 'Internal_physiqueRaw', 'Physique Raw'),
                        new IntegerField(key_char, 'physiqueMod', 'Physique Modifier')
                    ]),
                    new NestedGroup([
                        new FloatField(key_char, 'Internal_reflexesRaw', 'Reflexes Raw'),
                        new IntegerField(key_char, 'reflexesMod', 'Reflexes Modifier')
                    ]),
                    new NestedGroup([
                        new FloatField(key_char, 'Internal_willpowerRaw', 'Willpower Raw'),
                        new IntegerField(key_char, 'willpowerMod', 'Willpower Modifier')
                    ]),
                    new NestedGroup([
                        new FloatField(key_char, 'Internal_libidoRaw', 'Libido Raw'),
                        new IntegerField(key_char, 'libidoMod', 'Libido Modifier')
                    ]),
                    new NestedGroup([
                        new FloatField(key_char, 'Internal_taintRaw', 'Taint Raw', { max: 100 }),
                        new IntegerField(key_char, 'taintMod', 'Taint Modifier', { max: 100 })
                    ])
                ]),
                new Group('Combat', [
                    new NestedGroup([
                        new IntegerField(key_char, 'HPRaw', 'HP Raw'),
                        new IntegerField(key_char, 'HPMod', 'HP Modifier')
                    ]),
                    new NestedGroup([
                        new IntegerField(key_char, 'energyRaw', 'Energy Raw'),
                        new IntegerField(key_char, 'energyMod', 'Energy Modifier')
                    ]),
                    new NestedGroup([
                        new IntegerField(key_char, 'lustRaw', 'Lust Raw'),
                        new IntegerField(key_char, 'lustMod', 'Lust Modifier')
                    ]),
                    new IntegerField(key_char, 'shieldsRaw', 'Shields Raw')
                ]),
                new Group('Pregnancy', [
                    new NestedGroup([
                        new IntegerField(key_char, 'pregnancyMultiplierRaw', 'Quantity Multiplier Raw'),
                        new IntegerField(key_char, 'pregnancyMultiplierMod', 'Quantity Multiplier Modifer')
                    ]),
                    new NestedGroup([
                        new IntegerField(key_char, 'pregnancyIncubationBonusMotherRaw', 'Incubation Mother Raw'),
                        new IntegerField(key_char, 'pregnancyIncubationBonusMotherMod', 'Incubation Mother Mod')
                    ]),
                    new NestedGroup([
                        new IntegerField(key_char, 'pregnancyIncubationBonusFatherRaw', 'Incubation Father Raw'),
                        new IntegerField(key_char, 'pregnancyIncubationBonusFatherMod', 'Incubation Father Mod')
                    ])
                ])
            ]),
        ]).build();
    },

    getHead: () => {
        return new Tab([
            new Row([
                new Group('Head', [
                    new SelectField(key_char, 'antennaeType', 'ValidTypes.Antennae', 'Antennae Type'),
                    new IntegerField(key_char, 'antennae', 'Antennae Count'),
                    new SelectField(key_char, 'hornType', 'ValidTypes.Horn', 'Horn Type'),
                    new IntegerField(key_char, 'horns', 'Horn Count'),
                    new FloatField(key_char, 'hornLength', 'Horn Length', { suffixText: 'inches' })
                ]),
                new Group('Hair', [
                    new SelectField(key_char, 'hairType', 'HairType', 'Hair Type'),
                    new FloatField(key_char, 'hairLength', 'Hair Length', { suffixText: 'inches' }),
                    new TextField(key_char, 'hairColor', 'Hair Color', { typeaheadSource: 'ValidColors.Hair' }),
                    new SelectField(key_char, 'hairStyle', 'HairStyle', 'Hair Style'),
                    new FloatField(key_char, 'beardLength', 'Beard Length', { suffixText: 'inches' }),
                    new SelectField(key_char, 'beardType', 'HairType', 'Beard Type'),
                    new SelectField(key_char, 'beardStyle', 'BeardStyle', 'Beard Style')
                ])
            ]),
            new Row([
                new Group('Face', [
                    new SelectField(key_char, 'faceType', 'ValidTypes.Face', 'Face Type'),
                    new FlagField(key_char, 'faceFlags', 'ValidFlags.Face', 'Face Flags')
                ]),
                new Group('Tongue', [
                    new SelectField(key_char, 'tongueType', 'ValidTypes.Tongue', 'Tongue Type'),
                    new FlagField(key_char, 'tongueFlags', 'ValidFlags.Tongue', 'Tongue Flags')
                ])
            ]),
            new Row([
                new Group('Lips', [
                    new TextField(key_char, 'lipColor', 'Lip Color', { typeaheadSource: 'ValidColors.Lip' }),
                    new IntegerField(key_char, 'lipMod', 'Lip Modifier')
                ]),
                new Group('Ears', [
                    new SelectField(key_char, 'earType', 'ValidTypes.Ear', 'Ear Type'),
                    new FloatField(key_char, 'earLength', 'Ear Length', { suffixText: 'inches' }),
                    new FlagField(key_char, 'earFlags', 'ValidFlags.Ear', 'Ear Flags'),
                ]),
                new Group('Eyes', [
                    new SelectField(key_char, 'eyeType', 'ValidTypes.Eye', 'Eye Type'),
                    new TextField(key_char, 'eyeColor', 'Eye Color', { typeaheadSource: 'ValidColors.Eye' })
                ])
            ])
        ]).build();
    },

    getBody: () => {
        return new Tab([
            new Row([
                new Group('General', [
                    new SwitchField(key_char, 'gills', 'Has Gills'),
                    new FloatField(key_char, 'elasticity', 'Elasticity'),
                    new SelectField(key_char, 'genitalSpot', 'GenitalSpot', 'Genital Spot'),
                    new NestedGroup([
                        new IntegerField(key_char, 'hipRatingRaw', 'Hip Rating Raw'),
                        new IntegerField(key_char, 'hipRatingMod', 'Hip Rating Modifier')
                    ]),
                    new NestedGroup([
                        new IntegerField(key_char, 'bellyRatingRaw', 'Belly Rating Raw'),
                        new IntegerField(key_char, 'bellyRatingMod', 'Belly Rating Modifier')
                    ]),
                    new FlagField(key_char, 'crotchFlags', 'ValidFlags.Crotch', 'Crotch Flags')
                ]),
                new Group('Skin', [
                    new SelectField(key_char, 'skinType', 'SkinType', 'Skin Type'),
                    new TextField(key_char, 'skinTone', 'Skin Tone', { typeaheadSource: 'ValidColors.SkinTone' }),
                    new TextField(key_char, 'skinAccent', 'Skin Accent'),
                    new TextField(key_char, 'furColor', 'Fur Color', { typeaheadSource: 'ValidColors.Fur' }),
                    new TextField(key_char, 'scaleColor', 'Scale Color', { typeaheadSource: 'ValidColors.Scale' }),
                    new FlagField(key_char, 'skinFlags', 'ValidFlags.Skin', 'Skin Flags'),
                ]),
                new Group('Butt', [
                    new SwitchField(key_char, 'analVirgin', 'Anal Virgin'),
                    new NestedGroup([
                        new IntegerField(key_char, 'buttRatingRaw', 'Butt Rating Raw'),
                        new IntegerField(key_char, 'buttRatingMod', 'Butt Rating Modifier')
                    ]),
                    new IntegerField(key_butt, 'bonusCapacity', 'Bonus Capacity'),
                    new IntegerField(key_butt, 'minLooseness', 'Minimum Looseness'),
                    new NestedGroup([
                        new IntegerField(key_butt, 'loosenessRaw', 'Looseness Raw'),
                        new IntegerField(key_butt, 'loosenessMod', 'Looseness Modifier')
                    ]),
                    new NestedGroup([
                        new IntegerField(key_butt, 'wetnessRaw', 'Wetness Raw'),
                        new IntegerField(key_butt, 'wetnessMod', 'Wetness Modifier')
                    ]),
                    new FlagField(key_butt, 'flags', 'ValidFlags.Butt', 'Butt Flags')
                ])
            ]),
            new Row([
                new Group('Wings', [
                    new SelectField(key_char, 'wingType', 'ValidTypes.Wing', 'Wing Type'),
                    new IntegerField(key_char, 'wingCount', 'Wing Count')
                ]),
                new Group('Arms', [
                    new SelectField(key_char, 'armType', 'ValidTypes.Arm', 'Arm Type'),
                    new FlagField(key_char, 'armFlags', 'ValidFlags.Arm', 'Arm Flags')
                ]),
                new Group('Legs', [
                    new SelectField(key_char, 'legType', 'ValidTypes.Leg', 'Leg Type'),
                    new IntegerField(key_char, 'legCount', 'Leg Count'),
                    new FlagField(key_char, 'legFlags', 'ValidFlags.Leg', 'Leg Flags')
                ])
            ]),
            new Row([
                new Group('Milk', [
                    new SelectField(key_char, 'milkType', 'FluidType', 'Milk Type'),
                    new FloatField(key_char, 'milkFullness', 'Milk Fullness'),
                    new IntegerField(key_char, 'milkRate', 'Milk Rate'),
                    new IntegerField(key_char, 'milkMultiplier', 'Milk Multiplier'),
                    new IntegerField(key_char, 'milkStorageMultiplier', 'Milk Storage Multiplier')
                ]),
                new Group('Nipples', [
                    new TextField(key_char, 'nippleColor', 'Nipple Color', { typeaheadSource: 'ValidColors.Nipple' }),
                    new IntegerField(key_char, 'nipplesPerBreast', 'Nipples Per Breast'),
                    new FloatField(key_char, 'nippleLengthRatio', 'Nipple Length Ratio'),
                    new FloatField(key_char, 'nippleWidthRatio', 'Nipple Width Ratio'),
                    new SelectField(key_char, 'dickNippleType', 'ValidTypes.Penis', 'Dicknipple type'),
                    new IntegerField(key_char, 'dickNippleMultiplier', 'Dicknipple Multiplier')
                ]),
                new ArrayGroup('Breasts', 'addBreastRow', [
                    new ArrayField(key_char, 'breastRows', [
                        new IntegerField('', 'breasts', 'Count'),
                        new IntegerField('', 'breastRatingRaw', 'Rating Raw'),
                        new IntegerField('', 'breastRatingMod', 'Rating Modifier'),
                        new IntegerField('', 'breastRatingLactationMod', 'Lactation Modifier'),
                        new IntegerField('', 'breastRatingHoneypotMod', 'Honeypot Modifier'),
                        new SelectField('', 'nippleType', 'NippleType', 'Nipple Type'),
                        new FloatField('', 'fullness', 'Fullness'),
                        new FlagField('', 'areolaFlags', 'ValidFlags.Areola', 'Areola Flags')
                    ], { koDescript: 'getBreastName', koDelete: 'removeBreastRow' })
                ])
            ]),
            new Row([
                new Group('Tail', [
                    new SelectField(key_char, 'tailType', 'ValidTypes.Tail', 'Tail Type'),
                    new IntegerField(key_char, 'tailCount', 'Tail Count'),
                    new FlagField(key_char, 'tailFlags', 'ValidFlags.Tail', 'Tail Flags')
                ]),
                new Group('Tail Penis', [
                    new SwitchField(key_tailP, 'virgin', 'Virgin'),
                    new NestedGroup([
                        new FloatField(key_tailP, 'cLengthRaw', 'Length Raw'),
                        new FloatField(key_tailP, 'cLengthMod', 'Length Modifier'),
                    ]),
                    new NestedGroup([
                        new FloatField(key_tailP, 'cThicknessRatioRaw', 'Thickness Ratio Raw'),
                        new FloatField(key_tailP, 'cThicknessRatioMod', 'Thickness Ratio Mod'),
                    ]),
                    new SelectField(key_tailP, 'cType', 'ValidTypes.Penis', 'Type'),
                    new TextField(key_tailP, 'cockColor', 'Color', { typeaheadSource: 'ValidColors.Penis' }),
                    new FloatField(key_tailP, 'knotMultiplier', 'Knot Multiplier'),
                    new FloatField(key_tailP, 'flaccidMultiplier', 'Flaccid Multiplier'),
                    new FlagField(key_tailP, 'flags', 'ValidFlags.Penis', 'Flags')
                ], { tooltipText: 'Must have at least 1 tail and the "Tailcock" tail flag set for this to have an effect.' }),
                new Group('Tail Vagina', [
                    new SwitchField(key_tailV, 'hymen', 'Hymen'),
                    new IntegerField(key_tailV, 'minLooseness', 'Minimum Looseness'),
                    new NestedGroup([
                        new IntegerField(key_tailV, 'loosenessRaw', 'Looseness Raw'),
                        new IntegerField(key_tailV, 'loosenessMod', 'Looseness Modifier')
                    ]),
                    new NestedGroup([
                        new IntegerField(key_tailV, 'wetnessRaw', 'Wetness Raw'),
                        new IntegerField(key_tailV, 'wetnessMod', 'Wetness Modifier')
                    ]),
                    new IntegerField(key_tailV, 'bonusCapacity', 'Bonus Capacity'),
                    new SelectField(key_tailV, 'type', 'ValidTypes.Vagina', 'Type'),
                    new TextField(key_tailV, 'vaginaColor', 'Color', { typeaheadSource: 'ValidColors.Vagina' }),
                    new IntegerField(key_tailV, 'clits', 'Clits', { min: 1 }),
                    new FloatField(key_tailV, 'fullness', 'Fullness'),
                    new IntegerField(key_tailV, 'shrinkCounter', 'Shrink Counter'),
                    new FlagField(key_tailV, 'flags', 'ValidFlags.Vagina', 'Flags')
                ], { tooltipText: 'Must have at least 1 tail and the "Tailcunt" tail flag set for this to have an effect.' })
            ])
        ]).build();
    },

    getCrotch: () => {
        return new Tab([
            new Row([
                new Group('Male Organs', [
                    new SwitchField(key_char, 'cockVirgin', 'Penis Virgin'),
                    new IntegerField(key_char, 'balls', 'Balls'),
                    new NestedGroup([
                        new FloatField(key_char, 'ballSizeRaw', 'Ball Size Raw'),
                        new IntegerField(key_char, 'ballSizeMod', 'Ball Size Modifier')
                    ]),
                    new FloatField(key_char, 'Internal_ballFullness', 'Ball Fullness', { max: 100 }),
                    new FloatField(key_char, 'Internal_ballEfficiency', 'Ball Efficiency'),
                    new FloatField(key_char, 'refractoryRate', 'Refractory Rate'),
                    new SelectField(key_char, 'cumType', 'FluidType', 'Cum Type'),
                    new NestedGroup([
                        new FloatField(key_char, 'cumMultiplierRaw', 'Cum Multiplier Raw'),
                        new IntegerField(key_char, 'cumMultiplierMod', 'Cum Multiplier Raw')
                    ]),
                    new NestedGroup([
                        new FloatField(key_char, 'cumQualityRaw', 'Cum Quality Raw'),
                        new IntegerField(key_char, 'cumQualityMod', 'Cum Quality Modifier')
                    ])
                ]),
                new ArrayGroup('Penises', 'addPenis', [
                    new ArrayField(key_char, 'cocks', [
                        new SwitchField('', 'virgin', 'Virgin'),
                        new NestedGroup([
                            new FloatField('', 'cLengthRaw', 'Length Raw'),
                            new FloatField('', 'cLengthMod', 'Length Modifier'),
                        ]),
                        new NestedGroup([
                            new FloatField('', 'cThicknessRatioRaw', 'Thickness Ratio Raw'),
                            new FloatField('', 'cThicknessRatioMod', 'Thickness Ratio Mod'),
                        ]),
                        new SelectField('', 'cType', 'ValidTypes.Penis', 'Type'),
                        new TextField('', 'cockColor', 'Color', { typeaheadSource: 'ValidColors.Penis' }),
                        new FloatField('', 'knotMultiplier', 'Knot Multiplier'),
                        new FloatField('', 'flaccidMultiplier', 'Flaccid Multiplier'),
                        new FlagField('', 'flags', 'ValidFlags.Penis', 'Flags')
                    ], { koDescript: 'getPenisName', koDelete: 'removePenis' })
                ])
            ]),
            new Row([
                new Group('Female Organs', [
                    new SwitchField(key_char, 'vaginalVirgin', 'Vaginal Virgin'),
                    new NestedGroup([
                        new FloatField(key_char, 'fertilityRaw', 'Fertility Raw'),
                        new IntegerField(key_char, 'fertilityMod', 'Fertility Modifier')
                    ]),
                    new SelectField(key_char, 'girlCumType', 'FluidType', 'Cum Type'),
                    new NestedGroup([
                        new FloatField(key_char, 'girlCumMultiplierRaw', 'Cum Multiplier Raw'),
                        new IntegerField(key_char, 'girlCumMultiplierMod', 'Cum Multiplier Modifier')
                    ]),
                    new FloatField(key_char, 'clitLength', 'Clit Length')
                ]),
                new ArrayGroup('Vaginas', 'addVagina', [
                    new ArrayField(key_char, 'vaginas', [
                        new SwitchField('', 'hymen', 'Hymen'),
                        new IntegerField('', 'minLooseness', 'Minimum Looseness'),
                        new NestedGroup([
                            new IntegerField('', 'loosenessRaw', 'Looseness Raw'),
                            new IntegerField('', 'loosenessMod', 'Looseness Modifier')
                        ]),
                        new NestedGroup([
                            new IntegerField('', 'wetnessRaw', 'Wetness Raw'),
                            new IntegerField('', 'wetnessMod', 'Wetness Modifier')
                        ]),
                        new IntegerField('', 'bonusCapacity', 'Bonus Capacity'),
                        new SelectField('', 'type', 'ValidTypes.Vagina', 'Type'),
                        new TextField('', 'vaginaColor', 'Color', { typeaheadSource: 'ValidColors.Vagina' }),
                        new IntegerField('', 'clits', 'Clits', { min: 1 }),
                        new FloatField('', 'fullness', 'Fullness'),
                        new IntegerField('', 'shrinkCounter', 'Shrink Counter'),
                        new FlagField('', 'flags', 'ValidFlags.Vagina', 'Flags')
                    ], { koDescript: 'getVaginaName', koDelete: 'removeVagina' })
                ]),
            ])
        ]).build();
    },

    getShips: () => {
        return new Tab([
            new Row([
                new ArrayGroup('a', '', [
                    new ArrayField(key_save, 'ships', [
                        new TextField('', 'short', 'Name')
                    ], { isObj: true })
                ])
            ])
        ]).build();
    },


    getStoragePopup: () => {

        const divRoot = document.createElement('div');
        divRoot.className = 'modal-content bg-secondary';
        divRoot.dataset.bind = 'with: $root.selectedStorage';


        const divHeader = document.createElement('div');
        divHeader.className = 'modal-header';

        const h5StorageName = document.createElement('h5');
        h5StorageName.className = 'modal-title';
        h5StorageName.dataset.bind = 'text: obj.storageName';

        const btnClose = document.createElement('button');
        btnClose.classList.add('btn-close', 'btn-danger');
        btnClose.type = 'button';
        btnClose.setAttribute('data-bs-dismiss', 'modal');
        btnClose.ariaLabel = 'Close';

        divHeader.appendChild(h5StorageName);
        divHeader.appendChild(btnClose);


        const divBody = document.createElement('div');
        divBody.className = 'modal-body';

        divBody.appendChild(new TextField('', 'obj.tooltip', 'Tooltip', { koVisible: 'fields.includes("tooltip")' }).build());

        divBody.appendChild(new NestedGroup([
            new FloatField('', 'obj.value1', 'Value 1', { min: null, koVisible: 'fields.includes("value1")' }),
            new FloatField('', 'obj.value2', 'Value 2', { min: null, koVisible: 'fields.includes("value2")' })
        ]).build());
        divBody.appendChild(new NestedGroup([
            new FloatField('', 'obj.value3', 'Value 3', { min: null, koVisible: 'fields.includes("value3")' }),
            new FloatField('', 'obj.value4', 'Value 4', { min: null, koVisible: 'fields.includes("value4")' })
        ]).build());

        divBody.appendChild(new NestedGroup([
            new TextField('', 'obj.iconName', 'Icon Name', { koVisible: 'fields.includes("iconName")' }),
            new TextField('', 'obj.iconShade', 'Icon Shade', { koVisible: 'fields.includes("iconShade")' })
        ]).build());

        divBody.appendChild(new IntegerField('', 'obj.minutesLeft', 'Minutes Left', { suffixText: 'minutes', koVisible: 'fields.includes("minutesLeft")' }).build());

        divBody.appendChild(new SwitchField('', 'obj.combatOnly', 'Combat Only', { koVisible: 'fields.includes("combatOnly")' }).build());
        divBody.appendChild(new SwitchField('', 'obj.hidden', 'Hidden', { koVisible: 'fields.includes("hidden")' }).build());


        divRoot.appendChild(divHeader);
        divRoot.appendChild(divBody);


        return divRoot;
    },


    getPerks: () => new StorageContainer(key_char, 'perks', 'perkList', ['tooltip', 'value1', 'value2', 'value3', 'value4']).build(),

    getStatusEffects: () => new StorageContainer(key_char, 'statusEffects', 'statusEffectList', ['all']).build(),

    getKeyItems: () => new StorageContainer(key_char, 'keyItems', 'keyItemList', ['tooltip', 'value1', 'value2', 'value3', 'value4']).build(),


    getFlags: () => {

        const divRoot = document.createElement('div');
        util.setKoBinding(divRoot, 'foreach', '$root.stateFlagList');


        const templateRootContainer = document.createElement('div');
        templateRootContainer.classList.add('state-flag-container');


        const templateFlagContainer = document.createElement('div');
        templateFlagContainer.classList.add('row', 'g-0', 'py-2');


        const templateFlagNameContainer = document.createElement('div');
        templateFlagNameContainer.classList.add('col-6', 'd-flex', 'align-items-center', 'pe-1');

        const templateFlagName = document.createElement('label');
        templateFlagName.classList.add('text-break');
        util.setKoBinding(templateFlagName, 'text', 'key');
        util.setKoBinding(templateFlagName, 'attr', "{ 'for': 'edit-flags-' + $index() }");

        templateFlagNameContainer.appendChild(templateFlagName);


        const templateFlagValueContainer = document.createElement('div');
        templateFlagValueContainer.classList.add('col-6', 'd-flex', 'align-items-center', 'ps-1');

        const templateFlagValue = document.createElement('input');
        templateFlagValue.type = 'text';
        templateFlagValue.classList.add('form-control', 'form-control-sm');
        util.setKoBinding(templateFlagValue, 'value', 'value');
        util.setKoBinding(templateFlagValue, 'attr', "{ 'id': 'edit-flags-' + $index() }");

        templateFlagValueContainer.appendChild(templateFlagValue);


        const templateHorizontalLine = document.createElement('hr');
        templateHorizontalLine.classList.add('m-0');


        templateFlagContainer.appendChild(templateFlagNameContainer);
        templateFlagContainer.appendChild(templateFlagValueContainer);

        templateRootContainer.appendChild(templateFlagContainer);
        templateRootContainer.appendChild(templateHorizontalLine);

        divRoot.appendChild(templateRootContainer);

        return divRoot;

    }
};
