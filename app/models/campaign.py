from .db import db, environment, SCHEMA, add_prefix_for_prod

class Campaign(db.Model):
    __tablename__ = 'campaigns'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False)
    name = db.Column(db.String(81), nullable=False, unique=True)
    background_sprite = db.Column(db.String(), nullable=False)
    map = db.Column(db.String(), nullable=False)
    description = db.Column(db.Text)

    # Relationships:
    ## One to Many: 
    user = db.relationship(
        "User",
        back_populates="campaigns"
    )

    # To Dictionary Methods:
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name.rsplit(",")[1],
            'background_sprite': self.background_sprite,
            'description': self.description,
        }