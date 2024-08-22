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

app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///micdrop.db'
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
    avg_score = db.Column(db.Float, default=0)  # Add average score field
    report_id = db.Column(db.Integer, db.ForeignKey('report.id'), nullable=True)  # Link to Report

class Report(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    episode = db.Column(db.String(80), nullable=False)
    date = db.Column(db.String(80), nullable=False)
    totalKishores = db.Column(db.Integer, nullable=False)
    totalCategories = db.Column(db.Integer, nullable=False)
    participants = db.relationship('Participant', backref='report', lazy=True)

class Score(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    participant_id = db.Column(db.Integer, db.ForeignKey('participant.id'), nullable=False)
    score = db.Column(db.Integer, nullable=False)
    # You might want to include additional fields to track devices/users
    participant = db.relationship('Participant', backref=db.backref('scores', lazy=True))

class Admin(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    otp = db.Column(db.String(6), nullable=True)

class Vote(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    participant_id = db.Column(db.Integer, db.ForeignKey('participant.id'), nullable=False)
    score = db.Column(db.Integer, nullable=False)

@app.route('/api/admin/send-otp', methods=['POST'])
def send_otp():
    email = request.json.get('email')
    if email != 'gadiya.harsh@gmail.com':
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
    # For demonstration, we'll print it
    print(f"OTP for {email}: {otp}")

    smtp_server = "smtp.gmail.com"
    smtp_port = 587
    smtp_user = "gadiya.harsh@gmail.com"  # Replace with your Gmail address
    smtp_password = "hubgctbpqdxrxaaq"  # Replace with your Gmail password or app password

    subject = "Welcome to Mic Drop Portal!!"
    body = f"Your OTP code is: {otp}"

    # Create the email
    msg = MIMEMultipart()
    msg['From'] = smtp_user
    msg['To'] = email
    msg['Subject'] = subject
    msg.attach(MIMEText(body, 'plain'))
    
    # Send the email
    try:
        server = smtplib.SMTP(smtp_server, smtp_port)
        server.starttls()  # Secure the connection
        server.login(smtp_user, smtp_password)
        server.sendmail(smtp_user, email, msg.as_string())
        server.quit()
        # print("OTP sent successfully!")
        return jsonify({'message': 'OTP sent successfully'}), 200
        # return otp  # Return the OTP for verification purposes
    except Exception as e:
        # print(f"Failed to send OTP: {e}")
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
        smtp_user = "gadiya.harsh@gmail.com"  # Replace with your Gmail address
        smtp_password = "hubgctbpqdxrxaaq"  # Replace with your Gmail password or app password

        subject = "Welcome to Mic Drop Portal!!"
        body = f"Your OTP code is: {otp}"

        # Create the email
        msg = MIMEMultipart()
        msg['From'] = smtp_user
        msg['To'] = email
        msg['Subject'] = subject
        msg.attach(MIMEText(body, 'plain'))
    
        # Send the email
        try:
            server = smtplib.SMTP(smtp_server, smtp_port)
            server.starttls()  # Secure the connection
            server.login(smtp_user, smtp_password)
            server.sendmail(smtp_user, email, msg.as_string())
            server.quit()
            # print("OTP sent successfully!")
            return jsonify({'message': 'OTP sent successfully'}), 200
            #return otp  # Return the OTP for verification purposes
        except Exception as e:
            # print(f"Failed to send OTP: {e}")
            return jsonify({'message': 'OTP send failed'}), 400
    else:
        print(email,episode)
        coordinators = Coordinator.query.all()
        print([{
        'id': c.id,
        'name': c.name,
        'email': c.email,  # Changed to email
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
        'email': c.email,  # Changed to email
        'episode': c.episode
    } for c in coordinators])

@app.route('/api/admin/add-coordinator', methods=['POST'])
def add_coordinator():
    data = request.json
    new_coordinator = Coordinator(
        name=data['name'],
        email=data['email'],  # Changed to email
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
        participants = Participant.query.filter_by(episode=r.episode).all()
        participants_data = [{
            'id': p.id,
            'name': p.name,
            'category': p.category,
            'votes': p.votes,
            'avgScore': p.avg_score
        } for p in participants]
        
        result.append({
            'id': r.id,
            'episode': r.episode,
            'date': r.date,
            'totalKishores': r.totalKishores,
            'totalCategories': r.totalCategories,
            'participants': participants_data
        })
    return jsonify(result)


@app.route('/api/admin/export-report/<int:report_id>', methods=['GET'])
def export_report(report_id):
    report = Report.query.get(report_id)
    if not report:
        return jsonify({'message': 'Report not found'}), 404

    format = request.args.get('format')
    
    # Fetch participants for the report
    participants = Participant.query.filter_by(episode=report.episode).all()
    
    if format == 'xlsx':
        # Create main report data
        data = {
            'Episode': [report.episode],
            'Date': [report.date],
            'Total Kishores': [report.totalKishores],
            'Total Categories': [report.totalCategories]
        }
        
        # Create DataFrame for the main report
        df_report = pd.DataFrame(data)
        
        # Create DataFrame for participants
        participants_data = {
            'SNo.': [i+1 for i in range(len(participants))],
            'Participant Name': [p.name for p in participants],
            'Category': [p.category for p in participants],
            'Number of Votes': [p.votes for p in participants],
            'Average Score': [p.avg_score for p in participants]
        }
        df_participants = pd.DataFrame(participants_data)
        
        # Write to Excel
        output = io.BytesIO()
        with pd.ExcelWriter(output, engine='xlsxwriter') as writer:
            df_report.to_excel(writer, sheet_name='Report', index=False)
            df_participants.to_excel(writer, sheet_name='Participants', index=False)
        
        output.seek(0)
        return send_file(output, mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', as_attachment=True, attachment_filename='report.xlsx')

    elif format == 'pdf':
        pdf = FPDF()
        pdf.add_page()
        pdf.set_font("Arial", size=12)
        pdf.cell(200, 10, txt="Report", ln=True, align='C')
        
        # Add main report data
        pdf.ln(10)
        pdf.cell(200, 10, txt=f"Episode: {report.episode}", ln=True)
        pdf.cell(200, 10, txt=f"Date: {report.date}", ln=True)
        pdf.cell(200, 10, txt=f"Total Kishores: {report.totalKishores}", ln=True)
        pdf.cell(200, 10, txt=f"Total Categories: {report.totalCategories}", ln=True)
        
        # Add participants
        pdf.ln(10)
        pdf.cell(200, 10, txt="Participants:", ln=True)
        pdf.cell(200, 10, txt="SNo. | Name | Category | Votes | Avg Score", ln=True)
        
        for i, p in enumerate(participants):
            pdf.cell(200, 10, txt=f"{i+1} | {p.name} | {p.category} | {p.votes} | {p.avg_score:.2f}", ln=True)
        
        output = io.BytesIO()
        pdf.output(output)
        output.seek(0)
        
        return send_file(output, mimetype='application/pdf', as_attachment=True, attachment_filename='report.pdf')

    return jsonify({'message': 'Unsupported format'}), 400


@app.route('/api/coordinator/participants', methods=['GET'])
def get_participants():
    episode = request.args.get('episode')
    participants = Participant.query.filter_by(episode=episode).all()
    return jsonify([{
        'id': p.id,
        'name': p.name,
        'contact': p.contact,
        'category': p.category,
        'score' : p.avg_score    } for p in participants])

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

@app.route('/api/coordinator/start-contest', methods=['POST'])
def start_contest():
    data = request.json
    episode = data['episode']
    # Implement logic to start the contest
    return jsonify({'message': 'Contest started successfully'})

@app.route('/api/coordinator/reset-contest', methods=['POST'])
def reset_contest():
    data = request.json
    episode = data['episode']
    # Implement logic to reset the contest
    return jsonify({'message': 'Contest reset successfully'})

@app.route('/api/coordinator/start-scoring', methods=['POST'])
def start_scoring():
    data = request.json
    participant_id = data['participantId']
    episode = data['episode']
    # Fetch participant details and return scoring options
    participant = Participant.query.get(participant_id)
    # Simulating scoring options, modify as needed
    scoring_data = {
        'participantId': participant.id,
        'name': participant.name,
        'category': participant.category
    }
    return jsonify([scoring_data])

@app.route('/api/coordinator/submit-report', methods=['POST'])
def submit_report():
    data = request.json
    report = Report(
        episode=data['episode'],
        date=data['date'],
        participants=data['kishoresCount'],
        votes=0,  # Adjust based on actual scoring data
        averageScore=0  # Calculate based on actual scoring data
    )
    db.session.add(report)
    db.session.commit()
    return jsonify({'message': 'Report submitted successfully'})


@app.route('/api/scorer/contest-status', methods=['GET'])
def get_contest_status():
    episode = request.args.get('episode')
    # Check if contest has started for the episode and get participants
    participants = Participant.query.filter_by(episode=episode).all()
    return jsonify({
        'started': True,  # Replace with actual contest status check
        'participants': [{'id': p.id, 'name': p.name, 'category': p.category} for p in participants]
    })

@app.route('/api/scorer/submit-score', methods=['POST'])
def submit_score():
    data = request.json
    participant_id = data['participantId']
    score = data['score']
    # Implement logic to save score, ensure unique scoring per device
    return jsonify({'message': 'Score submitted successfully'})

voting_active = False
active_participant_id = -1

def deactivate_voting():
    global voting_active, active_participant_id
    voting_active = False
    active_participant_id = -1

@app.route('/admin/activate_voting', methods=['POST'])
def activate_voting():
    global voting_active, active_participant_id
    voting_active = True
    data = request.json
    active_participant_id = data.get('participant_id')
    # Set a timer to deactivate voting after 30 seconds
    timer = threading.Timer(30.0, deactivate_voting)
    timer.start()

    return jsonify({'message': 'Voting activated for 30 seconds'})

@app.route('/admin/voting_status', methods=['GET'])
def voting_status():
    return jsonify({
        'participant_id': active_participant_id
    })

@app.route('/vote', methods=['POST'])
def vote():
    if not voting_active:
        return jsonify({'message': 'Voting is not active'}), 403

    data = request.json
    participant_id = data.get('participant_id')
    score = data.get('score')

    vote = Vote(participant_id=participant_id, score=score)
    db.session.add(vote)
    participant = Participant.query.get(participant_id)
    if participant.vote_count==0:
        participant.avg_score=0
    if participant:
        participant.avg_score = (participant.avg_score * participant.vote_count + score) / (participant.vote_count + 1)
        participant.vote_count += 1
        db.session.commit()

        return jsonify({'message': 'Vote recorded'})
    else:
        return jsonify({'message': 'Participant not found'}), 404
    
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


