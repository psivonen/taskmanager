"""initial migration

Revision ID: 38c4e85512a9
Revises: None
Create Date: 2013-12-27 01:23:59.392801

"""

# revision identifiers, used by Alembic.
revision = '38c4e85512a9'
down_revision = None

from alembic import op
import sqlalchemy as sa


def upgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.create_table('roles',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=64), nullable=True),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('name')
    )
    op.create_table('users',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('username', sa.String(length=64), nullable=True),
    sa.Column('role_id', sa.Integer(), nullable=True),
    sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.func.now()),
    sa.ForeignKeyConstraint(['role_id'], ['roles.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_users_username', 'users', ['username'], unique=True)

    op.create_table('todo_lists',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('list_name', sa.String(length=255), nullable=True),
    sa.Column('due_date', sa.Date(), nullable=True),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.func.now()),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('todo_items',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('task', sa.String(length=255), nullable=True),
    sa.Column('due_date', sa.Date(), nullable=True),
    sa.Column('list_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['list_id'], ['todo_lists.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    ### end Alembic commands ###


def downgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.drop_index('ix_users_username', 'users')
    op.drop_table('users')
    op.drop_table('roles')
    op.drop_table('todo_lists')
    op.drop_table('todo_items')
    ### end Alembic commands ###
