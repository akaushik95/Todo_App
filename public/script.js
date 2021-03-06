console.log("script is running");
const RESPONSE_DONE = 4;
const STATUS_OK = 200;
const TODOS_LIST_ID_ACTIVE = "todos_list_div_active";
const TODOS_LIST_ID_COMPLETED = "todos_list_div_completed";
const TODOS_LIST_ID_DELETED = "todos_list_div_deleted";
const NEW_TODO_INPUT_ID = "new_todo_input";

function refreshTodos(){
    getActiveTodosAJAX();
    getCompletedTodosAJAX();
    getDeletedTodosAJAX();
}

// LOADS ALL TYPE OF TODOS TO THE WEBPAGE ONLOAD.
window.onload = function () {
    getActiveTodosAJAX();
    getDeletedTodosAJAX();
    getCompletedTodosAJAX();
}

// RETURNS THE TODOS WHICH ARE ACTIVE.
function getActiveTodosAJAX() {
    console.log("get active todos ajax is running");
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "/api/todos/active", true);

    xhr.onreadystatechange = function () {
        if(xhr.readyState == RESPONSE_DONE){
            if(xhr.status == STATUS_OK){
                console.log(xhr.responseText);
                addTodoElements(TODOS_LIST_ID_ACTIVE, xhr.responseText);
            }
        }
    }
    xhr.send(data = null);
};

// RETURNS THE TODOS WHICH ARE DELETED.
function getDeletedTodosAJAX() {
    console.log("get deleted todos ajax is running");
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "/api/todos/deleted", true);

    xhr.onreadystatechange = function () {
        if(xhr.readyState == RESPONSE_DONE){
            if(xhr.status == STATUS_OK){
                console.log(xhr.responseText);
                addTodoElements(TODOS_LIST_ID_DELETED, xhr.responseText);
            }
        }
    }
    xhr.send(data = null);
};

// RETURNS THE TODOS WHICH ARE COMPLETED.
function getCompletedTodosAJAX() {
    console.log("get completed todos ajax is running");
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "/api/todos/complete", true);

    xhr.onreadystatechange = function () {
        if(xhr.readyState == RESPONSE_DONE){
            if(xhr.status == STATUS_OK){
                console.log(xhr.responseText);
                addTodoElements(TODOS_LIST_ID_COMPLETED, xhr.responseText);
            }
        }
    }
    xhr.send(data = null);
};

// ADD A NEW TODO.
function addTodoElements(id, todos_data_json){
    var todos = JSON.parse(todos_data_json);
    var parent = document.getElementById(id);

    if(parent){
        parent.innerHTML = ""; //   not an good way to clear the screen
        Object.keys(todos).forEach(
            function (key) {
                var todo_element = createTodoElement(key, todos[key]);
                parent.appendChild(todo_element);
            }
        )
    }
}

// CREATES A NEW TODO(WITH CHECKBOX AND DELETE BUTTONS) AND RETURNS IT.
function createTodoElement(id, todo_object) {
    var todo_box = document.createElement("div");
    todo_box.setAttribute("class", "container");

    var todo_box_row = document.createElement("div");
    todo_box_row.setAttribute("class", "row");
    todo_box.appendChild(todo_box_row);

    var todo_box_row_1 = document.createElement("div");
    todo_box_row_1.setAttribute("class", "col-sm-3");

    var todo_box_row_2 = document.createElement("div");
    todo_box_row_2.setAttribute("class", "col-sm-3");

    var todo_box_row_3 = document.createElement("div");
    todo_box_row_3.setAttribute("class", "col-sm-3");

    var todo_box_row_4 = document.createElement("div");
    todo_box_row_4.setAttribute("class", "col-sm-3");

    if(todo_object.status == "ACTIVE"){
        var complete_checkbox_div = document.createElement("div");
        complete_checkbox_div.setAttribute("class", "checkbox checkbox-primary");
        var complete_checkbox = document.createElement("input");
        complete_checkbox.setAttribute("type", "checkbox");
        complete_checkbox.setAttribute("class", "styled");
        complete_checkbox.setAttribute("id", "checkbox"+id);
        complete_checkbox.setAttribute("value", "");
        complete_checkbox.setAttribute("onclick", "completeTodoAJAX("+id+")");
        var complete_checkbox_label = document.createElement("label");
        complete_checkbox_label.setAttribute("value", "");
        complete_checkbox_label.setAttribute("for", "checkbox"+id);
        complete_checkbox_div.appendChild(complete_checkbox);
        complete_checkbox_div.appendChild(complete_checkbox_label);
        todo_box_row_1.appendChild(complete_checkbox_div);
    }
    if(todo_object.status =="COMPLETED"){
        var complete_checkbox_div = document.createElement("div");
        complete_checkbox_div.setAttribute("class", "checkbox checkbox-success");
        var complete_checkbox = document.createElement("input");
        complete_checkbox.setAttribute("type", "checkbox");
        complete_checkbox.setAttribute("class", "styled");
        complete_checkbox.setAttribute("id", "checkbox"+id);
        complete_checkbox.setAttribute("checked", "true");
        complete_checkbox.setAttribute("disabled", "true");
        complete_checkbox.setAttribute("onclick", "completeTodoAJAX("+id+")");
        var complete_checkbox_label = document.createElement("label");
        complete_checkbox_label.setAttribute("value", "");
        complete_checkbox_label.setAttribute("for", "checkbox"+id);
        complete_checkbox_div.appendChild(complete_checkbox);
        complete_checkbox_div.appendChild(complete_checkbox_label);
        todo_box_row_1.appendChild(complete_checkbox_div);
    }


    var todo_element = document.createElement("label");
    todo_element.innerText = todo_object.title;
    todo_element.setAttribute("data-id", id);   // setting a custom attribute
    todo_element.setAttribute("class", "todoStatus"+todo_object.status);
    todo_element.setAttribute("class", "todoStatus"+ todo_object.status + " " + "breathVertical");
    todo_box_row_2.appendChild(todo_element);

    if(todo_object.status != "DELETED"){
        var delete_button = document.createElement("button");
        delete_button.setAttribute("class", "btn btn-default");
        delete_button.setAttribute("onclick", "deleteTodoAJAX("+id+")");
        var del_span = document.createElement("span");
        del_span.setAttribute("class", "glyphicon glyphicon-remove");
        del_span.style.color = "red";
        delete_button.appendChild(del_span);
        todo_box_row_3.appendChild(delete_button);
    }

    todo_box_row_1.setAttribute("align", "center");
    todo_box_row_2.setAttribute("align", "left");
    todo_box_row_3.setAttribute("align", "right");

    todo_box_row.appendChild(todo_box_row_1);
    todo_box_row.appendChild(todo_box_row_2);
    todo_box_row.appendChild(todo_box_row_3);
    todo_box_row.appendChild(todo_box_row_4);

    return todo_box;
}

// ADDS A TODO TO THE FRONTEND (POST REQUEST).
function addTodoAJAX() {
    var title = document.getElementById(NEW_TODO_INPUT_ID).value;
    document.getElementById(NEW_TODO_INPUT_ID).value = "";
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/todos", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    var data = "title=" + encodeURI(title);
    xhr.onreadystatechange = function () {
        if(xhr.readyState == RESPONSE_DONE){
            if(xhr.status == STATUS_OK){
                console.log(xhr.responseText);
                addTodoElements(TODOS_LIST_ID_ACTIVE, xhr.responseText);
            }else{
                console.log(xhr.responseText);
            }
        }
    }
    xhr.send(data);
    refreshTodos();
};

// MAKES A PUT REQUEST AND PUT AN ACTIVE TODO IN THE COMPLETED TODOS.
function completeTodoAJAX(id) {
    var xhr = new XMLHttpRequest();
    xhr.open("PUT", "/api/todos/"+id, true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    var data = "status=COMPLETED";
    xhr.onreadystatechange = function () {
        if(xhr.readyState == RESPONSE_DONE){
            if(xhr.status == STATUS_OK){
                console.log(xhr.responseText);
                addTodoElements(TODOS_LIST_ID_COMPLETED, xhr.responseText);
            }else{
                console.log(xhr.responseText);
            }
        }
    }

    xhr.send(data);
    refreshTodos();
};

// MAKES A DELETE REQUEST AND PUTS ACTIVE/COMPLETED TODOS IN DELETED TODOS.
function deleteTodoAJAX(id) {
    var xhr = new XMLHttpRequest();
    xhr.open("DELETE", "/api/todos/"+id, true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    var data = "status=DELETED";
    xhr.onreadystatechange = function () {
        if(xhr.readyState == RESPONSE_DONE){
            if(xhr.status == STATUS_OK){
                console.log(xhr.responseText);
                addTodoElements(TODOS_LIST_ID_DELETED, xhr.responseText);
            }else{
                console.log(xhr.responseText);
            }
        }
    }
    xhr.send(data);
    refreshTodos();
};

// A FUNCTION TO HIDE AND SHOW COMPLETED TODOS.
function hideCompletedTodos() {
    var x = document.getElementById("todos_list_div_completed");
    if (x.style.display === 'none') {
        x.style.display = 'block';
        var hide_completed_todos = document.getElementById("hide_completed_todos");
        hide_completed_todos.innerText = "Hide Completed Items";
        hide_completed_todos.style.textDecoration = "underline";
        hide_completed_todos.style.color = "blue;"
    } else {
        x.style.display = 'none';
        var hide_completed_todos = document.getElementById("hide_completed_todos");
        hide_completed_todos.innerText = "Show Completed Items";
        hide_completed_todos.style.textDecoration = "underline";
        hide_completed_todos.style.color = "blue"
    }
};

// A FUNCTION TO HIDE AND SHOW DELETED TODOS.
function hideDeletedTodos() {
    var x = document.getElementById("todos_list_div_deleted");
    if (x.style.display === 'none') {
        x.style.display = 'block';
        var hide_completed_todos = document.getElementById("hide_deleted_todos");
        hide_completed_todos.innerText = "Hide Deleted Items";
        hide_completed_todos.style.textDecoration = "underline";
        hide_completed_todos.style.color = "blue;"
    } else {
        x.style.display = 'none';
        var hide_completed_todos = document.getElementById("hide_deleted_todos");
        hide_completed_todos.innerText = "Show Deleted Items";
        hide_completed_todos.style.textDecoration = "underline";
        hide_completed_todos.style.color = "blue"
    }
};