from flask import render_template, request, current_app
from . import main
from flask_login import login_required, current_user
from ..models import User


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
