from random import randint
from sqlalchemy.exc import IntegrityError
from faker import Faker
from . import db
from .models import User


def users(count=10):
    fake = Faker(['fi_FI'])
    i = 0
    while i < count:
        u = User(email=fake.email(),
                 username=fake.user_name(),
                 password='password',
                 confirmed=randint(0, 1))
        db.session.add(u)
        try:
            db.session.commit()
            i += 1
        except IntegrityError:
            db.session.rollback()