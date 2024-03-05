from .db import db, environment, SCHEMA
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin


class User(db.Model, UserMixin):
    __tablename__ = 'users'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(40), nullable=False, unique=True)
    first_name = db.Column(db.String(40))
    last_name = db.Column(db.String(40))
    email = db.Column(db.String(255), nullable=False, unique=True)
    hashed_password = db.Column(db.String(255), nullable=False)
    profile_pic = db.Column(db.String(255), default="No Image")
    description = db.Column(db.Text)

    # Relationships:
    ## Many to Many:
    # campaigns
    # fave_campaigns

    ## One to Many:
    templates = db.relationship(
        "CampaignTemplate",
        back_populates="user",
    )
    characters = db.relationship(
        "Character",
        back_populates="user",
        cascade="all, delete",
    )

    # To Dictionary Methods:
    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'profilePic': self.profile_pic
        }
    
    def to_dict_all(self): 
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'firstName': self.first_name,
            'lastName': self.last_name,
            'description': self.description,
            'profilePic': self.profile_pic
        }

    # Getters/Setters:
    @property
    def password(self):
        return self.hashed_password

    @password.setter
    def password(self, password):
        self.hashed_password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)
