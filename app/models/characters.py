from .db import db, environment, SCHEMA, add_prefix_for_prod

class 

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
    # alignmant = ENUM
    # class = ENUM
    description = db.Column(db.text)

    # Relationships:

    # To Dictionary Methods:
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'profilePic': self.profile_pic
        }
    
    def to_dict_stats(self): 
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'strength': self.strength,
            'dexterity': self.dexterity,
            'wisdom': self.wisdom,
            'charisma': self.charisma,
            'experience': self.experience,
        }