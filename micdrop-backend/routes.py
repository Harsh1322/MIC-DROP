from flask import request, jsonify
from app import app, db
from models import User, Episode, Report
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

# User Registration (Admin, Coordinator, Scorer)
@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    hashed_password = generate_password_hash(data['password'], method='sha256')

    new_user = User(
        name=data['name'],
        phone=data['phone'],
        role=data['role'],
        password=hashed_password
    )
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User registered successfully"}), 201

# User Login
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(phone=data['phone']).first()

    if not user or not check_password_hash(user.password, data['password']):
        return jsonify({"message": "Invalid credentials"}), 401

    access_token = create_access_token(identity={"id": user.id, "role": user.role})
    return jsonify(access_token=access_token), 200

# Coordinator: Start Contest
@app.route('/start-contest', methods=['POST'])
@jwt_required()
def start_contest():
    current_user = get_jwt_identity()
    if current_user['role'] != 'coordinator':
        return jsonify({"message": "Access denied"}), 403

    episode_name = request.json.get('episode')
    episode = Episode.query.filter_by(name=episode_name).first()

    if not episode:
        return jsonify({"message": "Episode not found"}), 404

    episode.report_submitted = False
    db.session.commit()

    return jsonify({"message": f"Contest started for {episode_name}"}), 200

# Coordinator: Add Participants
@app.route('/add-participant', methods=['POST'])
@jwt_required()
def add_participant():
    current_user = get_jwt_identity()
    if current_user['role'] != 'coordinator':
        return jsonify({"message": "Access denied"}), 403

    data = request.get_json()
    episode = Episode.query.filter_by(name=data['episode']).first()

    if not episode:
        return jsonify({"message": "Episode not found"}), 404

    new_report = Report(
        participant_name=data['name'],
        participant_phone=data['phone'],
        category=data['category'],
        episode_id=episode.id
    )
    db.session.add(new_report)
    db.session.commit()

    return jsonify({"message": "Participant added successfully"}), 201

# Scorer: Submit Vote
@app.route('/submit-vote', methods=['POST'])
@jwt_required()
def submit_vote():
    current_user = get_jwt_identity()
    if current_user['role'] != 'scorer':
        return jsonify({"message": "Access denied"}), 403

    data = request.get_json()
    report = Report.query.filter_by(id=data['report_id']).first()

    if not report:
        return jsonify({"message": "Report not found"}), 404

    # Update votes and average score
    report.votes += 1
    report.average_score = (report.average_score * (report.votes - 1) + data['score']) / report.votes
    db.session.commit()

    return jsonify({"message": "Vote submitted"}), 200
