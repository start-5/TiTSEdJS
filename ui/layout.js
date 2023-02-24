class Tab {
    constructor(rows) {
        this.root = document.createElement('div');

        if (rows.length) {
            rows.forEach(r => this.root.appendChild(r));
        }

        return this.root;
    }
}

class Row {
    constructor(groups) {
        this.root = document.createElement('div');
        this.root.className = 'row py-3 mb-2 g-0';

        if (groups.length) {
            groups.forEach(g => {
                g.className += ' col-sm-' + 12 / groups.length + ' px-3';
                this.root.appendChild(g)
            });
        }

        return this.root;
    }
}

class Group {
    constructor(titleText, fields, ret = true) {
        this.root = document.createElement('div');

        this.titleElement = document.createElement('h3');
        this.titleElement.textContent = titleText;
        const hr = document.createElement('hr');
        this.root.appendChild(this.titleElement);
        this.root.appendChild(hr);

        if (fields.length) {
            fields.forEach(f => { this.root.appendChild(f); });
        }

        if (ret) {
            return this.root;
        }
    }
}

class ArrayGroup extends Group {
    constructor(titleText, func, fields) {
        super(titleText, fields, false);
        this.addButton = document.createElement('button');
        this.addButton.innerHTML = 'Add <i class="fa-solid fa-plus"></i>';
        this.addButton.type = 'button';
        this.addButton.disabled = true;
        this.addButton.className = 'btn btn-success btn-sm float-end text-white';
        this.addButton.dataset.bind = 'click: $root.' + func + ', enable: $root.saveLoaded';
        this.titleElement.appendChild(this.addButton);

        return this.root;
    }
}

class NestedGroup {
    constructor(titleText, fields) {
        this.root = document.createElement('div');
        this.root.className = 'row g-0 nested-group';

        if (titleText) {
            const titleElement = document.createElement('h5');
            titleElement.textContent = titleText;
            const hr = document.createElement('hr');
            this.root.appendChild(titleElement);
            this.root.appendChild(hr);
        }

        if (fields.length) {
            fields.forEach(f => {
                f.className += ' col-6 px-1';
                this.root.appendChild(f);
            });
        }

        return this.root;
    }
}