from flask import render_template, request, current_app, redirect, url_for
from . import main
from flask_login import login_required, current_user
from ..models import User, TodoList, TodoItems
from .. import db
from datetime import datetime

@main.route('/')
def index():
    return render_template('index.html')

@login_required
@main.route('/dashboard')
def dashboard():
    return render_template('dashboard.html')

@login_required
@main.route('/users')
def users():
    # users = User.query.order_by(User.username).all()
    page = request.args.get('page', 1, type=int)
    pagination = User.query.order_by(User.username).paginate(
        page=page, per_page=current_app.config['SM_ROWS_PER_PAGE'], 
        error_out=False)
    users = pagination.items
    return render_template('users.html', users=users, pagination=pagination)

@login_required
@main.route('/tasks', methods=['POST'])
def new_list():
    if request.method == 'POST':
        user_id = current_user.id
        # Create a new to-do list
        list_name = request.form['listName']
        due_date_str = request.form['deadline']
        if due_date_str:
            try:
                due_date = datetime.strptime(due_date_str, '%Y-%m-%d').date()
            except ValueError:
                due_date = None
        else:
            due_date = None

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
        tasks_by_list[todo_list.list_name] = {'tasks': tasks, 'due_date': todo_list.due_date}

    # Pass the dictionary to the template
    return render_template('tasks.html', tasks_by_list=tasks_by_list)