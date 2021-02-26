export class Filter {
    static addOptions(domElement, data) {
        data.forEach( el => {
            const option = document.createElement('option');
            option.text = el;
            option.classList.add('option');
            domElement.add(option);
        });
    }
    static removeOptions(domElement) {
        [...domElement.options].forEach( option => domElement.remove(option));
    }
}