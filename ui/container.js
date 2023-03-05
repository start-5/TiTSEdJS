/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */


/**
* A StorageClass array editor
*/
class StorageContainer {

    /**
    * Creates an editor StorageClass array editor
    * @param {string} root The root object to modify
    * @param {string} key The object key to modify
    * @param {string} bindingSource The KO object to build the list from
    * @param {Array<string>} fields The list of fields that can be edited on the storage popup
    */
    constructor(root, key, bindingSource, fields) {

        const koHas = `$root.hasStorage($data, '${key}')`;


        /**
        * Contains all the container content
        * @type {HTMLDivElement}
        */
        this.content = document.createElement('div');
        this.content.classList.add('text-light', 'my-3', 'w-100');
        util.setKoBinding(this.content, 'foreach', `$root.${bindingSource}`);


        /**
        * Holds the foreach template
        * @type {HTMLDivElement}
        */
        this.templateContainer = document.createElement('div');
        this.templateContainer.classList.add('form-check', 'form-switch', 'mt-4');


        /**
        * Templated checkbox
        * @type {HTMLInputElement}
        */
        this.templateCheckbox = document.createElement('input');
        this.templateCheckbox.type = 'checkbox';
        this.templateCheckbox.role = 'switch';
        this.templateCheckbox.classList.add('form-check-input', 'storage-switch');
        this.templateCheckbox.setAttribute('disabled', true);
        util.setKoBinding(this.templateCheckbox, 'checked', `$root.${util.getObjPath(root, key)}`);
        util.setKoBinding(this.templateCheckbox, 'checkedValue', '$data');
        util.setKoBinding(this.templateCheckbox, 'enable', '$root.saveLoaded');


        /**
        * Templated checkbox label (StorageName)
        * @type {HTMLLabelElement}
        */
        this.templateCheckboxLabel = document.createElement('label');
        this.templateCheckboxLabel.classList.add('form-check-label');
        util.setKoBinding(this.templateCheckboxLabel, 'text', 'storageName');
        util.setKoBinding(this.templateCheckboxLabel, 'class', `${koHas} ? 'fw-bold' : ''`);


        // I don't think it'd be a good idea to use the storageName as an id because
        // it might contain spaces and other weird characters so it'll use its index instead
        util.setKoBinding(this.templateCheckbox, 'attr', `{ 'id': 'edit-${key}-' + $index() }`);
        util.setKoBinding(this.templateCheckboxLabel, 'attr', `{ 'for': 'edit-${key}-' + $index() }`);


        /**
        * Templated paragraph (Tooltip)
        * @type {HTMLParagraphElement}
        */
        this.templateTooltip = document.createElement('p');
        this.templateTooltip.classList.add('p-sm');
        util.setKoBinding(this.templateTooltip, 'text', 'tooltip');
        util.setKoBinding(this.templateTooltip, 'class', `${koHas} ? '' : 'text-muted'`);


        /**
        * Templated edit button
        * @type {HTMLButtonElement}
        */
        this.templateBtnEdit = document.createElement('button');
        this.templateBtnEdit.type = 'button';
        this.templateBtnEdit.title = 'Edit storage data';
        this.templateBtnEdit.innerHTML = '<i class="fa-solid fa-pen-to-square"></i>';
        this.templateBtnEdit.classList.add('btn', 'btn-sm', 'btn-secondary', 'ms-2', 'px-1', 'py-0');
        util.setKoBinding(this.templateBtnEdit, 'click', `(storage, fields) => $root.selectStorage($data, ${JSON.stringify(fields)})`);


        this.templateContainer.appendChild(this.templateCheckbox);
        this.templateContainer.appendChild(this.templateCheckboxLabel);
        util.appendKoIfBlock(this.templateContainer, this.templateBtnEdit, koHas);

        this.content.appendChild(this.templateContainer);
        util.appendKoIfBlock(this.content, this.templateTooltip, '$root.hasStorageTooltip($data)');

    }

    /**
    * Returns the container and all its content
    */
    build() {
        return this.content;
    }

}