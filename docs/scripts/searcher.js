import { app, ixComponentsTD } from './app.js';
import toDo from './toDo.js';

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

export default searcher;