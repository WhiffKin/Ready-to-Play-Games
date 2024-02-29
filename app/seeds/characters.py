from app.models import db, Character, environment, SCHEMA
from sqlalchemy.sql import text


# Adds a demo user, you can add other characters here if you want
def seed_characters(all_users):
    character = Character(name="Test Character", sprite="No Image", strength=10, dexterity=10, wisdom=10, charisma=10, experience=10, alignment="Lawful_Neutral", class_type="Monk", description="I am but a humble test character who will be removed from a production environment.", user=all_users[0])

    db.session.add(character)
    db.session.commit()


# Uses a raw SQL query to TRUNCATE or DELETE the characters table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_characters():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.characters RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM characters"))
        
    db.session.commit()
