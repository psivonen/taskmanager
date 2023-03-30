from flask_wtf import FlaskForm
from wtforms import EmailField
from wtforms.validators import Email, DataRequired


class EmailForm(FlaskForm):
    email = EmailField('', validators=[DataRequired(), Email()])
