/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

class StorageContainer {

    constructor(source, obj, key, hasFunc, hasTooltip) {

        this.root = document.createElement('div');
        this.root.className = 'text-light my-3 w-100';
        this.root.dataset.bind = `foreach: $root.${source}`;

        const header = document.createElement('div');
        header.className = 'form-check form-switch mt-4';

        const checkBox = document.createElement('input');
        checkBox.type = 'checkbox';
        checkBox.role = 'switch';
        checkBox.className = 'form-check-input storage-switch';
        checkBox.setAttribute('disabled', true);
        checkBox.dataset.bind = 'checked: $root.' + obj + (obj ? '.' : '') + key + `,
                                 checkedValue: $data,
                                 enable: $root.saveLoaded`;

        const lblName = document.createElement('label');
        lblName.className = 'form-check-label';
        lblName.dataset.bind = `text: storageName,
                                class: $root.${hasFunc}($data, 'statusEffects') ? 'fw-bold' : ''`;

        const pToolTip = document.createElement('p');
        pToolTip.className = 'p-sm';
        pToolTip.dataset.bind = `text: $data.tooltip,
                                 class: $root.${hasFunc}($data, 'statusEffects') ? 'fw-bold' : 'text-muted'`;

        const btnEdit = document.createElement('i');
        btnEdit.className = 'fa-solid fa-pen-to-square ms-3';
        btnEdit.role = 'button';
        btnEdit.dataset.bind = 'click: function(data) { $root.a(data) }';

        header.appendChild(checkBox);
        header.appendChild(lblName);
        util.appendKoIfBlock(header, btnEdit, `$root.${hasFunc}($data, 'statusEffects')`);

        this.root.appendChild(header);
        hasTooltip && util.appendKoIfBlock(this.root, pToolTip, `$root.${hasTooltip}($data)`);
        //this.root.appendChild(pToolTip);

        return this.root;

    }

}

class PerkContainer extends StorageContainer {

    constructor(obj, key) {

        super('getPerks', obj, key, 'hasPerk');

        //this.root = document.createElement('div');
        //this.root.className = 'text-light my-3 w-100 editor-perk';
        //this.root.dataset.bind = 'foreach: getPerks()';

        //const container = document.createElement('div');
        //container.className = 'form-check form-switch mt-4';

        //const checkBox = document.createElement('input');
        //checkBox.type = 'checkbox';
        //checkBox.role = 'switch';
        //checkBox.className = 'form-check-input storage-switch';
        //checkBox.setAttribute('disabled', true);
        //checkBox.dataset.bind = `checked: $root.` + obj + (obj ? '.' : '') + key + `,
        //                         checkedValue: $data,
        //                         enable: $root.saveLoaded`;

        //const perkName = document.createElement('label');
        //perkName.className = 'form-check-label';
        //perkName.dataset.bind = 'text: storageName';

        //const perkDescription = document.createElement('p');
        //perkDescription.className = 'p-sm';
        //perkDescription.dataset.bind = "text: $data.tooltip, class: $root.hasPerk($data) ? '' : 'text-muted' ";

        //const dataContainer = document.createElement('div');
        //dataContainer.className = 'ps-2';
        //dataContainer.style.marginTop = '-8px';
        //dataContainer.dataset.bind = 'visible: $root.hasPerk($data)';
        //const dataToggle = document.createElement('button');
        //dataToggle.className = 'btn btn-sm btn-xs btn-outline-light'
        ////valueVisibilityToggle.innerHTML = '<i class="fa-solid fa-up-right-and-down-left-from-center"></i> Toggle Data';
        //dataToggle.textContent = 'Toggle Data';
        //dataToggle.type = 'button';
        //dataToggle.dataset.bind = 'click: $root.expandStorage';
        //dataToggle.dataset.toggle = 'collapse';
        //dataContainer.appendChild(dataToggle);

        //const dataCollapse = document.createElement('div');
        //dataCollapse.className = 'mt-2 collapse';
        //const dataBody = document.createElement('div');
        //dataBody.className = 'd-flex flex-wrap';

        //for (var i = 1; i < 5; i++) {
        //    dataBody.appendChild(createStorageField('Value ' + i, 'value' + i, 'numberInput'));


        //    //const div = document.createElement('div');
        //    //div.className = 'w-50 px-1';

        //    //const label = document.createElement('label');
        //    //label.className = 'label-sm';
        //    //label.textContent = 'Value ' + i;

        //    //const input = document.createElement('input');
        //    //input.className = 'form-control form-control-sm';
        //    //input.disabled = true;
        //    //input.dataset.bind = 'numberInput: $data.value' + i + ' , enable: $root.saveLoaded';

        //    //div.appendChild(label);
        //    //div.appendChild(input);

        //    //dataBody.appendChild(div);
        //}

        //dataCollapse.appendChild(dataBody);
        //dataContainer.appendChild(dataCollapse);

        //container.appendChild(checkBox);
        //container.appendChild(perkName);

        //this.root.appendChild(container);
        //this.root.appendChild(perkDescription);
        //this.root.appendChild(dataContainer);

        //return this.root;
    }

}

class StatusEffectContainer extends StorageContainer {

    constructor(obj, key) {

        //dataFields.push(createStorageField('Minutes Left', 'minutesLeft', 'numberInput'));
        //dataFields.push(createStorageField('Icon Name', 'iconName', 'textInput'));
        //dataFields.push(createStorageField('Icon Shade', 'iconShade', 'textInput'));
        super('statusEffectList', obj, key, 'hasStorage', 'hasStorageTooltip');

        //dataFields.push(createStorageField('Minutes Left', 'minutesLeft'));
        //dataFields.push(createStorageField('Minutes Left', 'minutesLeft'));

        //this.root = document.createElement('div');
        //this.root.className = 'text-light my-3 w-100 editor-perk';
        //this.root.dataset.bind = 'foreach: getStatusEffects()';

        //const container = document.createElement('div');
        //container.className = 'form-check form-switch mt-4';

        //const checkBox = document.createElement('input');
        //checkBox.type = 'checkbox';
        //checkBox.role = 'switch';
        //checkBox.className = 'form-check-input storage-switch';
        //checkBox.setAttribute('disabled', true);
        //checkBox.dataset.bind = `checked: $root.` + obj + (obj ? '.' : '') + key + `,
        //                         checkedValue: $data,
        //                         enable: $root.saveLoaded`;

        //const chkLabel = document.createElement('label');
        //chkLabel.className = 'form-check-label';
        //chkLabel.dataset.bind = 'text: storageName';

        //const seDesc = document.createElement('p');
        ////seDesc.dataset.bind = "text: $data.tooltip, class: $root.hasPerk($data) ? '' : 'text-muted' ";
        //seDesc.dataset.bind = "text: $data.tooltip";

        ////const valueContainer = document.createElement('div');
        ////valueContainer.dataset.bind = 'visible: $root.hasPerk($data)';
        ////for (var i = 1; i < 5; i++) {
        ////    var div = document.createElement('div');

        ////    var label = document.createElement('label');
        ////    label.className = 'label-sm';
        ////    label.textContent = 'Value ' + i;

        ////    var inputWrapper = document.createElement('div');
        ////    inputWrapper.className = 'input-group input-group-sm';
        ////    var input = document.createElement('input');
        ////    input.className = 'form-control form-control-sm';
        ////    input.setAttribute('disabled', true);
        ////    input.dataset.bind = 'value: $data.value' + i + ' , enable: $root.isEnabled';
        ////    inputWrapper.appendChild(input);

        ////    div.appendChild(label);
        ////    div.appendChild(inputWrapper);

        ////    valueContainer.appendChild(div);
        ////}

        //container.appendChild(checkBox);
        //container.appendChild(chkLabel);

        //this.root.appendChild(container);
        //this.root.appendChild(seDesc);
        ////this.content.appendChild(valueContainer);

        //return this.root;
    }

}

class FlagContainer {

    constructor() {
        this.root = document.createElement('div');

        this.body = document.createElement('div');
        //this.body = document.createElement('table');
        this.body.dataset.bind = 'foreach: $root.save.flags.items';

        //this.flagItem = document.createElement('tr');
        this.flagItem = document.createElement('div');
        this.flagItem.className = 'row g-0';

        this.row = document.createElement('tr');

        //this.flagNameContainer = document.createElement('td');
        this.flagNameContainer = document.createElement('div');
        this.flagNameContainer.className = 'col-6';
        this.flagNameContainer.dataset.bind = 'text: key';
        //this.flagName = document.createElement('p');
        //this.flagName.dataset.bind = 'text: key';
        //this.flagNameContainer.appendChild(this.flagName);

        //this.flagValueContainer = document.createElement('td');
        this.flagValueContainer = document.createElement('div');
        this.flagValueContainer.className = 'col-6';
        this.flagValue = document.createElement('input');
        this.flagValue.type = 'text';
        this.flagValue.className = 'form-control form-control-sm';
        //this.flagValue.disabled = true;
        //this.flagValue.dataset.bind = 'value: value, enable: $root.isEnabled';
        this.flagValue.dataset.bind = 'value: value';
        this.flagValueContainer.appendChild(this.flagValue);

        this.flagItem.appendChild(this.flagNameContainer);
        this.flagItem.appendChild(this.flagValueContainer);

        //this.flagItem.appendChild(this.row);
        //this.flagItem.appendChild(this.flagNameContainer);
        //this.flagItem.appendChild(this.flagValueContainer);

        this.body.appendChild(this.flagItem);
        this.root.appendChild(this.body);

        return this.root;

        //this.root = document.createElement('div');

        //this.body = document.createElement('div');
        //this.body.dataset.bind = 'foreach: $root.getFlags()';

        //this.flagName = document.createElement('p');
        //this.flagName.dataset.bind = 'text: $data';

        //this.body.appendChild(this.flagName);
        //this.root.appendChild(this.body);

        //return this.root;
    }

}

function createStorageField(labelText, key, bindingType) {
    const div = document.createElement('div');
    div.className = 'w-50 px-1';

    const label = document.createElement('label');
    label.className = 'label-sm';
    label.textContent = labelText;

    const input = document.createElement('input');
    input.className = 'form-control form-control-sm';
    input.disabled = true;
    if (bindingType === 'numberInput') {
        input.type = 'number';
    }

    input.dataset.bind = bindingType + ': $data.' + key + ' , enable: $root.saveLoaded';

    div.appendChild(label);
    div.appendChild(input);

    return div;
}