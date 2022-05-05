import searcher from './searcher.js';
import toDo from './toDo.js';

const app = {
    ixComponents: [
        {
            searcherButton: {
                element: '.search-button',
                function: searcher.render
            }
        },
        {
            clearAll: {
                element: '.clear-all',
                function: toDo.clearAll
            }
        }, {
            inputButton: {
                element: '#input-button',
                function: toDo.save
            }
        }
    ],
    findComponent(objToAdd, key) {
        for (let i = 0; i < Object.keys(objToAdd).length; i++) {
            let fooName = Object.keys(objToAdd)[i];
            let fooObj = objToAdd[fooName];
            if (fooName === key) return fooObj;
        }
    },
    addFunctionToEl(componentsArr, isOne) {
        componentsArr.forEach(component => {
            let action = component[Object.keys(component)]['function'];
            if (isOne) {
                let element = document.querySelector(component[Object.keys(component)]['element']);
                element.addEventListener('click', action);
            }
            else {
                let elements = document.querySelectorAll(component[Object.keys(component)]['element']);
                elements.forEach(el => {
                    el.addEventListener('click', action);
                })
            }
        })
    },
    closeModal() {
        let ref;
        if (this === undefined || this.id || this.classList) ref = app;
        else ref = this;

        if (ref.mainContainer.children.length > 1) {
            ref.mainContainer.removeChild(document.getElementsByClassName('alert-opacity')[0]);
            document.querySelectorAll('input')[0].focus();
        } else {
            console.log('No modal to close')
        }
    },
    modal(msg) {
        let ref;
        if (this === undefined || this.id || this.classList) ref = app;
        else ref = this;

        ref.closeModal();
        let alert = `<div class="alert-opacity">
                            <div class="alert-container">
                                <span id="msg">${msg}</span>
                                <div id="modal-button-container" class="alert-button-row">
                                    <button id="ok-button" type="button">OK</button>
                                </div>
                            </div>
                        </div>`
        document.querySelectorAll('input')[0].blur();
        if (ref.mainContainer.children.length === 1) {
            ref.mainContainer.insertAdjacentHTML('beforeend', alert);
        } else {
            ref.mainContainer.removeChild(document.getElementsByClassName('alert-opacity')[0]);
            setTimeout(() => {
                ref.mainContainer.insertAdjacentHTML('beforeend', alert);
            }, 50)
        }

        let components = app.findComponent(ixComponentsTD, 'modal');
        app.addFunctionToEl(components, true);

        if ((document.querySelector('#ok-button') !== null)) {
            setTimeout(() => {
                document.onkeyup = (e) => { if (e.key === 'Enter') ref.closeModal() }
            }, 500);
            document.onkeyup = null;
        }
        else return false;
    },
    capitalize(string) {
        let capitalizedArr = [];
        for (let i = 0; i < string.length; i++) {
            let letter = string[i];
            if (i === 0) {
                letter = letter.toUpperCase();
            }
            capitalizedArr.push(letter);
        }
        return capitalizedArr.toString().split(',').join('');
    },
    focus() {
        let toDoInput = document.getElementById('todo-input');
        toDoInput.focus();
        toDoInput.onkeyup = (e) => {
            if (e.key === 'Enter') toDo.save();
        }
    },
    setIndex(id, arr) {
        let index = arr.findIndex(arrItem => arrItem.id === id);
        return index
    },
    findInput(id) {
        let inputs = document.getElementsByClassName('update-input');
        for (let input of inputs) {
            let inputId = input.id;
            inputId = parseInt(inputId.split('-')[2]);
            if (inputId == id) {
                return input
            } else {
                return 'Something went wrong'
            }
        }
    },
    mainContainer: document.getElementsByClassName('wrapper')[0],
    init() {
        let ref;
        if (this === undefined || this.id || this.classList) ref = app;
        else ref = this;

        ref.addFunctionToEl(ref.ixComponents, true);
        ref.focus();
    }
}

const ixComponentsTD = {
    create: [{
        status: {
            element: '.status',
            function: (e) => toDo.updateStatus(parseInt(e.target.id.split('-')[1]))
        }
    },
    {
        updateIcon: {
            element: '.update-icon',
            function: (e) => toDo.update(parseInt(e.target.id.split('-')[1]))
        }
    }, {
        eraseIcon: {
            element: '.erase-icon',
            function: (e) => toDo.erase(parseInt(e.target.id.split('-')[1]))
        }
    }],
    askConfirmation: [{
        changeVal: {
            element: '.changeVal-button',
            function: (e) => toDo.changeTaskValue(parseInt(e.target.id.split('-')[1]))
        }
    },
    {
        cancelUd: {
            element: '.cancelUd-button',
            function: (e) => toDo.cancelUpdate(parseInt(e.target.id.split('-')[1]))
        }
    }],
    enableUpdate: [{
        checkIcon: {
            element: '.check-icon',
            function: (e) => toDo.askConfirmation(parseInt(e.target.id.split('-')[1]))
        }
    }],
    update: [{
        updateIcon: {
            element: '.update-icon',
            function: (e) => toDo.update(parseInt(e.target.id.split('-')[1]))
        }
    }],
    render: [{
        searcherCloseButton: {
            element: '.searcher-close-button',
            function: searcher.hide
        }
    }],
    hide: [{
        searchButton: {
            element: '.search-button',
            function: searcher.render
        }
    }],
    modal: [{
        okButton: {
            element: '#ok-button',
            function: app.closeModal
        }
    }]
}

export { app, ixComponentsTD };