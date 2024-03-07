from .db import db, environment, SCHEMA, add_prefix_for_prod


template_rooms = db.Table(
    "template_rooms",
    db.Column(
        "template_id", 
        db.Integer, 
        db.ForeignKey(add_prefix_for_prod("campaign_templates.id")), 
        primary_key=True
    ),
    db.Column(
        "room_id", 
        db.Integer, 
        db.ForeignKey(add_prefix_for_prod("rooms.id")), 
        primary_key=True
    )
)

if environment == "production":
    template_rooms.schema = SCHEMA