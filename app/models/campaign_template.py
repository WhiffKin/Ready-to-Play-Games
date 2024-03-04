from .db import db, environment, SCHEMA, add_prefix_for_prod

class CampaignTemplate(db.Model):
    __tablename__ = 'campaign_templates'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    map = db.Column(db.String(), nullable=False)
    user_id = db.Column(db.Integer, primary_key=True)

    # Relationships:
    ## One to Many: 
    rooms = db.relationship(
        "EnvironmentPieces",
        back_populates="room",
    )

    # To Dictionary Methods:
    def to_dict(self):
        return {
            'id': self.id,
            'backgroundSprite': self.background_sprite,
            'name': self.name,
            'numRooms': len(self.rooms),
        }
    
    def to_dict(self):
        return {
            'id': self.id,
            'backgroundSprite': self.background_sprite,
            'name': self.name,
            'numRooms': len(self.rooms),
        }
    
    