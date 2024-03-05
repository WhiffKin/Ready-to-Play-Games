from .db import db, environment, SCHEMA, add_prefix_for_prod

class CampaignTemplate(db.Model):
    __tablename__ = 'campaign_templates'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    # Map is set with rooms seperated by ','
    # keywords for room seperated by ';'
    #   first is the id of the room
    #   for stat challenges use their first letter : roll, ex: 's:8' (strength)
    #   for enemies use 'e' : their character id, ex: 'e:2'
    #   for items rewards add : item id, ex 'e:2:1'
    #   seperate challenges with '-', ex 's:8-e:2:1'
    map = db.Column(db.String(), nullable=False)
    name = db.Column(db.String(), nullable=False)
    recommended_level = db.Column(db.Integer, default=0)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")))
    background_sprite = db.Column(db.String(), nullable=False)

    # Relationships:
    ## One to Many: 
    user = db.relationship(
        "User",
        back_populates="templates",
    )
    rooms = db.relationship(
        "Room",
        back_populates="template",
        cascade="all, delete",
    )

    # To Dictionary Methods:
    def to_dict(self):
        return {
            'id': self.id,
            'backgroundSprite': self.background_sprite,
            'name': self.name,
            'recLevel': self.recommended_level,
            'numRooms': len(self.rooms),
        }
    
    def to_dict_detailed(self):
        return {
            'id': self.id,
            'backgroundSprite': self.background_sprite,
            'name': self.name,
            'rooms': [room.to_dict() for room in self.rooms],
        }
    
    