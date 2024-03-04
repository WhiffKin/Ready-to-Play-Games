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
    env_pieces = db.relationship(
        "EnvironmentPieces",
        back_populates="room",
    )

    # To Dictionary Methods:
    def to_dict(self):
        return {
            'id': self.id,
            'background_sprite': self.background_sprite,
            'name': self.name,
            'pieces': [piece.to_dict() for piece in self.env_pieces],
        }
    