from flask import render_template, request, current_app, redirect, url_for, flash, jsonify
from . import main
from flask_login import login_required, current_user
from ..models import TodoList, TodoItems
from .. import db
from datetime import datetime

@main.route('/')
def index():
    return render_template('index.html')

@main.route('/dashboard')
@login_required
def dashboard():
    # get all todo lists for the current user
    todo_lists = TodoList.query.filter_by(user_id=current_user.id).all()

    # calculate number of tasks and completed tasks for each list
    for todo_list in todo_lists:
        total_tasks = len(todo_list.tasks)
        completed_tasks = len([task for task in todo_list.tasks if task.completed])
        todo_list.total_tasks = total_tasks
        todo_list.completed_tasks = completed_tasks
        todo_list.progress = int((completed_tasks / total_tasks) * 100) if total_tasks > 0 else 0

    return render_template('dashboard.html', todo_lists=todo_lists)


@login_required
@main.route('/tasks', methods=['POST'])
def new_list():
    if request.method == 'POST':
        user_id = current_user.id
        # Create a new to-do list
        list_name = request.form['listName']
        due_date_str = request.form['deadline']
        due_date = datetime.strptime(due_date_str, '%Y-%m-%d') if due_date_str else None

        new_list = TodoList(list_name=list_name, due_date=due_date, user_id=user_id)
        db.session.add(new_list)
        db.session.commit()

        # Add each non-empty item to the new to-do list
        list_id = new_list.id
        tasks = request.form.getlist('tasks')
        for task in tasks:
            if task.strip(): # Check if task is not empty after stripping whitespace
                new_item = TodoItems(task=task, list_id=list_id)
                db.session.add(new_item)

        db.session.commit()

        return redirect(url_for('main.tasks'))
    return render_template('tasks.html')


@login_required
@main.route('/tasks')
def tasks():
    # Query the current user's todo lists and associated tasks
    todo_lists = TodoList.query.filter_by(user_id=current_user.id).all()
    tasks = TodoItems.query.join(TodoList).filter(TodoList.user_id == current_user.id).all()
    # Create a dictionary that maps todo list names to their associated tasks
    tasks_by_list = {}
    for todo_list in todo_lists:
        tasks = [task for task in todo_list.tasks]
        tasks_by_list[todo_list.list_name] = {'id': todo_list.id, 'tasks': tasks, 'due_date': todo_list.due_date}

    # Pass the dictionary to the template
    return render_template('tasks.html', tasks_by_list=tasks_by_list)


@login_required
@main.route('/tasks/complete/<int:task_id>', methods=['POST'])
def complete_task(task_id):
    # Get the task object from the database
    task = TodoItems.query.get_or_404(task_id)

    # Update the completed status of the task based on the POST request data
    task.completed = request.json['completed']

    # Calculate the number of completed tasks and total tasks for the associated todo list
    todo_list = task.todo_list
    completed_tasks = sum(1 for task in todo_list.tasks if task.completed)
    total_tasks = len(todo_list.tasks)

    # Update the completed status of the associated todo list
    if total_tasks > 0 and total_tasks == completed_tasks:
        todo_list.completed = True
    else:
        todo_list.completed = False

    # Commit the changes to the database
    db.session.commit()

    # Return the updated task and associated todo list as JSON
    return jsonify({'task': task.to_dict(), 'todo_list': todo_list.to_dict()})


@login_required
@main.route('/tasks/edit/<int:list_id>', methods=['GET', 'POST'])
def edit_list(list_id):
    todo_list = TodoList.query.get_or_404(list_id)
    if request.method == 'POST':
        list_name = request.form['listName']
        due_date_str = request.form['deadline']
        due_date = datetime.strptime(due_date_str, '%Y-%m-%d') if due_date_str else None
        tasks = request.form.getlist('tasks[]')
        # Update task list
        todo_list.list_name = list_name
        todo_list.due_date = due_date
        # Update tasks
        existing_task_ids = [task.id for task in todo_list.tasks]
        for i, task_name in enumerate(tasks):
            if i < len(existing_task_ids):
                task = TodoItems.query.get(existing_task_ids[i])
                task.task = task_name
            else:
                task = TodoItems(task=task_name, list_id=todo_list.id)
                db.session.add(task)

        db.session.commit()

        return redirect(url_for('main.tasks'))

    return render_template('edit_list.html', todo_list=todo_list)

@login_required
@main.route('/tasks/delete/<int:task_id>', methods=['POST'])
def delete_task(task_id):
    task = TodoItems.query.get_or_404(task_id)
    db.session.delete(task)
    db.session.commit()
    flash('Task deleted successfully')
    return redirect(url_for('main.edit_list', list_id=task.list_id))

@login_required
@main.route('/tasks/delete-list/<int:list_id>', methods=['DELETE'])
def delete_list(list_id):
    todo_list = TodoList.query.get_or_404(list_id)

    # delete tasks associated with the list
    for task in todo_list.tasks:
        db.session.delete(task)

    # delete the list itself
    db.session.delete(todo_list)
    db.session.commit()

    return jsonify({'redirect': url_for('main.tasks')})

