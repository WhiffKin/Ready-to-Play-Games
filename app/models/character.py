from .db import db, environment, SCHEMA, add_prefix_for_prod
from enum import Enum

class Class(Enum):
    Monk="Monk"
    Sorcerer="Sorcerer"
    Paladin="Paladin"
    Ranger="Ranger"

class Alignment(Enum):
    Lawful_Good="Lawful Good"
    Chaotic_Good="Chaotic Good"
    Lawful_Neutral="Lawful Neutral"
    Chaotic_Neutral="Chaotic Neutral"
    Lawful_Evil="Lawful Evil"
    Chaotic_Evil="Chaotic Evil"

class Character(db.Model):
    __tablename__ = 'Characters'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False, unique=True)
    sprite = db.Column(db.String(), nullable=False)
    strength = db.Column(db.Integer, nullable=False)
    dexterity = db.Column(db.Integer, nullable=False)
    wisdom = db.Column(db.Integer, nullable=False)
    charisma = db.Column(db.Integer, nullable=False)
    experience = db.Column(db.Integer, nullable=False)
    alignmant = db.Column(db.Enum(Class), nullable=False)
    class_type = db.Column(db.Enum(Class), nullable=False)
    description = db.Column(db.text)

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
            'name': self.name,
            'sprite': self.sprite,
            'description': self.description,
            'profilePic': self.profile_pic
        }
    
    def to_dict_stats(self): 
        return {
            'id': self.id,
            'name': self.name,
            'sprite': self.sprite,
            'strength': self.strength,
            'dexterity': self.dexterity,
            'wisdom': self.wisdom,
            'charisma': self.charisma,
            'experience': self.experience,
        }