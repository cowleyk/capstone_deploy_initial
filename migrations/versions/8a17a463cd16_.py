"""empty message

Revision ID: 8a17a463cd16
Revises: None
Create Date: 2017-03-06 12:36:00.866942

"""

# revision identifiers, used by Alembic.
revision = '8a17a463cd16'
down_revision = None

from alembic import op
import sqlalchemy as sa


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('users',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('screen_name', sa.String(), nullable=True),
    sa.Column('oauth_token', sa.String(), nullable=True),
    sa.Column('oauth_token_secret', sa.String(), nullable=True),
    sa.Column('csv_data', sa.TEXT(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('users')
    # ### end Alembic commands ###
