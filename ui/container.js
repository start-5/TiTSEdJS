/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

class StorageContainer {

    constructor(obj, key, bindingSource, fields) {

        this.root = document.createElement('div');
        this.root.className = 'text-light my-3 w-100';
        this.root.dataset.bind = `foreach: $root.${bindingSource}`;

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

        const hasFunc = `$root.hasStorage($data, '${key}')`;

        const lblName = document.createElement('label');
        lblName.className = 'form-check-label';
        lblName.dataset.bind = `text: storageName,
                                class: ${hasFunc} ? 'fw-bold' : ''`;

        const pToolTip = document.createElement('p');
        pToolTip.className = 'p-sm';
        pToolTip.dataset.bind = `text: $data.tooltip,
                                 class: ${hasFunc} ? '' : 'text-muted'`;

        const btnEdit = document.createElement('i');
        btnEdit.className = 'fa-solid fa-pen-to-square ms-3';
        btnEdit.role = 'button';
        btnEdit.dataset.bind = `click: (storage, fields) => $root.selectStorage($data, ${JSON.stringify(fields)})`;

        header.appendChild(checkBox);
        header.appendChild(lblName);
        util.appendKoIfBlock(header, btnEdit, hasFunc);

        this.root.appendChild(header);
        util.appendKoIfBlock(this.root, pToolTip, '$root.hasStorageTooltip($data)');

        return this.root;

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