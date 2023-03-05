/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */


/**
* An editor tab 
*/
class Tab {

    /**
    * Creates a tab with the specified rows
    * @param {Array<Row>} rows
    */
    constructor(rows) {

        /**
        * Contains all the tab content
        * @type {HTMLDivElement}
        */
        this.content = document.createElement('div');

        /**
        * Contains all the tab's rows
        * @type {Array<Row>}
        */
        this.rows = rows;

    }

    /**
    * Returns the tab and all its content
    */
    build() {

        if (this.rows.length) {
            this.rows.forEach(row => {
                this.content.appendChild(row.build());
            });
        }

        return this.content;

    }

}


/**
* An editor row
*/
class Row {

    /**
    * Creates a row with the specified groups
    * @param {Array<Group>} groups
    */
    constructor(groups) {

        /**
        * Contains all the row content
        * @type {HTMLDivElement}
        */
        this.content = document.createElement('div');
        this.content.classList.add('row', 'g-0');

        /**
        * Contains all the rows's groups
        * @type {Array<Group>}
        */
        this.groups = groups;

    }

    /**
    * Returns the row and all its content
    */
    build() {

        if (this.groups.length) {
            this.groups.forEach(group => {

                const groupContent = group.build();

                groupContent.classList.add(`col-sm-${12 / this.groups.length}`);

                this.content.appendChild(groupContent);

            });
        }

        return this.content;

    }

}


/**
* An editor group
*/
class Group {

    /**
    * Creates an editor group with the specified title and fields
    * @param {string} titleText
    * @param {Array<Field>} fields
    */
    constructor(titleText, fields) {

        /**
        * Contains all the group content
        * @type {HTMLDivElement}
        */
        this.content = document.createElement('div');
        this.content.classList.add('px-3', 'my-3');

        /**
        * The group's header
        * @type {HTMLHeadingElement}
        */
        this.header = document.createElement('h3');
        this.header.textContent = titleText;

        /**
        * Contains all the group's fields
        * @type {Array<Field>}
        */
        this.fields = fields;

    }

    /**
    * Returns the group and all its content
    */
    build() {

        if (this.header.textContent) {

            const hr = document.createElement('hr');

            this.content.appendChild(this.header);
            this.content.appendChild(hr);
        }

        if (this.fields.length) {
            for (var i = 0; i < this.fields.length; i++) {

                const field = this.fields[i];

                if (i === 0) {
                    field.content.classList.add('pt-0');
                }

                this.content.appendChild(field.build());

            }

            this.fields.forEach(field => {
                this.content.appendChild(field.build());
            });
        }

        return this.content;

    }
}


/**
* An editor array group
*/
class ArrayGroup extends Group {

    /**
    * Creates an editor array group with the specified title, add func and fields
    * @param {string} titleText
    * @param {string} koAdd
    * @param {Array<Field>} fields
    */
    constructor(titleText, koAdd, fields) {

        super(titleText, fields);

        /**
        * The array group's add button
        * @type {HTMLButtonElement}
        */
        this.btnAdd = document.createElement('button');
        this.btnAdd.innerHTML = 'Add <i class="fa-solid fa-plus"></i>';
        this.btnAdd.type = 'button';
        this.btnAdd.disabled = true;
        this.btnAdd.classList.add('btn', 'btn-success', 'btn-sm', 'float-end', 'text-white');
        util.setKoBinding(this.btnAdd, 'click', `$root.${koAdd}`);
        util.setKoBinding(this.btnAdd, 'enable', '$root.saveLoaded');

        this.header.appendChild(this.btnAdd);
    }

}


/**
* An editor nested group to display fields in two columns
*/
class NestedGroup extends Group {

    /**
    * Creates an editor nested group with the specified fields
    * @param {string} titleText
    * @param {Array<Field>} fields
    */
    constructor(fields) {

        if (fields.length > 2) {
            throw new Error('NestedGroup with more than two columns is not implemented');
        }

        super('', fields);

        this.content.classList.add('row', 'g-0');
        this.content.classList.remove('px-3');

    }

    build() {

        if (this.fields.length) {

            for (var i = 0; i < this.fields.length; i++) {

                const field = this.fields[i];

                field.content.classList.remove('my-3');
                field.content.classList.add(i === 0 ? 'pe-2' : 'ps-2');
                field.content.classList.add('col-6');

            }

            this.content.classList.add('my-3');
        }

        return super.build();

    }

}