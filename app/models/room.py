from .db import db, environment, SCHEMA, add_prefix_for_prod

class Room(db.Model):
    __tablename__ = 'rooms'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    template_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("campaign_templates.id")), nullable=False)
    background_sprite = db.Column(db.String(), nullable=False)
    name = db.Column(db.String(), nullable=False)

    # Relationships:
    ## One to Many: 
    template = db.relationship(
        "CampaignTemplate",
        back_populates="rooms"
    )
    env_pieces = db.relationship(
        "EnvironmentPieces",
        back_populates="room",
        cascade="all, delete",
    )

    # To Dictionary Methods:
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'background_sprite': self.background_sprite,
            'pieces': [piece.to_dict() for piece in self.env_pieces],
        }
    