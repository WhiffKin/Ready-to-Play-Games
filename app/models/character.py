from .db import db, environment, SCHEMA, add_prefix_for_prod
from enum import Enum
from math import floor

class Class(Enum):
    Monk="Monk"
    Paladin="Paladin"
    Ranger="Ranger"
    Sorcerer="Sorcerer"

class Alignment(Enum):
    Lawful_Good="Lawful_Good"
    Chaotic_Good="Chaotic_Good"
    Lawful_Neutral="Lawful_Neutral"
    Chaotic_Neutral="Chaotic_Neutral"
    Lawful_Evil="Lawful_Evil"
    Chaotic_Evil="Chaotic_Evil"

class Character(db.Model):
    __tablename__ = 'characters'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False)
    name = db.Column(db.String(81), nullable=False, unique=True)
    sprite = db.Column(db.String(), nullable=False)
    strength = db.Column(db.Integer, nullable=False)
    dexterity = db.Column(db.Integer, nullable=False)
    wisdom = db.Column(db.Integer, nullable=False)
    charisma = db.Column(db.Integer, nullable=False)
    experience = db.Column(db.Integer, nullable=False)
    alignment = db.Column(db.Enum(Alignment), nullable=False)
    class_type = db.Column(db.Enum(Class), nullable=False)
    description = db.Column(db.Text)

    # Relationships:
    ## Many to Many: 
    # campaigns
    
    ## One to Many: 
    user = db.relationship(
        "User",
        back_populates="characters"
    )

    # To Dictionary Methods:
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name.rsplit(",")[1],
            'sprite': self.sprite,
            'classType': self.class_type.name,
        }
    
    def to_dict_stats(self): 
        health = 4 + floor(self.experience / 10)
        if self.class_type == 'Paladin':
            health *= 1.4
            health = floor(health)
        elif self.class_type == 'Sorecerer':
            health *= .6
            health = floor(health)

        return {
            'id': self.id,
            'userId': self.user_id,
            'name': self.name.rsplit(",")[1],
            'sprite': self.sprite,
            'description': self.description,
            'health': health,
            'strength': self.strength,
            'dexterity': self.dexterity,
            'wisdom': self.wisdom,
            'charisma': self.charisma,
            'experience': self.experience,
            'alignment': self.alignment.name,
            'classType': self.class_type.name,
        }