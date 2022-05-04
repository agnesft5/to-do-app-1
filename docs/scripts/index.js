const toDo = {
    list: [],
    renderListFlag: false,
    listContainer: document.getElementById('list'),
    save() {
        let ref;
        if (this === undefined || this.id || this.classList) ref = toDo;
        else ref = this;

        let input = document.getElementById('todo-input');
        let inputVal = input.value;
        if (typeof inputVal === 'string' && inputVal !== '') {
            let taskId = 0;
            if (ref.list.length == 0) {
                taskId = 1;
            } else {
                taskId = ref.list.length + 1;
            }

            let todo = {
                id: taskId,
                task: `${inputVal.toLocaleLowerCase()}`,
                isDone: false,
            }
            ref.list.push(todo);

            console.log('Task added')
        } else {
            app.modal(`Impossible to add "${inputVal}", wrong input text`)
        }

        input.value = "";
        ref.render(ref.list);
    },
    create(element) {
        let ref;
        if (this === undefined || this.id || this.classList) ref = toDo;
        else ref = this;

        let task = app.capitalize(element.task)
        let taskOverflowWrap;
        if (task.includes(' ')) taskOverflowWrap = 'break-word';
        else taskOverflowWrap = 'anywhere';

        let status;
        if (element.isDone === false) status = 'status_undone';
        else status = 'status_done'

        let item = `<div class="item line">
                        <div class="item-status-col line">
                            <div id="status-${element.id}" class="status ${status}"></div>
                        </div>
                        <div class="item-task-col line">
                            <span id="task-${element.id}" class="task" style="overflow-wrap: ${taskOverflowWrap}">${task}</span>
                        </div>
                        <div class="item-icon-col line">
                            <i id="update-${element.id}" class="fa-solid fa-pencil update-icon"></i>
                        </div>
                        <div class="item-icon-col line">
                            <i id="erase-${element.id}" class="fa-solid fa-trash-can erase-icon"></i>
                        </div>
                    </div>`


        ref.listContainer.innerHTML += item

        let components = app.findComponent(ixComponentsTD, 'create');
        if (ref.list.length === 1) app.addFunctionToEl(components, true);
        else app.addFunctionToEl(components, false);
    },
    render(arrToRender) {
        let ref;
        if (this.id || this.classList) ref = toDo;
        else ref = this;

        ref.renderListFlag = true;
        searcher.checkSearcherRender(arrToRender);
        ref.listContainer.innerHTML = '';
        arrToRender.map((el) => ref.create(el))
        if (arrToRender.length > 0 && arrToRender === ref.list)
            document.getElementsByClassName('clear-all')[0].style.display = 'block';
        else document.getElementsByClassName('clear-all')[0].style.display = 'none';
    },
    clearAll() {
        let ref;
        if (this.id || this.classList) ref = toDo;
        else ref = this;

        ref.list = [];
        ref.render(ref.list);
    },
    erase(id) {
        let ref;
        if (this.id || this.classList) ref = toDo;
        else ref = this;

        let index = app.setIndex(id, ref.list)
        setTimeout(() => {
            ref.list.splice(index, 1);
            setTimeout(app.modal(`Task#${id} erased!`), 50);
            ref.render(ref.list);
            console.log('Task erased')
        }, 50);
    },
    updateStatus(id) {
        let ref;
        if (this === undefined || this.id || this.classList) ref = toDo;
        else ref = this;

        let index = app.setIndex(id, ref.list);
        console.log(id, ref.list)
        console.log(index)
        let statusDisplay = document.getElementsByClassName('status');
        let selDisplay;
        for (let display of statusDisplay) {
            if (parseInt(display.id.split('-')[1]) === id) {
                selDisplay = display;
            }
        }
        if (ref.list[index]['isDone'] === false) {
            ref.list[index]['isDone'] = true;
            selDisplay.classList.add('status_done');
            selDisplay.classList.remove('status_undone')
        } else {
            ref.list[index]['isDone'] = false;
            selDisplay.classList.add('status_undone');
            selDisplay.classList.remove('status_done')
        }

    },
    changeTaskValue(id) {
        let ref;
        if (this === undefined || this.id || this.classList) ref = toDo;
        else ref = this;

        let input = app.findInput(id);
        let index = app.setIndex(id, ref.list);
        let inputVal = input.value;
        if (typeof inputVal === 'string' && inputVal !== '') {
            ref.list[index]['task'] = inputVal;
            input.value = '';
            app.closeModal();
            setTimeout(ref.askConfirmation(id), app.modal(`Task#${id} updated!`), 50);
            ref.render(ref.list);
            console.log('Task updated')
        } else {
            app.modal(`Impossible to update task#${id}, wrong input text!`);
        }
    },
    cancelUpdate(id) {
        let ref;
        if (this === undefined || this.id || this.classList) ref = toDo;
        else ref = this;

        let input = app.findInput(id);
        if (input) {
            app.closeModal();
            ref.render(ref.list);
        } else {
            console.log('Something went wrong')
        }
    },
    askConfirmation(id) {
        let ref;
        if (this === undefined || this.id || this.classList) ref = toDo;
        else ref = this;

        app.modal(`Are you sure you want to change taks#${id}?`);
        document.getElementById('modal-button-container').innerHTML =
            `<button id="change-${id}" class="changeVal-button" type="button">Yes</button>
        <button id="cancel-${id}" class="cancelUd-button" type="button">Cancel</button>`

        let components = app.findComponent(ixComponentsTD, 'askConfirmation');
        if (ref.list.length === 1) app.addFunctionToEl(components, true);
        else app.addFunctionToEl(components, false);
    },
    enableUpdate(id) {
        let ref;
        if (this.id || this.classList) ref = toDo;
        else ref = this;

        let input = app.findInput(id);
        input.value = "";
        input.onkeyup = (e) => {
            if (e.key === 'Enter') ref.askConfirmation(id);
        }
        input.parentElement.parentElement.children[2].innerHTML = `<i id="check-${id}" class="fa-solid fa-check check-icon"></i>`;

        let components = app.findComponent(ixComponentsTD, 'enableUpdate');
        if (ref.list.length === 1) app.addFunctionToEl(components, true);
        else app.addFunctionToEl(components, false);

    },
    transformTask(task, id) {
        let ref;
        if (this === undefined || this.id || this.classList) ref = toDo;
        else ref = this;

        let taskContainer = task.parentElement;
        console.log(taskContainer)
        let oldTask = task.innerHTML;
        taskContainer.innerHTML = `<input id="update-input-${id}" class="update-input" type="text" value='${oldTask}' placeholder="${oldTask}" autocomplete="off">`;
        let updateInput = document.getElementById(`update-input-${id}`)
        updateInput.focus();
        updateInput.onfocus = ref.enableUpdate(id)
    },
    update(id) {
        let ref;
        if (this === undefined || this.id || this.classList) ref = toDo;
        else ref = this;

        console.log(id)

        let inputs = document.getElementsByClassName('update-input');
        for (let input of inputs) {
            if (input) {
                let inputId = parseInt(input.id.split('-')[2]);
                let inputIndex = app.setIndex(inputId, ref.list);
                input.parentElement.parentElement.getElementsByClassName('item-icon-col')[0].innerHTML = `<i class="fa-solid fa-pencil update_icon"></i>`;
                input.parentElement.innerHTML = `<span class="task">${ref.list[inputIndex]['task']}</span>`;

                let components = app.findComponent(ixComponentsTD, 'update');
                if (ref.list.length === 1) app.addFunctionToEl(components, true);
                else app.addFunctionToEl(components, false);
            }
        }

        let components = app.findComponent(ixComponentsTD, 'enableUpdate');
        if (ref.list.length === 1) app.addFunctionToEl(components, true);
        else app.addFunctionToEl(components, false);

        let taskToUpdate = document.getElementById(`task-${id}`);
        console.log(id, taskToUpdate)
        taskToUpdate.onclick = ref.transformTask(taskToUpdate, id);
    },
}

const searcher = {
    render() {
        let ref;
        if (this === undefined || this.id || this.classList) ref = searcher;
        else ref = this;

        let searcherContainer = app.mainContainer.getElementsByClassName('searcher-container')[0];
        document.getElementsByClassName('input-container')[0].style.visibility = 'hidden';
        document.getElementsByClassName('clear-all')[0].style.display = 'none';
        searcherContainer.innerHTML = `
                            <p class="searcher-close-button">Close searcher <i class="fa-solid fa-xmark"></i></p>
                        <div class="searcher-input-container">
                            <input class="searcher-input" type="text">
                            <p class="searcher-button"><i class="fa-solid fa-magnifying-glass"></i></p>
                        </div>`;

        let components = app.findComponent(ixComponentsTD, 'render');
        app.addFunctionToEl(components, true);
        document.querySelector('.searcher-input').focus();
        document.querySelector('.searcher-input').onfocus = ref.search();

    },
    hide() {
        let searcherContainer = app.mainContainer.getElementsByClassName('searcher-container')[0];
        searcherContainer.innerHTML = `<p class="search-button"><i class="fa-solid fa-magnifying-glass"></i> Search your task!</p>`
        document.getElementsByClassName('main-title')[0].innerText = 'TO DO LIST'
        document.getElementsByClassName('main-title')[0].style.color = 'cornflowerblue';
        document.getElementsByClassName('input-container')[0].style.visibility = 'visible';
        document.getElementsByClassName('clear-all')[0].style.display = 'none';
        toDo.listContainer.innerHTML = "";
        toDo.render(toDo.list);

        let components = app.findComponent(ixComponentsTD, 'hide');
        app.addFunctionToEl(components, true);
    },
    checkSearcherRender(arrToRender) {
        let ref;
        if (this === undefined || this.id || this.classList) ref = searcher;
        else ref = this;

        if (arrToRender === toDo.list) {
            let closeSearcherButton = document.getElementsByClassName('searcher-close-button')[0];
            if (closeSearcherButton) ref.hide();
        } else return true
    },
    find(data) {
        let cut = data.length;
        let suggestions = toDo.list.filter(todo => todo.task.slice(0, cut) === data);
        if (suggestions.length === 0 && data) setTimeout(app.modal(`Impossible to find ${data}`), 50);
        toDo.render(suggestions);

    },
    getData(e) {
        let ref;
        if (this === undefined || this.id || this.classList) ref = searcher;
        else ref = this;

        let userData = e.target.value;
        if (e.target.value) {
            document.getElementsByClassName('main-title')[0].innerText = 'SEARCHING YOUR TO DO...'
            document.getElementsByClassName('main-title')[0].style.color = 'indianred';
            ref.find(userData.toLowerCase());
        }
    },
    search() {
        let ref;
        if (this === undefined || this.id || this.classList) ref = searcher;
        else ref = this;

        console.log('hi')
        let searcherInput = document.getElementsByClassName('searcher-input')[0];
        searcherInput.onkeyup = (e) => {
            searcherInput.classList.add('focused-input');
            ref.getData(e);
        }
    }


}

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
        console.log(componentsArr)
        componentsArr.forEach(component => {
            console.log(component)
            let action = component[Object.keys(component)]['function'];
            if (isOne) {
                let element = document.querySelector(component[Object.keys(component)]['element']);
                console.log(element)
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
            function: () => toDo.cancelUpdate(parseInt(e.target.id.split('-')[1]))
        }
    }],
    enableUpdate: [{
        changeVal: {
            element: '.check-icon',
            function: (e) => toDo.askConfirmation(parseInt(e.target.id.split('-')[1]))
        }
    }],
    update: [{
        changeVal: {
            element: '.update-icon',
            function: (e) => toDo.update(parseInt(e.target.id.split('-')[1]))
        }
    }],
    render: [{
        changeVal: {
            element: '.searcher-close-button',
            function: searcher.hide
        }
    }],
    hide: [{
        changeVal: {
            element: '.search-button',
            function: searcher.render
        }
    }],
    modal: [{
        changeVal: {
            element: '#ok-button',
            function: app.closeModal
        }
    }]
}


app.init();