//falta crear un modal a app i fer-lo servir al toDo i al searcher
const app = {
    capitalize: function capitalizeFirstLetter(string) {
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
    focus: function sendInputValEnter() {
        let toDoInput = document.getElementById('todo-input');
        toDoInput.focus();
        toDoInput.onkeyup = (e) => {
            if (e.key === 'Enter') toDo.save();
        }
    },
    setIndex: function setIndex(id, arr) {
        let index = arr.findIndex(arrItem => arrItem.id === id);
        return index
    },
    findInput: function findInput(id) {
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
    init: function init() {
        this.focus();
    }
}

const toDo = {
    list: [],
    renderListFlag: false,
    listContainer: document.getElementById('list'),
    save: function saveToDo() {
        let input = document.getElementById('todo-input');
        let inputVal = input.value;

        if (typeof inputVal === 'string' && inputVal !== '') {
            let taskId = 0;
            if (this.list.length == 0) {
                taskId = 1;
            } else {
                taskId = this.list.length + 1;
            }

            let todo = {
                id: taskId,
                task: `${inputVal.toLocaleLowerCase()}`,
                isDone: false,
            }

            this.list.push(todo);
            console.log('Task added')
        } else {
            console.log('Wrong type of')
        }

        input.value = "";
        this.render(this.list);
    },
    create: function createToDo(element) {

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

        this.listContainer.innerHTML += item
    },
    render: function renderList(arrToRender) {
        this.renderListFlag = true;
        searcher.checkSearcherRender(arrToRender);
        this.listContainer.innerHTML = '';
        arrToRender.map((el) => this.create(el))
        if (arrToRender.length > 0)
            document.getElementsByClassName('clear-all')[0].style.display = 'block';
        else document.getElementsByClassName('clear-all')[0].style.display = 'none';
    },
    clearAll: function clearAll() {
        this.list = [];
        this.render(this.list);
    },
    erase: function eraseItem(id) {
        let index = app.setIndex(id, this.list)
        setTimeout(() => {
            this.list.splice(index, 1);
            setTimeout(this.askConfirmation(id), this.changeModal(`Task#${id} erased!`), 50);
            this.render(this.list);
            console.log('Task erased')
        }, 50);
    },
    updateStatus: function changeStatus(id) {
        let index = app.setIndex(id, toDo.list)
        let statusDisplay = document.getElementsByClassName('status');
        let selDisplay;
        for (display of statusDisplay) {
            if (parseInt(display.id.split('-')[1]) === id) {
                selDisplay = display;
            }
        }
        if (toDo.list[index]['isDone'] === false) {
            toDo.list[index]['isDone'] = true;
            selDisplay.classList.add('status_done');
            selDisplay.classList.remove('status_undone')
        } else {
            toDo.list[index]['isDone'] = false;
            selDisplay.classList.add('status_undone');
            selDisplay.classList.remove('status_done')
        }

    },
    closeModal: function closeModal() {
        app.mainContainer.removeChild(document.getElementsByClassName('alert-opacity')[0]);
        document.querySelectorAll('input')[0].focus();
    },
    changeModal: function changeModalMsg(msg) {
        document.getElementById('msg').innerText = msg;
        document.getElementsByClassName('alert-button-row')[0].innerHTML = `<button type="button" onclick="toDo.closeModal()">OK</button>`;
    },
    changeTaskValue: function changeValue(id) {
        let input = app.findInput(id);
        let index = app.setIndex(id, toDo.list);
        let inputVal = input.value;
        if (typeof inputVal === 'string' && inputVal !== '') {
            this.list[index]['task'] = inputVal;
            input.value = '';
            this.closeModal();
            setTimeout(this.askConfirmation(id), this.changeModal(`Task#${id} updated!`), 50);
            this.render(this.list);
            console.log('Task updated')
        } else {
            this.changeModal(`Impossible to update task#${id}, wrong input text!`);
        }
    },
    cancelUpdate: function cancelUpdate(id) {
        let input = app.findInput(id);
        if (input) {
            this.closeModal();
            this.render(this.list);
        } else {
            console.log('Something went wrong')
        }
    },
    askConfirmation: function askConfirmation(id) {
        let alert = `<div class="alert-opacity">
                        <div class="alert-container">
                            <span id="msg">Are you sure you want to change your taks? </span>
                            <div class="alert-button-row">
                                <button type="button" onclick="toDo.changeTaskValue(${id})">Yes</button>
                                <button type="button" onclick="toDo.cancelUpdate(${id})">Cancel</button>
                            </div>
                        </div>
                    </div>`
        if (app.mainContainer.children.length === 1) {
            app.mainContainer.insertAdjacentHTML('beforeend', alert);
        } else {
            app.mainContainer.removeChild(document.getElementsByClassName('alert-opacity')[0]);
            setTimeout(() => {
                app.mainContainer.insertAdjacentHTML('beforeend', alert);
            }, 50)
        }

    },
    enableUpdate: function enableUpdate(id) {
        let input = app.findInput(id);
        input.value = "";
        input.onkeyup = (e) => {
            if (e.key === 'Enter') this.askConfirmation(id);
        }
        input.parentElement.parentElement.children[2].innerHTML = `<i class="fa-solid fa-check check-icon" onclick="toDo.askConfirmation(${id})"></i>`;
    },
    transformTask: function enableTask(task, id) {
        taskContainer = task.parentElement;
        let oldTask = task.innerHTML;
        taskContainer.innerHTML = `<input id="update-input-${id}" class="update-input" type="text" value='${oldTask}' placeholder="${oldTask}" autocomplete="off">`;
        let updateInput = document.getElementById(`update-input-${id}`)
        updateInput.focus();
        updateInput.onfocus = this.enableUpdate(id)
    },
    update: function updateItem(id) {
        let inputs = document.getElementsByClassName('update-input');
        for (let input of inputs) {
            if (input) {
                let inputId = parseInt(input.id.split('-')[2]);
                let inputIndex = app.setIndex(inputId, toDo.list);
                input.parentElement.parentElement.getElementsByClassName('item-icon-col')[0].innerHTML = `<i class="fa-solid fa-pencil update_icon" onclick="toDo.updateItem(${inputIndex})"></i>`;
                input.parentElement.innerHTML = `<span class="task">${toDo.list[inputIndex]['task']}</span>`;
            }
        }
        let taskToUpdate = document.getElementById(`task-${id}`);
        taskToUpdate.onclick = this.transformTask(taskToUpdate, id);
    }
}

const searcher = {
    render: function renderSearcher() {
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
    hide: function hideSearcher() {
        let searcherContainer = app.mainContainer.getElementsByClassName('searcher-container')[0];
        searcherContainer.innerHTML = `<p class="search-button" onclick="searcher.render()"><i class="fa-solid fa-magnifying-glass"></i> Search your task!</p>`
        document.getElementsByClassName('main-title')[0].innerText = 'TO DO LIST'
        document.getElementsByClassName('main-title')[0].style.color = 'cornflowerblue';
        document.getElementsByClassName('input-container')[0].style.visibility = 'visible';
        document.getElementsByClassName('clear-all')[0].style.display = 'none';
        toDo.render(toDo.list);
    },
    checkSearcherRender: function checkSearcher(arrToRender) {
        if (arrToRender === toDo.list) {
            let closeSearcherButton = document.getElementsByClassName('searcher-close-button')[0];
            if (closeSearcherButton) this.hide();
        } else return true
    },
    find: function findSuggestions(data) {
        let suggestions = [];
        suggestions = toDo.list.filter((todo) => {
            if (data.length === 1) {
                if (todo.task[0] === data) return todo;
            } else {
                let cut = data.length;
                let cuttedTask = todo.task.slice(0, cut);
                if (cuttedTask === data) return todo;
            }
        });
        if (suggestions.length === 0 && data) setTimeout(toDo.askConfirmation(-1), toDo.changeModal(`Impossible to find ${data}`, 50)); //falta crear un modal i canviarli el valor en funcio
        toDo.render(suggestions);

    },
    getData: function getUserData(e) {
        let userData = e.target.value;
        if (e.target.value) {
            document.getElementsByClassName('main-title')[0].innerText = 'SEARCHING YOUR TO DO...'
            document.getElementsByClassName('main-title')[0].style.color = 'indianred';
            this.find(userData.toLowerCase());
        }
    },
    search: function search() {
        let searcherInput = document.getElementsByClassName('searcher-input')[0];
        searcherInput.onkeyup = (e) => {
            searcherInput.classList.add('focused-input');
            this.getData(e);
        }
    }


}
app.init();