from flask import render_template
from . import main
from flask_login import login_required
from ..models import User


@main.route('/')
def index():
    return render_template('index.html')

@login_required
@main.route('/users')
def users():
    all_users = User.query.order_by(User.username).all()
    return render_template('users.html', users=all_users)
