from app.models import db, CampaignTemplate, Room, EnvironmentPiece, environment, SCHEMA
from sqlalchemy.sql import text


# Adds a demo user, you can add other characters here if you want
def seed_templates(all_users):
    template = CampaignTemplate(map="1;s:13-d:8,2;e:1,3;e:2", name="A Great Test!", recommended_level=0, background_sprite="https://whiffkin-rtpg.s3.us-west-2.amazonaws.com/template+background.png", user=all_users[0])

    room1 = Room(user=all_users[0], templates=[template], name="Grass Field", background_sprite="https://whiffkin-rtpg.s3.us-west-2.amazonaws.com/Ground+Grass.png")
    room2 = Room(user=all_users[0], templates=[template], name="Dungeon Entrance", background_sprite="https://whiffkin-rtpg.s3.us-west-2.amazonaws.com/Ground+Stone.png")
    room3 = Room(user=all_users[0], templates=[template], name="A Special Boss??", background_sprite="https://whiffkin-rtpg.s3.us-west-2.amazonaws.com/Ground+Stone.png")
    rooms = [room1, room2, room3]

    piece1 = EnvironmentPiece(room=room1, sprite="https://whiffkin-rtpg.s3.us-west-2.amazonaws.com/Bush.png", location="back_left")
    piece2 = EnvironmentPiece(room=room1, sprite="https://whiffkin-rtpg.s3.us-west-2.amazonaws.com/Bush.png", location="back_right")
    piece3 = EnvironmentPiece(room=room1, sprite="https://whiffkin-rtpg.s3.us-west-2.amazonaws.com/Short+Grass.png", location="front_right")
    piece3 = EnvironmentPiece(room=room1, sprite="https://whiffkin-rtpg.s3.us-west-2.amazonaws.com/Short+Grass.png", location="front_center")
    piece3 = EnvironmentPiece(room=room1, sprite="https://whiffkin-rtpg.s3.us-west-2.amazonaws.com/Short+Grass.png", location="front_left")
    piece4 = EnvironmentPiece(room=room2, sprite="https://whiffkin-rtpg.s3.us-west-2.amazonaws.com/Dungeon+Wall.png", location="wall")
    piece5 = EnvironmentPiece(room=room3, sprite="https://whiffkin-rtpg.s3.us-west-2.amazonaws.com/Dungeon+Wall.png", location="wall")
    env_pieces = [piece1, piece2, piece3, piece4, piece5]
    
    db.session.add(template)
    db.session.add_all(rooms)
    db.session.add_all(env_pieces)
    db.session.commit()


# Uses a raw SQL query to TRUNCATE or DELETE the characters table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_templates():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.campaign_templates RESTART IDENTITY CASCADE;")
        db.session.execute(f"TRUNCATE table {SCHEMA}.rooms RESTART IDENTITY CASCADE;")
        db.session.execute(f"TRUNCATE table {SCHEMA}.template_rooms RESTART IDENTITY CASCADE;")
        db.session.execute(f"TRUNCATE table {SCHEMA}.environment_pieces RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM campaign_templates"))
        db.session.execute(text("DELETE FROM rooms"))
        db.session.execute(text("DELETE FROM template_rooms"))
        db.session.execute(text("DELETE FROM environment_pieces"))
        
    db.session.commit()
