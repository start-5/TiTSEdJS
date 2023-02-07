window.loadMapping = {
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
}

var ViewModel = function (data) {
    var self = this;

    self.saveLoaded = ko.observable(false);
    self.busy = ko.observable(false);

    self.saveName = ko.observable('');
    self.originalSaveName = ko.observable('');

    self.save = {};
    ko.mapping.fromJS(data, loadMapping, self.save);

    self.getGlobal = function (path) {
        var obj = GlobalKeys;
        for (var i = 0, path = path.split('.'), len = path.length; i < len; i++) {
            obj = obj[path[i]];
        };
        return obj;
    };

    // #region Character
    self.selectedCharacter = ko.observable();

    self.chars = ko.computed(function () {
        return Object.keys(self.save.characters).map(key => ({
            name: key,
            obj: self.save.characters[key]
        }));
    }, self);

    self.isPC = ko.computed(function () {
        return self.selectedCharacter() && self.selectedCharacter().name == 'PC';
    }, self);
    // #endregion

    // #region Perks
    self.getPerks = function () {
        if (self.selectedCharacter()) {
            // two things are happening here, one, ensuring that characters don't have objcts that reference each other,
            // second, adding any unknown storage to the pool, i haven't found a better way to do this yet

            let vmPerks = ko.mapping.fromJS(ko.mapping.toJS(self.perkList));
            let charPerks = self.selectedCharacter().obj.perks;

            for (var i = 0; i < charPerks().length; i++) {
                let perk = vmPerks().find(p => p.storageName() === charPerks()[i].storageName());
                if (!perk) {
                    let cPerk = ko.mapping.fromJS(ko.mapping.toJS(charPerks()[i]));
                    for (var idx = 1; idx < 5; idx++) {
                        cPerk['value' + idx](0);
                    }
                    self.perkList.push(cPerk);
                }
                vmPerks.remove(p => p.storageName() === charPerks()[i].storageName());
            }

            return charPerks().concat(vmPerks()).sort((p1, p2) => p1.storageName().localeCompare(p2.storageName()));
        }
    }

    self.perkList = ko.mapping.fromJS(Perks);

    self.hasPerk = function (data) {
        return self.selectedCharacter().obj.perks().includes(data);
    }
    // #endregion

    // #region Status Effects
    self.getStatusEffects = function () {
        if (self.selectedCharacter()) {
            // two things are happening here, one, ensuring that characters don't have objcts that reference each other,
            // second, adding any unknown storage to the pool, i haven't found a better way to do this yet

            let vmStatusEffects = ko.mapping.fromJS(ko.mapping.toJS(self.statusEffectList));
            let charStatusEffects = self.selectedCharacter().obj.statusEffects;

            for (var i = 0; i < charStatusEffects().length; i++) {
                let statusEffect = vmStatusEffects().find(p => p.storageName() === charStatusEffects()[i].storageName());
                if (!statusEffect) {
                    let sEffect = ko.mapping.fromJS(ko.mapping.toJS(charStatusEffects()[i]));
                    for (var idx = 1; idx < 5; idx++) {
                        sEffect['value' + idx](0);
                    }
                    sEffect.minutesLeft(0);
                    self.statusEffectList.push(sEffect);
                }
                vmStatusEffects.remove(p => p.storageName() === charStatusEffects()[i].storageName());
            }

            return charStatusEffects().concat(vmStatusEffects()).sort((s1, s2) => s1.storageName().localeCompare(s2.storageName()));
        }
    }

    self.statusEffectList = ko.mapping.fromJS(StatusEffects);

    self.hasStatusEffect = function (data) {
        return self.selectedCharacter().obj.statusEffects().includes(data);
    }
    // #endregion

    self.expandStorage = function (data, event) {
        $(event.target).next().collapse('toggle');
    }

    // #region OnChanged
    self.nameChanged = function (data, event) {
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
    }

    self.emailChanged = function (data, event) {
        const email = event.target.value;
        const mailObj = self.save.mailState.mails;

        for (const [key] of Object.entries(mailObj)) {
            const mail = mailObj[key];
            if (mail.hasOwnProperty('ToAddressCache')) {
                mail['ToAddressCache'] = email + '@SteeleTech.corp';
            }
        }
    }
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
    }
    // #endregion

    // #region Arrays
    self.getPenisName = function (index) {
        const i = self.selectedCharacter().obj.cocks()[index()];
        const color = i.cockColor();
        const len = +i.cLengthRaw() + +i.cLengthMod();
        const type = GlobalKeys.BodyType.find(t => t.value == i.cType()).name.toLowerCase();
        return 'a ' + color + ' ' + len + '" ' + type + ' penis';
    }

    self.addPenis = function () {
        self.selectedCharacter().obj.cocks.push(ko.mapping.fromJS(new Cock()));
    }

    self.removePenis = function (data) {
        self.selectedCharacter().obj.cocks.remove(data);
    }

    self.getVaginaName = function (index) {
        const i = self.selectedCharacter().obj.vaginas()[index()];
        const color = i.vaginaColor();
        const type = GlobalKeys.BodyType.find(t => t.value == i.type()).name.toLowerCase();
        return 'a ' + color + ' ' + type + ' vagina';
    }

    self.addVagina = function () {
        self.selectedCharacter().obj.vaginas.push(ko.mapping.fromJS(new Vagina()));
    }

    self.removeVagina = function (data) {
        self.selectedCharacter().obj.vaginas.remove(data);
    }

    self.getBreastName = function (index) {
        const i = self.selectedCharacter().obj.breastRows()[index()];
        const count = +i.breasts();
        const rating = +i.breastRatingRaw() + +i.breastRatingMod();
        return count + ' ' + getCupSize(rating) + ' breast' + (count > 1 ? 's' : '');
    }

    self.addBreastRow = function () {
        self.selectedCharacter().obj.breastRows.push(ko.mapping.fromJS(new BreastRow()));
    }

    self.removeBreastRow = function (data) {
        self.selectedCharacter().obj.breastRows.remove(data);
    }
    // #endregion
}


// custom handler to write actual numbers and not strings when needed
ko.bindingHandlers.numberInput = {
    init: function (element, valueAccessor, allBindingsAccessor) {
        var underlyingObservable = valueAccessor();

        var interceptor = ko.pureComputed({
            read: underlyingObservable,
            write: function (value) {
                underlyingObservable(+value);
            },
            owner: this
        });

        ko.bindingHandlers.textInput.init(element, function () {
            return interceptor
        }, allBindingsAccessor);
    },
    update: function (element, valueAccessor, allBindingsAccessor) {
        element.value = valueAccessor()();
    }
};