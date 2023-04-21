/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable no-prototype-builtins */

/** @type {ViewModel} */
var vm = undefined;


const loadMapping = {
    'flags': {
        create: function (options) {
            if (options.data.hasOwnProperty('pathOverrides')) {
                return new ko.observableDictionary({ ...Flags, ...options.data });
            }
            else {
                return options.data;
            }
        }
    }
};


var ViewModel = function (data) {

    var self = this;


    // Will (eventually) be used for loading indicators
    self.busy = ko.observable(false);


    self.save = ko.observable({});

    self.saveLoaded = ko.computed(() => self.save != null && self.save() != null && Object.keys(self.save()).length > 0, self);

    self.saveName = ko.observable('');

    self.originalSaveName = ko.observable('');


    self.getGlobal = path => {
        return util.getObjectByPath(Globals, path);
    };


    // #region Character


    self.selectedCharacter = ko.observable();
    self.selectedCharacter.subscribe(_ => {
        if (self.selectedCharacter()) {

            self.updateStorageForChar(self.statusEffectList, StatusEffects, 'statusEffects');
            self.updateStorageForChar(self.perkList, Perks, 'perks');
            self.updateStorageForChar(self.keyItemList, KeyItems, 'keyItems');

        }
    });

    self.characters = ko.computed(() => {

        if (self.saveLoaded()) {
            return Object.keys(self.save().characters).map(key => ({
                name: key,
                obj: self.save().characters[key]
            }));
        }

        return [];

    }, self);


    self.isPC = ko.computed(() => {

        if (self.selectedCharacter()) {
            return self.selectedCharacter().name === 'PC';
        }

        return false;

    }, self);


    // #endregion


    // #region StorageClass


    self.updateStorageForChar = (observableList, editorList, charListName) => {

        if (self.selectedCharacter()) {

            var editorStorages = ko.mapping.fromJS(editorList);
            const charStorages = self.selectedCharacter().obj[charListName];

            editorStorages = ko.utils.arrayFilter(editorStorages(), editorStorage => {

                const match = ko.utils.arrayFirst(charStorages(), charStorage => {
                    return charStorage.storageName() === editorStorage.storageName();
                });

                return match === undefined;

            });

            observableList(
                editorStorages
                    .concat(charStorages())
                    .sort((l, r) => l.storageName().localeCompare(r.storageName()))
            );

        }

    };


    self.hasStorage = (storage, type) => {

        if (self.selectedCharacter()) {
            return self.selectedCharacter().obj[type]().includes(storage);
        }

        return false;
    };


    self.hasStorageTooltip = storage => {
        return !!storage.tooltip();
    };


    self.selectedStorage = ko.observable();

    self.selectStorage = (storage, fields) => {

        if (fields === undefined || fields[0] === 'all') {
            fields = ['tooltip', 'value1', 'value2', 'value3', 'value4', 'iconName', 'iconShade', 'combatOnly', 'hidden', 'minutesLeft'];
        }

        self.selectedStorage({
            fields: fields,
            obj: storage
        });

        $('#modalStorage').modal('show');

    };

    self.hasSelectedStorage = ko.computed(() => {
        return self.selectedStorage() !== undefined;
    }, self);


    // #region Status Effects

    self.statusEffectList = ko.mapping.fromJS(StatusEffects);

    // #endregion


    // #region Perks

    self.perkList = ko.mapping.fromJS(Perks);

    // #endregion


    // #region Key Items

    self.keyItemList = ko.mapping.fromJS(KeyItems);

    // #endregion


    // #endregion


    // #region State Flags

    self.stateFlagUndesired = ['artistOverrides', 'customMannequin', 'pathOverrides'];

    self.stateFlagList = ko.computed(() => {

        if (self.saveLoaded()) {

            const flags = [];

            self.save().flags.items().forEach(dictionaryItem => {

                if (self.stateFlagUndesired.includes(dictionaryItem.key())) {
                    return;
                }

                flags.push(dictionaryItem);

            });

            return flags;

        }

        return [];

    }, self);

    // #endregion


    // #region OnChanged

    self.nameChanged = function (_, event) {

        const char = self.selectedCharacter().obj;
        const name = event.target.value;

        if (char.uniqueName() !== null && char.uniqueName() !== undefined) {
            char.uniqueName(name);
        }
        if (self.isPC()) {
            self.save.gameInstanceInfo.name(name);
            const mailObj = self.save.mailState.mails;
            for (const [key] of Object.entries(mailObj)) {
                const mail = mailObj[key];
                if (mail.hasOwnProperty('ToCache')) {
                    mail['ToCache'] = name + ' Steele';
                }
            }
        }

    };

    self.emailChanged = function (data, event) {
        const email = event.target.value;
        const mailObj = self.save.mailState.mails;

        for (const [key] of Object.entries(mailObj)) {
            const mail = mailObj[key];
            if (mail.hasOwnProperty('ToAddressCache')) {
                mail['ToAddressCache'] = email + '@SteeleTech.corp';
            }
        }
    };

    // #endregion


    // #region Validation

    self.validateNumberInput = function (data, event) {
        const input = event.target;
        const type = !!input.pattern ? 'int' : 'float';
        const val = type === 'int' ? parseInt(event.target.value) : parseFloat(event.target.value);
        input.value = !isNaN(val) ? val : '';

        if (input.value !== '' && !isNaN(input.value)) {
            const min = parseFloat(input.min);
            const max = parseFloat(input.max);

            if (!isNaN(min) && input.value < min) {
                input.value = min;
                alert('Value must be greater than or equal to ' + min);
            }
            if (!isNaN(max) && input.value > max) {
                input.value = max;
                alert('Value must be less than or equal to ' + max);
            }
        }
        else {
            input.value = !isNaN(parseFloat(input.min)) ? +input.min : 0;
            alert(type === 'int' ? 'Value must be an integer (whole number)' : 'Value must be a number');
        }
    };

    // #endregion


    // #region Arrays


    // #region Penis

    self.getPenisName = function (index) {

        const c = self.selectedCharacter().obj.cocks()[index()];

        if (c) {
            const color = c.cockColor();
            const len = +c.cLengthRaw() + +c.cLengthMod();
            const type = Globals.BodyType.find(t => t.value == c.cType()).name.toLowerCase();
            return `a ${color} ${len}" ${type} penis`;
        }

    };

    self.addPenis = function () {
        self.selectedCharacter().obj.cocks.push(ko.mapping.fromJS(new Cock()));
    };

    self.removePenis = function (data) {
        self.selectedCharacter().obj.cocks.remove(data);
    };

    // #endregion


    // #region Vagina

    self.getVaginaName = function (index) {

        const v = self.selectedCharacter().obj.vaginas()[index()];

        if (v) {
            const color = v.vaginaColor();
            const type = Globals.BodyType.find(t => t.value == v.type()).name.toLowerCase();
            return `a ${color} ${type} vagina`;
        }

    };

    self.addVagina = function () {
        self.selectedCharacter().obj.vaginas.push(ko.mapping.fromJS(new Vagina()));
    };

    self.removeVagina = function (data) {
        self.selectedCharacter().obj.vaginas.remove(data);
    };

    // #endregion


    // #region Breasts

    self.getBreastName = function (index) {

        const b = self.selectedCharacter().obj.breastRows()[index()];

        if (b) {
            const count = +b.breasts();
            const rating = +b.breastRatingRaw() + +b.breastRatingMod() + +b.breastRatingLactationMod() + +b.breastRatingHoneypotMod();
            return `${count} ${util.getCupSize(rating)} breast${(count > 1 ? 's' : '')}`;
        }

    };

    self.addBreastRow = function () {
        self.selectedCharacter().obj.breastRows.push(ko.mapping.fromJS(new BreastRow()));
    };

    self.removeBreastRow = function (data) {
        self.selectedCharacter().obj.breastRows.remove(data);
    };

    // #endregion


    // #endregion

};


var SaveViewModel = function (data) {
    var self = this;
    ko.mapping.fromJS(data, loadMapping, self);
};


function koInit() {

    // Custom handler to write actual numbers and not strings when needed
    ko.bindingHandlers.numberInput = {

        init: function (element, valueAccessor, allBindings) {

            var interceptor = ko.computed({
                owner: this,
                read: valueAccessor,
                write: function (value) {
                    valueAccessor()(+value);
                }
            });

            ko.bindingHandlers.textInput.init(element, function () {
                return interceptor;
            }, allBindings);
        },

        update: function (element, valueAccessor) {
            element.value = valueAccessor()();
        }

    };

}