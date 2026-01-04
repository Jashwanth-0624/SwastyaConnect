import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Patient from '../models/Patient.js';
import ABDMRecord from '../models/ABDMRecord.js';
import MedicalAlert from '../models/MedicalAlert.js';
import ClinicalSummary from '../models/ClinicalSummary.js';
import DrugInteraction from '../models/DrugInteraction.js';
import EmergencyHealthData from '../models/EmergencyHealthData.js';
import ConsentRecord from '../models/ConsentRecord.js';
import MedicalDocument from '../models/MedicalDocument.js';
import PredictiveAnalytic from '../models/PredictiveAnalytic.js';
import TelemedSession from '../models/TelemedSession.js';
import DemoRequest from '../models/DemoRequest.js';
import FeatureInterest from '../models/FeatureInterest.js';
import QRCode from 'qrcode';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const addSampleData = async () => {
  try {
    await connectDB();

    // Clear existing data (optional - comment out if you want to keep existing data)
    console.log('Clearing existing data...');
    await Patient.deleteMany({});
    await ABDMRecord.deleteMany({});
    await MedicalAlert.deleteMany({});
    await ClinicalSummary.deleteMany({});
    await DrugInteraction.deleteMany({});
    await EmergencyHealthData.deleteMany({});
    await ConsentRecord.deleteMany({});
    await MedicalDocument.deleteMany({});
    await PredictiveAnalytic.deleteMany({});
    await TelemedSession.deleteMany({});
    await DemoRequest.deleteMany({});
    await FeatureInterest.deleteMany({});

    console.log('Adding sample patients...');
    
    // Create Patients
    const patients = await Patient.insertMany([
      {
        full_name: 'Rajesh Kumar',
        date_of_birth: new Date('1985-05-15'),
        gender: 'male',
        blood_group: 'O+',
        phone: '+91 98765 43210',
        email: 'rajesh.kumar@email.com',
        address: '123 MG Road, Bangalore, Karnataka',
        emergency_contact: '+91 98765 43211',
        allergies: ['Penicillin', 'Dust'],
        chronic_conditions: ['Hypertension', 'Type 2 Diabetes'],
        current_medications: [
          { name: 'Metformin', dosage: '500mg', frequency: 'Twice daily' },
          { name: 'Amlodipine', dosage: '5mg', frequency: 'Once daily' }
        ],
        past_surgeries: ['Appendectomy (2010)'],
        unified_patient_id: 'UPI-001'
      },
      {
        full_name: 'Priya Sharma',
        date_of_birth: new Date('1992-08-22'),
        gender: 'female',
        blood_group: 'B+',
        phone: '+91 98765 43220',
        email: 'priya.sharma@email.com',
        address: '456 Park Street, Mumbai, Maharashtra',
        emergency_contact: '+91 98765 43221',
        allergies: ['Latex'],
        chronic_conditions: ['Asthma'],
        current_medications: [
          { name: 'Salbutamol', dosage: '100mcg', frequency: 'As needed' },
          { name: 'Montelukast', dosage: '10mg', frequency: 'Once daily' }
        ],
        past_surgeries: [],
        unified_patient_id: 'UPI-002'
      },
      {
        full_name: 'Amit Patel',
        date_of_birth: new Date('1978-11-30'),
        gender: 'male',
        blood_group: 'A+',
        phone: '+91 98765 43230',
        email: 'amit.patel@email.com',
        address: '789 Nehru Nagar, Delhi',
        emergency_contact: '+91 98765 43231',
        allergies: ['Peanuts', 'Shellfish'],
        chronic_conditions: ['Coronary Artery Disease', 'High Cholesterol'],
        current_medications: [
          { name: 'Atorvastatin', dosage: '20mg', frequency: 'Once daily' },
          { name: 'Aspirin', dosage: '75mg', frequency: 'Once daily' },
          { name: 'Clopidogrel', dosage: '75mg', frequency: 'Once daily' }
        ],
        past_surgeries: ['CABG (2019)'],
        unified_patient_id: 'UPI-003'
      },
      {
        full_name: 'Sneha Reddy',
        date_of_birth: new Date('1995-03-18'),
        gender: 'female',
        blood_group: 'AB+',
        phone: '+91 98765 43240',
        email: 'sneha.reddy@email.com',
        address: '321 Tech Park, Hyderabad, Telangana',
        emergency_contact: '+91 98765 43241',
        allergies: [],
        chronic_conditions: ['Hypothyroidism'],
        current_medications: [
          { name: 'Levothyroxine', dosage: '50mcg', frequency: 'Once daily' }
        ],
        past_surgeries: [],
        unified_patient_id: 'UPI-004'
      },
      {
        full_name: 'Vikram Singh',
        date_of_birth: new Date('1989-07-25'),
        gender: 'male',
        blood_group: 'O-',
        phone: '+91 98765 43250',
        email: 'vikram.singh@email.com',
        address: '654 Sector 15, Chandigarh',
        emergency_contact: '+91 98765 43251',
        allergies: ['Sulfa drugs'],
        chronic_conditions: ['Migraine'],
        current_medications: [
          { name: 'Sumatriptan', dosage: '50mg', frequency: 'As needed' }
        ],
        past_surgeries: ['Knee Surgery (2021)'],
        unified_patient_id: 'UPI-005'
      }
    ]);

    console.log(`Created ${patients.length} patients`);

    // Create ABDM Records
    console.log('Adding ABDM records...');
    const abdmRecords = await ABDMRecord.insertMany([
      {
        patient_id: patients[0]._id.toString(),
        abdm_health_id: 'rajesh.kumar@abdm',
        abha_number: '12345678901234',
        phr_address: 'rajesh.kumar@sbx',
        link_status: 'linked',
        verification_status: 'verified',
        last_sync: new Date(),
        linked_facilities: ['SwasthyaConnect Hospital', 'Apollo Bangalore', 'AIIMS Delhi']
      },
      {
        patient_id: patients[1]._id.toString(),
        abdm_health_id: 'priya.sharma@abdm',
        abha_number: '23456789012345',
        phr_address: 'priya.sharma@sbx',
        link_status: 'linked',
        verification_status: 'verified',
        last_sync: new Date(),
        linked_facilities: ['SwasthyaConnect Hospital', 'Fortis Mumbai']
      },
      {
        patient_id: patients[2]._id.toString(),
        abdm_health_id: 'amit.patel@abdm',
        abha_number: '34567890123456',
        phr_address: 'amit.patel@sbx',
        link_status: 'pending',
        verification_status: 'pending',
        last_sync: null,
        linked_facilities: []
      }
    ]);
    console.log(`Created ${abdmRecords.length} ABDM records`);

    // Create Medical Alerts
    console.log('Adding medical alerts...');
    const alerts = await MedicalAlert.insertMany([
      {
        patient_id: patients[0]._id.toString(),
        alert_type: 'abnormal_vitals',
        severity: 'high',
        title: 'Elevated Blood Pressure',
        message: 'Patient blood pressure reading: 150/95 mmHg (Normal: <120/80)',
        vital_type: 'blood_pressure',
        value: '150/95',
        normal_range: '<120/80',
        status: 'active'
      },
      {
        patient_id: patients[0]._id.toString(),
        alert_type: 'lab_result',
        severity: 'medium',
        title: 'High Blood Glucose',
        message: 'Fasting blood glucose: 145 mg/dL (Normal: 70-100)',
        vital_type: 'blood_glucose',
        value: '145',
        normal_range: '70-100',
        status: 'active'
      },
      {
        patient_id: patients[2]._id.toString(),
        alert_type: 'medication_conflict',
        severity: 'critical',
        title: 'Drug Interaction Warning',
        message: 'Potential interaction between Atorvastatin and Clopidogrel',
        status: 'active'
      },
      {
        patient_id: patients[1]._id.toString(),
        alert_type: 'abnormal_vitals',
        severity: 'low',
        title: 'Low Peak Flow',
        message: 'Peak flow reading below normal range',
        vital_type: 'peak_flow',
        value: '280',
        normal_range: '350-500',
        status: 'acknowledged',
        acknowledged_by: 'Dr. Smith',
        acknowledged_at: new Date()
      }
    ]);
    console.log(`Created ${alerts.length} medical alerts`);

    // Create Clinical Summaries
    console.log('Adding clinical summaries...');
    const summaries = await ClinicalSummary.insertMany([
      {
        patient_id: patients[0]._id.toString(),
        summary_text: 'Patient presents with well-controlled hypertension and diabetes. Current medications are effective. Regular monitoring recommended.',
        diagnoses: ['Hypertension', 'Type 2 Diabetes'],
        lab_results_summary: 'HbA1c: 7.2%, Blood pressure stable on current medication',
        medications_summary: 'Metformin 500mg BID, Amlodipine 5mg OD',
        risk_score: 45,
        risk_factors: ['Age', 'Multiple chronic conditions', 'Medication compliance'],
        generated_date: new Date(),
        last_visit_date: new Date('2024-01-15')
      },
      {
        patient_id: patients[2]._id.toString(),
        summary_text: 'Post-CABG patient with stable cardiac function. On dual antiplatelet therapy. Regular cardiac follow-up essential.',
        diagnoses: ['Coronary Artery Disease', 'Status Post CABG'],
        lab_results_summary: 'Lipid panel within target, cardiac enzymes normal',
        medications_summary: 'Atorvastatin 20mg, Aspirin 75mg, Clopidogrel 75mg',
        risk_score: 65,
        risk_factors: ['Previous cardiac surgery', 'Multiple cardiac medications', 'Age'],
        generated_date: new Date(),
        last_visit_date: new Date('2024-01-20')
      }
    ]);
    console.log(`Created ${summaries.length} clinical summaries`);

    // Create Drug Interactions
    console.log('Adding drug interactions...');
    const interactions = await DrugInteraction.insertMany([
      {
        patient_id: patients[2]._id.toString(),
        drug_name: 'Warfarin',
        interaction_type: 'drug_drug',
        severity: 'major',
        interacting_with: 'Aspirin',
        description: 'Increased risk of bleeding when taken together',
        clinical_effects: 'May cause excessive bleeding, bruising',
        recommendations: 'Monitor INR closely, consider alternative anticoagulant',
        status: 'active'
      },
      {
        patient_id: patients[0]._id.toString(),
        drug_name: 'Penicillin',
        interaction_type: 'drug_allergy',
        severity: 'contraindicated',
        interacting_with: 'Known allergy',
        description: 'Patient has documented allergy to Penicillin',
        clinical_effects: 'Risk of severe allergic reaction',
        recommendations: 'Avoid all penicillin derivatives, use alternative antibiotics',
        status: 'active'
      }
    ]);
    console.log(`Created ${interactions.length} drug interactions`);

    // Create Emergency Health Data with QR Codes
    console.log('Adding emergency health data...');
    const emergencyData = [];
    for (let i = 0; i < 3; i++) {
      const qrData = JSON.stringify({
        patient_id: patients[i]._id.toString(),
        blood_group: patients[i].blood_group,
        allergies: patients[i].allergies,
        emergency_contact: patients[i].emergency_contact
      });
      const qrCodeUrl = await QRCode.toDataURL(qrData);
      
      emergencyData.push({
        patient_id: patients[i]._id.toString(),
        qr_code_data: qrData,
        qr_code_url: qrCodeUrl,
        blood_group: patients[i].blood_group,
        allergies: patients[i].allergies,
        current_medications: patients[i].current_medications.map(m => m.name),
        chronic_conditions: patients[i].chronic_conditions,
        past_surgeries: patients[i].past_surgeries,
        emergency_contact: patients[i].emergency_contact,
        generated_at: new Date(),
        access_count: 0
      });
    }
    await EmergencyHealthData.insertMany(emergencyData);
    console.log(`Created ${emergencyData.length} emergency health records`);

    // Create Consent Records
    console.log('Adding consent records...');
    const consents = await ConsentRecord.insertMany([
      {
        patient_id: patients[0]._id.toString(),
        requester_name: 'Dr. Anjali Mehta',
        requester_email: 'anjali.mehta@hospital.com',
        data_types: ['medical_history', 'lab_results', 'prescriptions'],
        purpose: 'Continuity of care during transfer',
        consent_status: 'approved',
        valid_from: new Date(),
        valid_until: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
        approved_by: patients[0].full_name,
        approved_at: new Date()
      },
      {
        patient_id: patients[1]._id.toString(),
        requester_name: 'Dr. Ramesh Kumar',
        requester_email: 'ramesh.kumar@clinic.com',
        data_types: ['all_records'],
        purpose: 'Second opinion consultation',
        consent_status: 'pending',
        valid_from: null,
        valid_until: null
      }
    ]);
    console.log(`Created ${consents.length} consent records`);

    // Create Predictive Analytics
    console.log('Adding predictive analytics...');
    const predictions = await PredictiveAnalytic.insertMany([
      {
        patient_id: patients[0]._id.toString(),
        prediction_type: 'readmission_risk',
        risk_score: 35,
        risk_level: 'moderate',
        contributing_factors: ['Multiple chronic conditions', 'Medication compliance', 'Age'],
        recommendations: ['Regular follow-up', 'Medication adherence counseling', 'Lifestyle modifications'],
        prediction_date: new Date(),
        model_version: 'v2.1',
        confidence_score: 85
      },
      {
        patient_id: patients[2]._id.toString(),
        prediction_type: 'readmission_risk',
        risk_score: 55,
        risk_level: 'high',
        contributing_factors: ['Previous cardiac surgery', 'Multiple medications', 'Complex medical history'],
        recommendations: ['Close monitoring', 'Cardiac rehabilitation', 'Regular ECG'],
        prediction_date: new Date(),
        model_version: 'v2.1',
        confidence_score: 90
      },
      {
        patient_id: patients[1]._id.toString(),
        prediction_type: 'disease_progression',
        risk_score: 25,
        risk_level: 'low',
        contributing_factors: ['Well-controlled condition', 'Good medication adherence'],
        recommendations: ['Continue current treatment', 'Regular monitoring'],
        prediction_date: new Date(),
        model_version: 'v2.1',
        confidence_score: 80
      }
    ]);
    console.log(`Created ${predictions.length} predictive analytics`);

    // Create Telemed Sessions
    console.log('Adding telemed sessions...');
    const sessions = await TelemedSession.insertMany([
      {
        patient_id: patients[0]._id.toString(),
        doctor_name: 'Dr. Anjali Mehta',
        doctor_email: 'anjali.mehta@hospital.com',
        session_status: 'completed',
        scheduled_time: new Date('2024-01-15T10:00:00'),
        duration_minutes: 30,
        chief_complaint: 'Routine follow-up for diabetes and hypertension',
        diagnosis: 'Type 2 Diabetes, Hypertension - Well controlled',
        prescriptions: [
          { medication: 'Metformin', dosage: '500mg', duration: '30 days' },
          { medication: 'Amlodipine', dosage: '5mg', duration: '30 days' }
        ],
        notes: 'Patient doing well on current medications. Continue same regimen.',
        follow_up_required: true,
        follow_up_date: new Date('2024-02-15'),
        meeting_link: 'https://meet.swasthyaconnect.in/123456'
      },
      {
        patient_id: patients[1]._id.toString(),
        doctor_name: 'Dr. Ramesh Kumar',
        doctor_email: 'ramesh.kumar@clinic.com',
        session_status: 'scheduled',
        scheduled_time: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        duration_minutes: 45,
        chief_complaint: 'Asthma management review',
        meeting_link: 'https://meet.swasthyaconnect.in/123457'
      }
    ]);
    console.log(`Created ${sessions.length} telemed sessions`);

    // Create Demo Requests
    console.log('Adding demo requests...');
    await DemoRequest.insertMany([
      {
        full_name: 'Dr. Sanjay Verma',
        email: 'sanjay.verma@hospital.com',
        phone: '+91 98765 11111',
        organization: 'City General Hospital',
        role: 'doctor',
        interested_features: ['AI Clinical Summary Generator', 'Predictive Analytics Dashboard'],
        message: 'Interested in implementing AI-powered clinical summaries',
        status: 'pending'
      },
      {
        full_name: 'Ms. Kavita Desai',
        email: 'kavita.desai@clinic.com',
        phone: '+91 98765 22222',
        organization: 'Wellness Clinic',
        role: 'admin',
        interested_features: ['ABDM Compatibility', 'Telemedicine Integration'],
        message: 'Need ABDM integration for our clinic',
        status: 'contacted'
      }
    ]);
    console.log('Created demo requests');

    // Create Feature Interests
    console.log('Adding feature interests...');
    await FeatureInterest.insertMany([
      {
        feature_name: 'AI Clinical Summary Generator',
        user_email: 'doctor@hospital.com',
        interest_level: 'very_interested',
        notes: 'This would save significant time in documentation'
      },
      {
        feature_name: 'Predictive Analytics Dashboard',
        user_email: 'admin@hospital.com',
        interest_level: 'need_urgently',
        notes: 'Critical for improving patient outcomes'
      }
    ]);
    console.log('Created feature interests');

    console.log('\n✅ Sample data added successfully!');
    console.log(`\nSummary:`);
    console.log(`- Patients: ${patients.length}`);
    console.log(`- ABDM Records: ${abdmRecords.length}`);
    console.log(`- Medical Alerts: ${alerts.length}`);
    console.log(`- Clinical Summaries: ${summaries.length}`);
    console.log(`- Drug Interactions: ${interactions.length}`);
    console.log(`- Emergency Health Data: ${emergencyData.length}`);
    console.log(`- Consent Records: ${consents.length}`);
    console.log(`- Predictive Analytics: ${predictions.length}`);
    console.log(`- Telemed Sessions: ${sessions.length}`);
    console.log(`- Demo Requests: 2`);
    console.log(`- Feature Interests: 2`);

    process.exit(0);
  } catch (error) {
    console.error('Error adding sample data:', error);
    process.exit(1);
  }
};

addSampleData();

