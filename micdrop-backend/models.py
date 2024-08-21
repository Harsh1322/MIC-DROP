from app import db

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    phone = db.Column(db.String(15), unique=True, nullable=False)
    role = db.Column(db.String(10), nullable=False)  # Admin, Coordinator, Scorer
    password = db.Column(db.String(100), nullable=False)
    episode = db.Column(db.String(100))  # For coordinators and scorers

class Episode(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    coordinator_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    report_submitted = db.Column(db.Boolean, default=False)
    reports = db.relationship('Report', backref='episode', lazy=True)

class Report(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    episode_id = db.Column(db.Integer, db.ForeignKey('episode.id'))
    participant_name = db.Column(db.String(100), nullable=False)
    participant_phone = db.Column(db.String(15))
    category = db.Column(db.String(50), nullable=False)
    votes = db.Column(db.Integer, default=0)
    average_score = db.Column(db.Float, default=0.0)
    event_date = db.Column(db.DateTime)
    kishores_participated = db.Column(db.Integer)
    categories_covered = db.Column(db.Integer)
