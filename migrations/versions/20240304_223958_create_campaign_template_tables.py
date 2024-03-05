"""create campaign template tables

Revision ID: 3ba2fd006fce
Revises: 0318616ab5dc
Create Date: 2024-03-04 22:39:58.007209

"""
from alembic import op
import sqlalchemy as sa

import os
environment = os.getenv("FLASK_ENV")
SCHEMA = os.environ.get("SCHEMA")


# revision identifiers, used by Alembic.
revision = '3ba2fd006fce'
down_revision = '0318616ab5dc'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('campaign_templates',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('map', sa.String(), nullable=False),
    sa.Column('name', sa.String(), nullable=False),
    sa.Column('recommended_level', sa.Integer(), nullable=True),
    sa.Column('user_id', sa.Integer(), nullable=True),
    sa.Column('background_sprite', sa.String(), nullable=False),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('rooms',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('template_id', sa.Integer(), nullable=False),
    sa.Column('background_sprite', sa.String(), nullable=False),
    sa.Column('name', sa.String(), nullable=False),
    sa.ForeignKeyConstraint(['template_id'], ['campaign_templates.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('environment_pieces',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('room_id', sa.Integer(), nullable=False),
    sa.Column('sprite', sa.String(), nullable=False),
    sa.Column('location', sa.Enum('front_left', 'front_center', 'front_right', 'back_left', 'back_center', 'back_right', 'obstacle', 'wall', name='location'), nullable=False),
    sa.ForeignKeyConstraint(['room_id'], ['rooms.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    
    if environment == "production":
        op.execute(f"ALTER TABLE campaign_templates SET SCHEMA {SCHEMA};")
        op.execute(f"ALTER TABLE rooms SET SCHEMA {SCHEMA};")
        op.execute(f"ALTER TABLE environment_pieces SET SCHEMA {SCHEMA};")
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('environment_pieces')
    op.drop_table('rooms')
    op.drop_table('campaign_templates')
    # ### end Alembic commands ###