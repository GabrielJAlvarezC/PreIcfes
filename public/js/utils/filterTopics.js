export class Filter {
    static addOption(domElement, dict) {
        Object.keys(dict).forEach( el => {
            const option = document.createElement('option');
            option.text = dict[el];
            domElement.add(option);
        })
    }
    static removeOptions(domElement) {
        if (domElement.options) {
            [...domElement.options].forEach( el => domElement.remove(el));
        }
    }
    static createDatalist(domElement, dict, title) {
        const label = document.createElement('label');
        const input = document.createElement('input');
        const datalist = document.createElement('datalist');

        label.for = input.list = datalist.id = title;

        Object.keys(dict).forEach( el => domElement.appendChild(addOption(dict[el])));

        domElement.insertAdjacentElement('afterend', label);
        label.insertAdjacentElement('afterend', input);
        input.insertAdjacentElement('afterend', datalist);
    }
}