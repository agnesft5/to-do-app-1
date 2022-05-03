const toDo = {
    list: [],
    renderListFlag: false,
    listContainer: document.getElementById('list'),
    save() {
        let ref;
        if (this.id || this.classList) ref = toDo;
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
        if (this.id || this.classList) ref = toDo;
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
                            <div id="status-${element.id}" class="status ${status}" onclick="toDo.updateStatus(${element.id})"></div>
                        </div>
                        <div class="item-task-col line">
                            <span id="task-${element.id}" class="task" style="overflow-wrap: ${taskOverflowWrap}">${task}</span>
                        </div>
                        <div class="item-icon-col line">
                            <i class="fa-solid fa-pencil update_icon" onclick="toDo.update(${element.id})"></i>
                        </div>
                        <div class="item-icon-col line">
                            <i class="fa-solid fa-trash-can erase-icon" onclick="toDo.erase(${element.id})"></i>
                        </div>
                    </div>`


        ref.listContainer.innerHTML += item
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
        if (this.id || this.classList) ref = toDo;
        else ref = this;

        let index = app.setIndex(id, toDo.list)
        let statusDisplay = document.getElementsByClassName('status');
        let selDisplay;
        for (display of statusDisplay) {
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
        if (this.id || this.classList) ref = toDo;
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
        if (this.id || this.classList) ref = toDo;
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
        if (this.id || this.classList) ref = toDo;
        else ref = this;

        app.modal(`Are you sure you want to change taks#${id}?`);
        document.getElementById('modal-button-container').innerHTML =
            `<button type="button" onclick="toDo.changeTaskValue(${id})">Yes</button>
        <button type="button" onclick="toDo.cancelUpdate(${id})">Cancel</button>`
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
        input.parentElement.parentElement.children[2].innerHTML = `<i class="fa-solid fa-check check-icon" onclick="toDo.askConfirmation(${id})"></i>`;
    },
    transformTask(task, id) {
        let ref;
        if (this.id || this.classList) ref = toDo;
        else ref = this;

        taskContainer = task.parentElement;
        let oldTask = task.innerHTML;
        taskContainer.innerHTML = `<input id="update-input-${id}" class="update-input" type="text" value='${oldTask}' placeholder="${oldTask}" autocomplete="off">`;
        let updateInput = document.getElementById(`update-input-${id}`)
        updateInput.focus();
        updateInput.onfocus = ref.enableUpdate(id)
    },
    update(id) {
        let ref;
        if (this.id || this.classList) ref = toDo;
        else ref = this;

        let inputs = document.getElementsByClassName('update-input');
        for (let input of inputs) {
            if (input) {
                let inputId = parseInt(input.id.split('-')[2]);
                let inputIndex = app.setIndex(inputId, ref.list);
                input.parentElement.parentElement.getElementsByClassName('item-icon-col')[0].innerHTML = `<i class="fa-solid fa-pencil update_icon" onclick="toDo.updateItem(${inputIndex})"></i>`;
                input.parentElement.innerHTML = `<span class="task">${ref.list[inputIndex]['task']}</span>`;
            }
        }
        let taskToUpdate = document.getElementById(`task-${id}`);
        taskToUpdate.onclick = this.transformTask(taskToUpdate, id);
    }
}

const searcher = {
    render() {
        let searcherContainer = app.mainContainer.getElementsByClassName('searcher-container')[0];
        document.getElementsByClassName('input-container')[0].style.visibility = 'hidden';
        document.getElementsByClassName('clear-all')[0].style.display = 'none';
        searcherContainer.innerHTML = `
                            <p class="searcher-close-button" onclick="searcher.hide()">Close searcher <i class="fa-solid fa-xmark"></i></p>
                        <div class="searcher-input-container">
                            <input class="searcher-input" onfocus="searcher.search()" type="text">
                            <p class="searcher-button"><i class="fa-solid fa-magnifying-glass"></i></p>
                        </div>`;
        document.getElementsByClassName('searcher-input')[0].focus();

    },
    hide() {
        let searcherContainer = app.mainContainer.getElementsByClassName('searcher-container')[0];
        searcherContainer.innerHTML = `<p class="search-button" onclick="searcher.render()"><i class="fa-solid fa-magnifying-glass"></i> Search your task!</p>`
        document.getElementsByClassName('main-title')[0].innerText = 'TO DO LIST'
        document.getElementsByClassName('main-title')[0].style.color = 'cornflowerblue';
        document.getElementsByClassName('input-container')[0].style.visibility = 'visible';
        document.getElementsByClassName('clear-all')[0].style.display = 'none';
        toDo.listContainer.innerHTML = "";
        toDo.render(toDo.list);
    },
    checkSearcherRender(arrToRender) {
        if (arrToRender === toDo.list) {
            let closeSearcherButton = document.getElementsByClassName('searcher-close-button')[0];
            if (closeSearcherButton) this.hide();
        } else return true
    },
    find(data) {
        let cut = data.length;
        let suggestions = toDo.list.filter(todo => todo.task.slice(0, cut) === data);
        if (suggestions.length === 0 && data) setTimeout(app.modal(`Impossible to find ${data}`), 50); //falta crear un modal i canviarli el valor en funcio
        toDo.render(suggestions);

    },
    getData(e) {
        let userData = e.target.value;
        if (e.target.value) {
            document.getElementsByClassName('main-title')[0].innerText = 'SEARCHING YOUR TO DO...'
            document.getElementsByClassName('main-title')[0].style.color = 'indianred';
            this.find(userData.toLowerCase());
        }
    },
    search() {
        let searcherInput = document.getElementsByClassName('searcher-input')[0];
        searcherInput.onkeyup = (e) => {
            searcherInput.classList.add('focused-input');
            this.getData(e);
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
    addFunctionToEl(componentsArr, isOne) {
        componentsArr.forEach(component => {
            let action = component[Object.keys(component)]['function'];
            if (isOne) {
                let element = document.querySelector(component[Object.keys(component)]['element']);
                element.addEventListener('click', action)
            }
            else {
                let elements = document.querySelectorAll(component[Object.keys(component)]['element']);
                elements.forEach(el => el.addEventListener('click', action))
            }
        })
    },
    closeModal() {
        let ref;
        if (this.id || this.classList) ref = toDo;
        else ref = this;

        if (this.mainContainer.children.length > 1) {
            this.mainContainer.removeChild(document.getElementsByClassName('alert-opacity')[0]);
            document.querySelectorAll('input')[0].focus();
        } else {
            console.log('No modal to close')
        }
    },
    modal(msg) {
        this.closeModal();
        let alert = `<div class="alert-opacity">
                            <div class="alert-container">
                                <span id="msg">${msg}</span>
                                <div id="modal-button-container" class="alert-button-row">
                                    <button type="button" onclick="app.closeModal()">OK</button>
                                </div>
                            </div>
                        </div>`
        document.querySelectorAll('input')[0].blur();
        if (this.mainContainer.children.length === 1) {
            this.mainContainer.insertAdjacentHTML('beforeend', alert);
        } else {
            this.mainContainer.removeChild(document.getElementsByClassName('alert-opacity')[0]);
            setTimeout(() => {
                this.mainContainer.insertAdjacentHTML('beforeend', alert);
            }, 50)
        }
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
        for (input of inputs) {
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
        this.addFunctionToEl(this.ixComponents, true);
        this.focus();
    }
}

app.init();