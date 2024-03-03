"""added character table

Revision ID: 0318616ab5dc
Revises: 32d382c9fc6a
Create Date: 2024-02-29 12:45:08.846585

"""
from alembic import op
import sqlalchemy as sa

import os
environment = os.getenv("FLASK_ENV")
SCHEMA = os.environ.get("SCHEMA")


# revision identifiers, used by Alembic.
revision = '0318616ab5dc'
down_revision = '32d382c9fc6a'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('characters',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=80), nullable=False),
    sa.Column('sprite', sa.String(), nullable=False),
    sa.Column('strength', sa.Integer(), nullable=False),
    sa.Column('dexterity', sa.Integer(), nullable=False),
    sa.Column('wisdom', sa.Integer(), nullable=False),
    sa.Column('charisma', sa.Integer(), nullable=False),
    sa.Column('experience', sa.Integer(), nullable=False),
    sa.Column('alignment', sa.Enum('Lawful_Good', 'Chaotic_Good', 'Lawful_Neutral', 'Chaotic_Neutral', 'Lawful_Evil', 'Chaotic_Evil', name='alignment'), nullable=False),
    sa.Column('class_type', sa.Enum('Monk', 'Paladin', 'Ranger', 'Sorcerer', name='class'), nullable=False),
    sa.Column('description', sa.Text(), nullable=True),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('name')
    )

    if environment == "production":
        op.execute(f"ALTER TABLE characters SET SCHEMA {SCHEMA};")
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('Characters')
    # ### end Alembic commands ###
