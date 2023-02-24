/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable sort-keys */


const key_char = 'selectedCharacter().obj';
const key_butt = key_char + '.ass';

const key_save = 'save';
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
                    new IntegerField(key_save, 'days', 'Days', 'days', 0),
                    new IntegerField(key_save, 'hours', 'Hours', 'hours', 0, 23),
                    new IntegerField(key_save, 'minutes', 'Minutes', 'minutes', 0, 59),
                ]),
                new Group('Game Settings', [
                    new SwitchField(key_save, 'easyMode', 'Easy Mode'),
                    new SwitchField(key_save, 'sillyMode', 'Silly Mode'),
                    new SwitchField(key_instance, 'miniMapVisible', 'Minimap visible'),
                    new SwitchField(key_instance, 'minimapRolledOut', 'Minimap rolled out'),
                    new SwitchField(key_instance, 'bustRolledOut', 'Bust rolled out'),
                    new SwitchField(key_instance, 'dateTimeVisible', 'Date and Time visible')
                ])
            ])
        ]);
    },

    getStats: () => {
        return new Tab([
            new Row([
                new Group('General', [
                    new TextField(key_char, 'short', 'Name', null, 'nameChanged'),
                    new IntegerField(key_char, 'credits', 'Credits', null, 0),
                    new IntegerField(key_char, 'personality', 'Personality', null, 0, 100),
                    new IntegerField(key_char, 'exhibitionismRaw', 'Exhibitionism', null, 0, 100)
                ]),
                new Group('Advancement', [
                    new IntegerField(key_char, 'level', 'Level', null, 0, 10),
                    new IntegerField(key_pc, 'XPRaw', 'XP', null, 0, null, null, true),
                    new IntegerField(key_pc, 'unspentStatPoints', 'Stat Points', null, 0, null, null, true)
                ]),
                new Group('Appearance', [
                    new IntegerField(key_char, 'tallness', 'Height', 'inches', 0),
                    new IntegerField(key_char, 'thickness', 'Thickness', null, 0, 100),
                    new IntegerField(key_char, 'tone', 'Tone', null, 0, 100),
                    new IntegerField(key_char, 'femininity', 'Femininity', null, 0, 100)
                ]),
            ]),
            new Row([
                new Group('Core', [
                    new NestedGroup('', [
                        new FloatField(key_char, 'Internal_aimRaw', 'Aim Raw', null, 0),
                        new IntegerField(key_char, 'aimMod', 'Aim Mod', null, 0),
                    ]),
                    new NestedGroup('', [
                        new FloatField(key_char, 'Internal_intelligenceRaw', 'Intelligence Raw', null, 0),
                        new IntegerField(key_char, 'intelligenceMod', 'Intelligence Mod', null, 0),
                    ]),
                    new NestedGroup('', [
                        new FloatField(key_char, 'Internal_physiqueRaw', 'Physique Raw', null, 0),
                        new IntegerField(key_char, 'physiqueMod', 'Physique Mod', null, 0),
                    ]),
                    new NestedGroup('', [
                        new FloatField(key_char, 'Internal_reflexesRaw', 'Reflexes Raw', null, 0),
                        new IntegerField(key_char, 'reflexesMod', 'Reflexes Mod', null, 0),
                    ]),
                    new NestedGroup('', [
                        new FloatField(key_char, 'Internal_willpowerRaw', 'Willpower Raw', null, 0),
                        new IntegerField(key_char, 'willpowerMod', 'Willpower Mod', null, 0),
                    ]),
                    new NestedGroup('', [
                        new FloatField(key_char, 'Internal_libidoRaw', 'Libido Raw', null, 0, 100),
                        new IntegerField(key_char, 'libidoMod', 'Libido Mod', null, 0, 100),
                    ]),
                    new NestedGroup('', [
                        new FloatField(key_char, 'Internal_taintRaw', 'Taint Raw', null, 0, 100),
                        new IntegerField(key_char, 'taintMod', 'Taint Mod', null, 0, 100)
                    ])
                ]),
                new Group('Combat', [
                    new NestedGroup('', [
                        new IntegerField(key_char, 'HPRaw', 'HP Raw', null, 0),
                        new IntegerField(key_char, 'HPMod', 'HP Mod', null, 0)
                    ]),
                    new NestedGroup('', [
                        new IntegerField(key_char, 'energyRaw', 'Energy Raw', null, 0),
                        new IntegerField(key_char, 'energyMod', 'Energy Mod', null, 0)
                    ]),
                    new NestedGroup('', [
                        new IntegerField(key_char, 'lustRaw', 'Lust Raw', null, 0, 100),
                        new IntegerField(key_char, 'lustMod', 'Lust Mod', null, 0)
                    ]),
                    new IntegerField(key_char, 'shieldsRaw', 'Shields Raw', null, 0)
                ]),
            ]),
        ]);
    },

    getHead: () => {
        return new Tab([
            new Row([
                new Group('Head', [
                    new SelectField('ValidTypes.Antennae', key_char, 'antennaeType', 'Antennae Type'),
                    new IntegerField(key_char, 'antennae', 'Antennae Count', null, 0),
                    new SelectField('ValidTypes.Horn', key_char, 'hornType', 'Horn Type'),
                    new IntegerField(key_char, 'horns', 'Horn Count', null, 0),
                    new FloatField(key_char, 'hornLength', 'Horn Length', 'inches', 0)
                ]),
                new Group('Hair', [
                    new SelectField('HairType', key_char, 'hairType', 'Hair Type'),
                    new FloatField(key_char, 'hairLength', 'Hair Length', 'inches', 0),
                    new TextField(key_char, 'hairColor', 'Hair Color'),
                    new SelectField('HairStyle', key_char, 'hairStyle', 'Hair Style'),
                    new FloatField(key_char, 'beardLength', 'Beard Length', 'inches', 0),
                    new SelectField('HairType', key_char, 'beardType', 'Beard Type'),
                    new SelectField('BeardStyle', key_char, 'beardStyle', 'Beard Style')
                ])
            ]),
            new Row([
                new Group('Face', [
                    new SelectField('ValidTypes.Face', key_char, 'faceType', 'Face Type'),
                    new FlagField('ValidFlags.Face', key_char, 'faceFlags', 'Face Flags')
                ]),
                new Group('Tongue', [
                    new SelectField('ValidTypes.Tongue', key_char, 'tongueType', 'Tongue Type'),
                    new FlagField('ValidFlags.Tongue', key_char, 'tongueFlags', 'Tongue Flags')
                ])
            ]),
            new Row([
                new Group('Lips', [
                    new TextField(key_char, 'lipColor', 'Lip Color'),
                    new IntegerField(key_char, 'lipMod', 'Lip Mod', null, 0)
                ]),
                new Group('Ears', [
                    new SelectField('ValidTypes.Ear', key_char, 'earType', 'Ear Type'),
                    new FloatField(key_char, 'earLength', 'Ear Length', 'inches', 0),
                    new FlagField('ValidFlags.Ear', key_char, 'earFlags', 'Ear Flags'),
                ]),
                new Group('Eyes', [
                    new SelectField('ValidTypes.Eye', key_char, 'eyeType', 'Eye Type'),
                    new TextField(key_char, 'eyeColor', 'Eye Color')
                ])
            ])
        ]);
    },

    getBody: () => {
        return new Tab([
            new Row([
                new Group('General', [
                    new SwitchField(key_char, 'gills', 'Has Gills'),
                    new FloatField(key_char, 'elasticity', 'Elasticity', null, 0),
                    new SelectField('GenitalSpot', key_char, 'genitalSpot', 'Genital Spot'),
                    new NestedGroup('', [
                        new IntegerField(key_char, 'hipRatingRaw', 'Hip Rating Raw', null, 0),
                        new IntegerField(key_char, 'hipRatingMod', 'Hip Rating Mod', null, 0),
                    ]),
                    new NestedGroup('', [
                        new IntegerField(key_char, 'buttRatingRaw', 'Butt Rating Raw', null, 0),
                        new IntegerField(key_char, 'buttRatingMod', 'Butt Rating Mod', null, 0)
                    ]),
                    new NestedGroup('', [
                        new IntegerField(key_char, 'bellyRatingRaw', 'Belly Rating Raw', null, 0),
                        new IntegerField(key_char, 'bellyRatingMod', 'Belly Rating Mod', null, 0)
                    ])
                ]),
                new Group('Skin', [
                    new SelectField('SkinType', key_char, 'skinType', 'Skin Type'),
                    new TextField(key_char, 'skinTone', 'Skin Tone'),
                    new TextField(key_char, 'skinAccent', 'Skin Accent'),
                    new TextField(key_char, 'furColor', 'Fur Color'),
                    new TextField(key_char, 'scaleColor', 'Scale Color'),
                    new FlagField('ValidFlags.Skin', key_char, 'skinFlags', 'Skin Flags'),
                ])
            ]),
            new Row([
                new Group('Wings', [
                    new SelectField('ValidTypes.Wing', key_char, 'wingType', 'Wing Type'),
                    new IntegerField(key_char, 'wingCount', 'Wing Count', null, 0)
                ]),
                new Group('Arms', [
                    new SelectField('ValidTypes.Arm', key_char, 'armType', 'Arm Type'),
                    new FlagField('ValidFlags.Arm', key_char, 'armFlags', 'Arm Flags')
                ]),
                new Group('Legs', [
                    new SelectField('ValidTypes.Leg', key_char, 'legType', 'Leg Type'),
                    new IntegerField(key_char, 'legCount', 'Leg Count', null, 0),
                    new FlagField('ValidFlags.Leg', key_char, 'legFlags', 'Leg Flags')
                ])
            ]),
            new Row([
                new Group('Butt', [
                    new SwitchField(key_char, 'analVirgin', 'Anal Virgin'),
                    new IntegerField(key_butt, 'minLooseness', 'Min Looseness', null, 0),
                    new IntegerField(key_butt, 'bonusCapacity', 'Bonus Capacity', null, 0),
                    new FlagField('ValidFlags.Butt', key_butt, 'flags', 'Butt Flags'),
                    new NestedGroup('', [
                        new IntegerField(key_butt, 'loosenessRaw', 'Looseness Raw', null, 0),
                        new IntegerField(key_butt, 'loosenessMod', 'Looseness Mod', null, 0)
                    ]),
                    new NestedGroup('', [
                        new IntegerField(key_butt, 'wetnessRaw', 'Wetness Raw', null, 0),
                        new IntegerField(key_butt, 'wetnessMod', 'Wetness Mod', null, 0)
                    ])
                ]),
                new Group('Tail', [
                    new SelectField('ValidTypes.Tail', key_char, 'tailType', 'Tail Type'),
                    new IntegerField(key_char, 'tailCount', 'Tail Count', null, 0),
                    new FlagField('ValidFlags.Tail', key_char, 'tailFlags', 'Tail Flags')
                ])
            ]),
            new Row([
                new Group('Milk', [
                    new SelectField('FluidType', key_char, 'milkType', 'Milk Type'),
                    new FloatField(key_char, 'milkFullness', 'Milk Fullness', null, 0),
                    new IntegerField(key_char, 'milkRate', 'Milk Rate', null, 0),
                    new IntegerField(key_char, 'milkMultiplier', 'Milk Multiplier', null, 0),
                    new IntegerField(key_char, 'milkStorageMultiplier', 'Milk Storage Multiplier', null, 0)
                ]),
                new Group('Nipples', [
                    new TextField(key_char, 'nippleColor', 'Nipple Color'),
                    new IntegerField(key_char, 'nipplesPerBreast', 'Nipples Per Breast', null, 0),
                    new FloatField(key_char, 'nippleLengthRatio', 'Nipple Length Ratio', null, 0),
                    new FloatField(key_char, 'nippleWidthRatio', 'Nipple Width Ratio', null, 0),
                    new SelectField('ValidTypes.Penis', key_char, 'dickNippleType', 'Dicknipple type'),
                    new IntegerField(key_char, 'dickNippleMultiplier', 'Dicknipple Multiplier', null, 0)
                ]),
                new ArrayGroup('Breasts', 'addBreastRow', [
                    new ArrayField(key_char, 'breastRows()', 'getBreastName', 'removeBreastRow', [
                        new IntegerField('', 'breasts', 'Count', null, 0),
                        new IntegerField('', 'breastRatingRaw', 'Rating Raw', null, 0),
                        new IntegerField('', 'breastRatingMod', 'Rating Mod', null, 0),
                        new IntegerField('', 'breastRatingLactationMod', 'Lactation Mod', null, 0),
                        new IntegerField('', 'breastRatingHoneypotMod', 'Honeypot Mod', null, 0),
                        new SelectField('NippleType', '', 'nippleType', 'Nipple Type'),
                        new FloatField('', 'fullness', 'Fullness', null, 0),
                        new FlagField('ValidFlags.Areola', '', 'areolaFlags', 'Areola Flags')
                    ])
                ])
            ])
        ]);
    },

    getCrotch: () => {
        return new Tab([
            new Row([
                new Group('Male Organs', [
                    new IntegerField(key_char, 'balls', 'Balls', null, 0),
                    new NestedGroup('', [
                        new FloatField(key_char, 'ballSizeRaw', 'Ball Size Raw', null, 0),
                        new IntegerField(key_char, 'ballSizeMod', 'Ball Size Mod', null, 0)
                    ]),
                    new FloatField(key_char, 'Internal_ballFullness', 'Ball Fullness', null, 0, 100),
                    new FloatField(key_char, 'Internal_ballEfficiency', 'Ball Efficiency', null, 0),
                    new FloatField(key_char, 'refractoryRate', 'Refractory Rate', null, 0),
                    new SelectField('FluidType', key_char, 'cumType', 'Cum Type'),
                    new NestedGroup('', [
                        new FloatField(key_char, 'cumMultiplierRaw', 'Cum Multiplier Raw', null, 0),
                        new IntegerField(key_char, 'cumMultiplierMod', 'Cum Multiplier Raw', null, 0)
                    ]),
                    new NestedGroup('', [
                        new FloatField(key_char, 'cumQualityRaw', 'Cum Quality Raw', null, 0),
                        new IntegerField(key_char, 'cumQualityMod', 'Cum Quality Mod', null, 0)
                    ]),
                    new SwitchField(key_char, 'cockVirgin', 'Penis Virgin')
                ]),
                new ArrayGroup('Penises', 'addPenis', [
                    new ArrayField(key_char, 'cocks()', 'getPenisName', 'removePenis', [
                        new NestedGroup('', [
                            new FloatField('', 'cLengthRaw', 'Length Raw', null, 0),
                            new FloatField('', 'cLengthMod', 'Length Mod', null, 0),
                        ]),
                        new NestedGroup('', [
                            new FloatField('', 'cThicknessRatioRaw', 'Thickness Ratio Raw', null, 0),
                            new FloatField('', 'cThicknessRatioMod', 'Thickness Ratio Mod', null, 0),
                        ]),
                        new SelectField('ValidTypes.Penis', '', 'cType', 'Type'),
                        new TextField('', 'cockColor', 'Color'),
                        new FloatField('', 'knotMultiplier', 'Knot Multiplier', null, 0),
                        new FloatField('', 'flaccidMultiplier', 'Flaccid Multiplier', null, 0),
                        new SwitchField('', 'virgin', 'Virgin'),
                        new FlagField('ValidFlags.Penis', '', 'flags', 'Flags')
                        //todo piercing
                    ])
                ])
            ]),
            new Row([
                new Group('Female Organs', [
                    new NestedGroup('', [
                        new FloatField(key_char, 'fertilityRaw', 'Fertility Raw', null, 0),
                        new IntegerField(key_char, 'fertilityMod', 'Fertility Mod', null, 0)
                    ]),
                    new SelectField('FluidType', key_char, 'girlCumType', 'Cum Type'),
                    new NestedGroup('', [
                        new FloatField(key_char, 'girlCumMultiplierRaw', 'Cum Multiplier Raw', null, 0),
                        new IntegerField(key_char, 'girlCumMultiplierMod', 'Cum Multiplier Mod', null, 0)
                    ]),
                    new FloatField(key_char, 'clitLength', 'Clit Length', null, 0),
                    new SwitchField(key_char, 'vaginalVirgin', 'Vaginal Virgin')
                ]),
                new ArrayGroup('Vaginas', 'addVagina', [
                    new ArrayField(key_char, 'vaginas()', 'getVaginaName', 'removeVagina', [
                        new IntegerField('', 'minLooseness', 'Min Looseness', null, 0),
                        new NestedGroup('', [
                            new IntegerField('', 'loosenessRaw', 'Looseness Raw', null, 0),
                            new IntegerField('', 'loosenessMod', 'Looseness Mod', null, 0)
                        ]),
                        new NestedGroup('', [
                            new IntegerField('', 'wetnessRaw', 'Wetness Raw', null, 0),
                            new IntegerField('', 'wetnessMod', 'Wetness Mod', null, 0)
                        ]),
                        new IntegerField('', 'bonusCapacity', 'Bonus Capacity', null, 0),
                        new SelectField('ValidTypes.Vagina', '', 'type', 'Type'),
                        new TextField('', 'vaginaColor', 'Color'),
                        new IntegerField('', 'clits', 'Clits', null, 1),
                        new FloatField('', 'fullness', 'Fullness', null, 0),
                        new IntegerField('', 'shrinkCounter', 'Shrink Counter', null, 0),
                        new SwitchField('', 'hymen', 'Hymen'),
                        new FlagField('ValidFlags.Vagina', '', 'flags', 'Flags')
                        //todo piercing
                    ])
                ]),
            ])
        ]);
    },


    getStoragePopup: () => {

        const dRoot = document.createElement('div');
        dRoot.className = 'modal-content bg-secondary';
        dRoot.dataset.bind = 'with: $root.selectedStorage';


        const dHeader = document.createElement('div');
        dHeader.className = 'modal-header';

        const lblStorageName = document.createElement('h5');
        lblStorageName.className = 'modal-title';
        lblStorageName.dataset.bind = 'text: obj.storageName';

        const btnClose = document.createElement('button');
        btnClose.className = 'btn-close btn-danger';
        btnClose.type = 'button';
        btnClose.setAttribute('data-bs-dismiss', 'modal');
        btnClose.ariaLabel = 'Close';

        dHeader.appendChild(lblStorageName);
        dHeader.appendChild(btnClose);


        const dBody = document.createElement('div');
        dBody.className = 'modal-body';

        dBody.appendChild(new TextField('', 'obj.tooltip', 'Tooltip', null, null, null, 'fields.includes("tooltip")'));

        dBody.appendChild(new NestedGroup('', [
            new FloatField('', 'obj.value1', 'Value 1', null, null, null, null, null, 'fields.includes("value1")'),
            new FloatField('', 'obj.value2', 'Value 2', null, null, null, null, null, 'fields.includes("value2")')
        ]));
        dBody.appendChild(new NestedGroup('', [
            new FloatField('', 'obj.value3', 'Value 3', null, null, null, null, null, 'fields.includes("value3")'),
            new FloatField('', 'obj.value4', 'Value 4', null, null, null, null, null, 'fields.includes("value4")')
        ]));

        dBody.appendChild(new NestedGroup('', [
            new TextField('', 'obj.iconName', 'Icon Name', null, null, null, 'fields.includes("iconName")'),
            new TextField('', 'obj.iconShade', 'Icon Shade', null, null, null, 'fields.includes("iconShade")')
        ]));

        dBody.appendChild(new IntegerField('', 'obj.minutesLeft', 'Minutes Left', 'minutes', 0, null, null, null, 'fields.includes("minutesLeft")'));

        dBody.appendChild(new SwitchField('', 'obj.combatOnly', 'Combat Only', null, null, 'fields.includes("combatOnly")'));
        dBody.appendChild(new SwitchField('', 'obj.hidden', 'Hidden', null, null, 'fields.includes("hidden")'));


        dRoot.appendChild(dHeader);
        dRoot.appendChild(dBody);


        return dRoot;
    },

    getPerks: () => {
        return new StorageContainer(key_char, 'perks', 'perkList', ['tooltip', 'value1', 'value2', 'value3', 'value4']);
    },

    getStatusEffects: () => {
        return new StorageContainer(key_char, 'statusEffects', 'statusEffectList', ['all']);
    },

    getKeyItems: () => {
        return new StorageContainer(key_char, 'keyItems', 'keyItemList', ['tooltip', 'value1', 'value2', 'value3', 'value4']);
    },


    getFlags: () => {
        return new FlagContainer();
    }
};