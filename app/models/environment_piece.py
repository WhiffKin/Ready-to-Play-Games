from .db import db, environment, SCHEMA, add_prefix_for_prod
from enum import Enum

class Location(Enum):
    front_left = "front_left"
    front_center = "front_left"
    front_right = "front_left"
    back_left = "back_left"
    back_center = "back_left"
    back_right = "back_left"
    obstacle = "obstacle"
    wall = "wall"

class EnvironmentPieces(db.Model):
    __tablename__ = 'environment_pieces'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    room_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("rooms.id")), nullable=False)
    sprite = db.Column(db.String(), nullable=False)
    location = db.Column(db.Enum(Location), nullable=False)

    # Relationships:    
    ## One to Many: 
    room = db.relationship(
        "Room",
        back_populates="env_pieces"
    )

    # To Dictionary Methods:
    def to_dict(self):
        return {
            'id': self.id,
            'sprite': self.sprite,
            'location': self.location.name,
        }