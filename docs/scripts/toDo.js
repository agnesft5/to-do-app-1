import { app, ixComponentsTD } from './app.js';
import searcher from './searcher.js';

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
            if (e.key === 'Enter') { ref.askConfirmation(id) }
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
        let oldTask = task.innerHTML;
        taskContainer.innerHTML = `<input id="update-input-${id}" class="update-input" type="text" value='${oldTask}' placeholder="${oldTask}" autocomplete="off">`;
        let updateInput = document.getElementById(`update-input-${id}`)
        updateInput.focus();
        updateInput.onfocus = ref.enableUpdate(id)
    },
    closeEditInputs() {
        let ref;
        if (this === undefined || this.id || this.classList) ref = toDo;
        else ref = this;

        let inputs = document.getElementsByClassName('update-input');
        let theresInput = 'no input'
        if (inputs) {
            for (let input of inputs) {
                //if is there any other input when I'm about to edit a new task
                //this script will transform it to a span
                let inputId = parseInt(input.id.split('-')[2]);
                let inputIndex = app.setIndex(inputId, ref.list);
                input.parentElement.parentElement.getElementsByClassName('item-icon-col')[0].innerHTML = `<i id="update-${inputId}" class="fa-solid fa-pencil update-icon"></i>`;
                let taskCap = app.capitalize(ref.list[inputIndex]['task']);
                let taskOverflowWrap;
                if (taskCap.includes(' ')) taskOverflowWrap = 'break-word';
                else taskOverflowWrap = 'anywhere';
                input.parentElement.innerHTML = `<span id="task-${inputId}" class="task" style="overflow-wrap: ${taskOverflowWrap}">${taskCap}</span>`;

                let components = app.findComponent(ixComponentsTD, 'update');
                if (ref.list.length === 1) app.addFunctionToEl(components, true);
                else app.addFunctionToEl(components, false);

                theresInput = 'input erased'
            }
        } else theresInput = 'no input'

    },
    update(id) {
        let ref;
        if (this === undefined || this.id || this.classList) ref = toDo;
        else ref = this;

        ref.closeEditInputs();

        let taskToUpdate = document.getElementById(`task-${id}`);
        taskToUpdate.onclick = ref.transformTask(taskToUpdate, id);

    },
}

export default toDo;