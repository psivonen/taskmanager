from flask import render_template, request, current_app, jsonify
from . import api
from flask_login import login_required, current_user
from ..models import User
from .forms import EmailForm

# REST-metodit:
# GET - luku
# POST - lisäys
# PUT - muutos
# DELETE - poisto

# Tässä edellytetään:
# POST-metodi, data lomakkeena, return JSON-muodossa

@api.route('/email_check', methods=['GET', 'POST'])
def email_check():
    form = EmailForm('email')
    if form.validate_on_submit():
        user = User.query.filter_by(email=form.email.data.lower()).first()
        if user is not None:
            response = jsonify({'error':'Sähköpostiosoite on varattu.'})
        else:
            response = jsonify('OK')
        return response
    return jsonify({'error': 'Virheellinen sähköposti.'})

