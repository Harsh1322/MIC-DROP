from flask import Flask, jsonify, request, send_file
from flask_sqlalchemy import SQLAlchemy
import io
import pandas as pd
from fpdf import FPDF
import random
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
import threading
from flask_cors import CORS
from sqlalchemy import desc
from urllib.parse import quote_plus as urlquote

app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = "postgresql://mic_drop_user:5bJw6FFQUmsum2PMrCg4efp1u1IIEPPK@dpg-cr539ll2ng1s73eac4gg-a:5432/mic_drop"
db = SQLAlchemy(app)

class Coordinator(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    episode = db.Column(db.String(80), nullable=False)
    otp = db.Column(db.String(6), nullable=True)

class Participant(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    contact = db.Column(db.String(20), nullable=False)
    category = db.Column(db.String(50), nullable=False)
    episode = db.Column(db.String(100), nullable=False)
    vote_count = db.Column(db.Integer, default=0)
    avg_score = db.Column(db.Float, default=0) 

class Report(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    episode = db.Column(db.String(80), nullable=False)
    date = db.Column(db.String(80), nullable=False)
    totalKishores = db.Column(db.Integer, nullable=False)
    totalCategories = db.Column(db.Integer, nullable=False)

class Score(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    participant_id = db.Column(db.Integer, nullable=False)
    score = db.Column(db.Integer, nullable=False)
    # You might want to include additional fields to track devices/users
    # participant = db.relationship('Participant', backref=db.backref('scores', lazy=True))

class Admin(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    otp = db.Column(db.String(6), nullable=True)

class Vote(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    participant_id = db.Column(db.Integer, nullable=False)
    score = db.Column(db.Integer, nullable=False)

@app.route('/api/admin/send-otp', methods=['POST'])
def send_otp():
    email = request.json.get('email')
    if email != 'gadiya.harsh@gmail.com' and email != 'arpitjainmalu2@gmail.com' and email != 'mudishah1803@gmail.com':
        return jsonify({'error': 'Unauthorized'}), 403

    otp = str(random.randint(100000, 999999))
    admin = Admin.query.filter_by(email=email).first()

    if not admin:
        admin = Admin(email=email, otp=otp)
        db.session.add(admin)
    else:
        admin.otp = otp

    db.session.commit()

    # Here you would send the OTP via email
    print(f"OTP for {email}: {otp}")

    smtp_server = "smtp.gmail.com"
    smtp_port = 587
    smtp_user = "gadiya.harsh@gmail.com"  
    smtp_password = "hubgctbpqdxrxaaq" 

    subject = "Welcome to Mic Drop Portal!!"
    body = f"Your OTP code is: {otp}"

    msg = MIMEMultipart()
    msg['From'] = smtp_user
    msg['To'] = email
    msg['Subject'] = subject
    msg.attach(MIMEText(body, 'plain'))
    
    try:
        server = smtplib.SMTP(smtp_server, smtp_port)
        server.starttls()  # Secure the connection
        server.login(smtp_user, smtp_password)
        server.sendmail(smtp_user, email, msg.as_string())
        server.quit()
        return jsonify({'message': 'OTP sent successfully'}), 200
    except Exception as e:
        return jsonify({'message': 'OTP send failed'}), 400

@app.route('/api/coordinator/send-coordinator-otp', methods=['POST'])
def send_coordinator_otp():
    email = request.json.get('email')
    episode = request.json.get('episode')
    coordinator = Coordinator.query.filter_by(episode=episode, email=email).first()
    if coordinator:
        otp = str(random.randint(100000, 999999))
        coordinator.otp = otp
        db.session.commit()

        print(f"OTP for {email}: {otp}")

        smtp_server = "smtp.gmail.com"
        smtp_port = 587
        smtp_user = "gadiya.harsh@gmail.com"
        smtp_password = "hubgctbpqdxrxaaq"  

        subject = "Welcome to Mic Drop Portal!!"
        body = f"Your OTP code is: {otp}"

        msg = MIMEMultipart()
        msg['From'] = smtp_user
        msg['To'] = email
        msg['Subject'] = subject
        msg.attach(MIMEText(body, 'plain'))
    
        try:
            server = smtplib.SMTP(smtp_server, smtp_port)
            server.starttls()  # Secure the connection
            server.login(smtp_user, smtp_password)
            server.sendmail(smtp_user, email, msg.as_string())
            server.quit()
            return jsonify({'message': 'OTP sent successfully'}), 200
        except Exception as e:
            return jsonify({'message': 'OTP send failed'}), 400
    else:
        print(email,episode)
        coordinators = Coordinator.query.all()
        print([{
        'id': c.id,
        'name': c.name,
        'email': c.email, 
        'episode': c.episode
    } for c in coordinators])
        return jsonify({'error': 'Unauthorized'}), 403

    
    
@app.route('/api/coordinator/verify-coordinator-otp', methods=['POST'])
def verify_coordinator_otp():
    otp = request.json.get('otp')
    email = request.json.get('email')
    episode = request.json.get('episode')
    coordinator = Coordinator.query.filter_by(episode=episode, email=email).first()
    if coordinator and coordinator.otp == otp:
        return jsonify({'message': 'OTP verified successfully'}), 200
    return jsonify({'error': 'Invalid OTP'}), 400

@app.route('/api/admin/verify-otp', methods=['POST'])
def verify_otp():
    email = request.json.get('email')
    otp = request.json.get('otp')

    admin = Admin.query.filter_by(email=email).first()
    if admin and admin.otp == otp:
        return jsonify({'message': 'OTP verified successfully'}), 200
    return jsonify({'error': 'Invalid OTP'}), 400


@app.route('/api/admin/coordinators', methods=['GET'])
def get_coordinators():
    coordinators = Coordinator.query.all()
    return jsonify([{
        'id': c.id,
        'name': c.name,
        'email': c.email,  
        'episode': c.episode
    } for c in coordinators])

@app.route('/api/admin/add-coordinator', methods=['POST'])
def add_coordinator():
    data = request.json
    new_coordinator = Coordinator(
        name=data['name'],
        email=data['email'],  
        episode=data['episode']
    )
    db.session.add(new_coordinator)
    db.session.commit()
    return jsonify({'message': 'Coordinator added successfully'})

@app.route('/api/admin/delete-coordinator/<int:id>', methods=['DELETE'])
def delete_coordinator(id):
    coordinator = Coordinator.query.get(id)
    if coordinator:
        db.session.delete(coordinator)
        db.session.commit()
        return jsonify({'message': 'Coordinator deleted successfully'})
    return jsonify({'message': 'Coordinator not found'}), 404

@app.route('/api/admin/reports', methods=['GET'])
def get_reports():
    reports = Report.query.all()
    result = []
    for r in reports:
        result.append({
            'id': r.id,
            'episode': r.episode,
            'date': r.date,
            'totalKishores': r.totalKishores,
            'totalCategories': r.totalCategories,
        })
    return jsonify(result)


@app.route('/api/coordinator/participants', methods=['GET'])
def get_participants():
    episode = request.args.get('episode')
    participants = Participant.query.filter_by(episode=episode).all()
    return jsonify([{
        'id': p.id,
        'name': p.name,
        'contact': p.contact,
        'category': p.category,
        'score' : p.avg_score,
        'votes': p.vote_count   } for p in participants])

@app.route('/api/coordinator/add-participant', methods=['POST'])
def add_participant():
    data = request.json
    new_participant = Participant(
        name=data['name'],
        contact=data['contact'],
        category=data['category'],
        episode=data['episode']
    )
    db.session.add(new_participant)
    db.session.commit()
    return jsonify({'message': 'Participant added successfully'})

contest_active = False
voting_active = False
active_participant_id = -1

@app.route('/api/coordinator/submit-report', methods=['POST'])
def submit_report():
    global contest_active, voting_active, active_participant_id
    contest_active = False
    voting_active = False
    active_participant_id = -1
    data = request.json
    report = Report(
        episode=data['episode'],
        date=data['date'],
        totalKishores = data['kishoresCount'],
        totalCategories =data['categoriesCount']
    )
    db.session.add(report)
    db.session.commit()

    return jsonify({'message': 'Report submitted successfully'})

@app.route('/api/scorer/get-voting-data', methods=['GET'])
def get_voting_data():
    participant = Participant.query.get(active_participant_id)
    if participant:
        return jsonify({'name':participant.name, 'category':participant.category})

    return jsonify({'message': 'Participant not found'})


@app.route('/api/coordinator/start-contest', methods=['GET'])
def start_contest():
    global contest_active
    if not contest_active:
        contest_active=True
    return jsonify({'message': 'Contest started successfully'})

@app.route('/api/coordinator/reset-contest', methods=['POST'])
def reset_contest():
    global contest_active, voting_active, active_participant_id
    data = request.json
    episode = data['episode']
    contest_active = False
    voting_active = False
    active_participant_id = -1
    for p in Participant.query.filter_by(episode=episode).all():
        db.session.delete(p)
        db.session.commit()
    # Implement logic to reset the contest
    return jsonify({'message': 'Contest reset successfully'})

# @app.route('/api/coordinator/start-scoring', methods=['POST'])
# def start_scoring():
#     data = request.json
#     participant_id = data['participantId']
#     episode = data['episode']
#     # Fetch participant details and return scoring options
#     participant = Participant.query.get(participant_id)
#     # Simulating scoring options, modify as needed
#     scoring_data = {
#         'participantId': participant.id,
#         'name': participant.name,
#         'category': participant.category
#     }
#     return jsonify([scoring_data])



# @app.route('/api/scorer/contest-status', methods=['GET'])
# def get_contest_status():
#     episode = request.args.get('episode')
#     # Check if contest has started for the episode and get participants
#     participants = Participant.query.filter_by(episode=episode).all()
#     return jsonify({
#         'started': True,  # Replace with actual contest status check
#         'participants': [{'id': p.id, 'name': p.name, 'category': p.category} for p in participants]
#     })

@app.route('/api/coordinator/contest-status', methods=['GET'])
def get_contest_status():
    return jsonify({'status':contest_active})

# @app.route('/api/scorer/submit-score', methods=['POST'])
# def submit_score():
#     data = request.json
#     participant_id = data['participantId']
#     score = data['score']
#     # Implement logic to save score, ensure unique scoring per device
#     return jsonify({'message': 'Score submitted successfully'})


def deactivate_voting():
    global voting_active, active_participant_id
    if contest_active:
        voting_active = False
        active_participant_id = -1

@app.route('/admin/activate_voting', methods=['POST'])
def activate_voting():
    global voting_active, active_participant_id
    if contest_active:
        voting_active = True
        data = request.json
        active_participant_id = data.get('participant_id')
        participant = Participant.query.get(active_participant_id)
        if participant:
            participant.avg_score=0
            participant.vote_count=0
            db.session.commit()
        # Set a timer to deactivate voting after 30 seconds
        timer = threading.Timer(30.0, deactivate_voting)
        timer.start()
        return jsonify({'message': 'Voting activated for 30 seconds'})
    return jsonify({'message': 'Contest Not started'})

@app.route('/admin/voting_status', methods=['GET'])
def voting_status():
    return jsonify({
        'participant_id': active_participant_id
    })

@app.route('/vote', methods=['POST'])
def vote():
    if not voting_active and contest_active:
        return jsonify({'message': 'Voting is not active'}), 403

    data = request.json
    participant_id = data.get('participant_id')
    score = data.get('score')

    vote = Vote(participant_id=participant_id, score=score)
    db.session.add(vote)
    participant = Participant.query.get(participant_id)
    if participant:
        participant.avg_score = (participant.avg_score * participant.vote_count + score) / (participant.vote_count + 1)
        participant.vote_count += 1
        db.session.commit()

        return jsonify({'message': 'Vote recorded'})
    else:
        return jsonify({'message': 'Participant not found'}), 404
    

@app.route('/leaderboard', methods=['GET'])
def leaderboard():
    participants = Participant.query.order_by(desc(Participant.avg_score)).all()
    leaderboard = [{'id': p.id, 'name': p.name,'category': p.category, 'score': p.avg_score, 'vote_count': p.vote_count} for p in participants]
    return jsonify(leaderboard)    
    
# @app.route('/api/coordinator/votes', methods=['GET'])
# def get_participants():
#     episode = request.args.get('episode')
#     participants = Participant.query.filter_by(episode=episode).all()
#     return jsonify([{
#         'id': p.id,
#         'name': p.name,
#         'contact': p.contact,
#         'category': p.category
#     } for p in participants])


with app.app_context():
    db.create_all()

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=int(os.environ.get("PORT", 5000)))


