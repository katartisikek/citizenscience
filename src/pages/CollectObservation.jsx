import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { CheckCircle, ArrowLeft, Upload } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { hasDataType } from '../lib/dataTypes';
import {
  ProfileSection,
  ParticipationSection,
  ObservationSection,
  GeoSection,
  TemporalSection,
  PhotosSection,
  VideosSection,
  AudioSection,
  MeasurementsSection,
  SensorsSection,
  QuestionnaireSection,
  CitizenReportSection,
  SpeciesSection,
  ClassificationSection,
  FilesSection,
  AnalysisSection,
  EducationSection,
  EvaluationSection,
  GdprSection,
} from '../components/collect/CollectSections';

const nowLocalInput = () => {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
};

const CollectObservation = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { projects, addObservation, uploadFile, joinProject, updateProfileFields } = useData();
  const { user, profile, refreshProfile } = useAuth();

  const project = projects.find((p) => String(p.id) === String(id));
  const enabled = (typeId) => hasDataType(project, typeId);

  const [profileData, setProfileData] = useState({});
  const [participation, setParticipation] = useState({ present: true });
  const [observation, setObservation] = useState({});
  const [temporal, setTemporal] = useState({ observed_at: nowLocalInput() });
  const [questionnaire, setQuestionnaire] = useState({});
  const [citizenReport, setCitizenReport] = useState({});
  const [species, setSpecies] = useState({});
  const [classification, setClassification] = useState({});
  const [measurements, setMeasurements] = useState([{ name: '', value: '', unit: '' }]);
  const [sensors, setSensors] = useState({});
  const [sensorCsv, setSensorCsv] = useState(null);
  const [analysis, setAnalysis] = useState({});
  const [analysisPdf, setAnalysisPdf] = useState(null);
  const [education, setEducation] = useState({});
  const [evaluation, setEvaluation] = useState({});
  const [consent, setConsent] = useState(false);

  const [photoFiles, setPhotoFiles] = useState([]);
  const [photoPreviews, setPhotoPreviews] = useState([]);
  const [videoFiles, setVideoFiles] = useState([]);
  const [audioFiles, setAudioFiles] = useState([]);
  const [docFiles, setDocFiles] = useState([]);

  const [location, setLocation] = useState(null);
  const [locLoading, setLocLoading] = useState(false);
  const [locError, setLocError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setLocError('Το GPS δεν υποστηρίζεται από τη συσκευή σας.');
      setLocLoading(false);
      return;
    }
    setLocLoading(true);
    setLocError('');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
          altitude: pos.coords.altitude,
        });
        setLocLoading(false);
      },
      () => {
        setLocError('Δεν ήταν δυνατή η λήψη θέσης. Ενεργοποιήστε το GPS και δοκιμάστε ξανά.');
        setLocLoading(false);
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 }
    );
  };

  useEffect(() => {
    if (project && enabled('geo')) requestLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project?.id]);

  useEffect(() => {
    if (profile) {
      setProfileData({
        full_name: profile.full_name || '',
        area: profile.area || '',
        phone: '',
        interests: '',
      });
    }
  }, [profile]);

  useEffect(() => {
    return () => {
      photoPreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [photoPreviews]);

  const handlePhotos = (files) => {
    photoPreviews.forEach((url) => URL.revokeObjectURL(url));
    setPhotoFiles(files);
    setPhotoPreviews(files.map((f) => URL.createObjectURL(f)));
  };

  const uploadMany = async (files, folder) => {
    const urls = [];
    for (const file of files) {
      urls.push(await uploadFile(file, user.id, folder));
    }
    return urls;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    if (enabled('gdpr') && !consent) {
      setError('Απαιτείται συγκατάθεση GDPR για την υποβολή.');
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      const media = { photos: [], videos: [], audio: [], files: [] };

      if (enabled('photos') && photoFiles.length) {
        media.photos = await uploadMany(photoFiles, 'photos');
      }
      if (enabled('videos') && videoFiles.length) {
        media.videos = await uploadMany(videoFiles, 'videos');
      }
      if (enabled('audio') && audioFiles.length) {
        media.audio = await uploadMany(audioFiles, 'audio');
      }
      if (enabled('files') && docFiles.length) {
        media.files = await uploadMany(docFiles, 'files');
      }

      let sensorCsvUrl = null;
      if (enabled('sensors') && sensorCsv) {
        sensorCsvUrl = await uploadFile(sensorCsv, user.id, 'files');
      }
      let analysisPdfUrl = null;
      if (enabled('analysis') && analysisPdf) {
        analysisPdfUrl = await uploadFile(analysisPdf, user.id, 'files');
      }

      if (enabled('profile') && (profileData.full_name || profileData.area)) {
        await updateProfileFields(user.id, {
          full_name: profileData.full_name || profile?.full_name,
          area: profileData.area || profile?.area,
        });
        refreshProfile?.();
      }

      if (enabled('participation')) {
        await joinProject(project.id, user.id);
      }

      const data = {};
      if (enabled('profile')) data.profile = profileData;
      if (enabled('participation')) data.participation = participation;
      if (enabled('observation')) data.observation = observation;
      if (enabled('temporal')) data.temporal = temporal;
      if (enabled('questionnaire')) data.questionnaire = questionnaire;
      if (enabled('citizen_report')) data.citizen_report = citizenReport;
      if (enabled('species')) data.species = species;
      if (enabled('classification')) {
        data.classification = {
          ...classification,
          tags: (classification.tags || '').split(',').map((t) => t.trim()).filter(Boolean),
        };
      }
      if (enabled('measurements')) {
        data.measurements = (measurements || []).filter((m) => m.name || m.value);
      }
      if (enabled('sensors')) {
        data.sensors = { ...sensors, csv_url: sensorCsvUrl };
      }
      if (enabled('analysis')) {
        data.analysis = { ...analysis, pdf_url: analysisPdfUrl };
      }
      if (enabled('education')) data.education = education;
      if (enabled('evaluation')) data.evaluation = evaluation;
      if (media.photos.length || media.videos.length || media.audio.length || media.files.length) {
        data.media = media;
      }
      if (enabled('gdpr')) {
        data.consent = true;
        data.consent_at = new Date().toISOString();
      }
      if (enabled('metadata') || enabled('geo')) {
        data.metadata = {
          captured_at: new Date().toISOString(),
          user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
          app_version: '1.0.0',
          gps_accuracy: location?.accuracy ?? null,
          altitude: location?.altitude ?? null,
          sync_status: 'submitted',
        };
      }

      await addObservation({
        project_id: project.id,
        user_id: user.id,
        lat: enabled('geo') ? (location?.lat ?? null) : (location?.lat ?? null),
        lng: enabled('geo') ? (location?.lng ?? null) : (location?.lng ?? null),
        photo_url: media.photos[0] || null,
        data,
      });
      setDone(true);
    } catch (err) {
      setError(err.message || 'Σφάλμα υποβολής');
    } finally {
      setSubmitting(false);
    }
  };

  if (!project) {
    return (
      <div className="section text-center">
        <h1>Project δεν βρέθηκε</h1>
        <Link to="/projects" className="btn btn-primary mt-3">Πίσω</Link>
      </div>
    );
  }

  if (done) {
    return (
      <div className="section text-center collect-page">
        <CheckCircle size={64} color="var(--color-primary)" style={{ margin: '0 auto 1.5rem' }} />
        <h1>Η παρατήρηση υποβλήθηκε!</h1>
        <p className="text-lead" style={{ margin: '1rem auto 2rem' }}>
          Ευχαριστούμε για τη συμβολή σας στο {project.title}. Η παρατήρηση θα ελεγχθεί από την ομάδα μας.
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/profile" className="btn btn-primary">Προβολή Προφίλ</Link>
          <Link to={`/projects/${id}`} className="btn btn-outline">Πίσω στο Project</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in section collect-page">
      <div className="container collect-container">
        <Link to={`/projects/${id}`} className="collect-back">
          <ArrowLeft size={16} /> {project.title}
        </Link>

        <h1 className="collect-title">Καταγραφή Παρατήρησης</h1>
        <p className="collect-subtitle">{project.title}</p>

        {!user && (
          <div className="card collect-auth-banner">
            <p style={{ margin: 0 }}>Πρέπει να <Link to="/login">συνδεθείτε</Link> για να υποβάλετε παρατήρηση.</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="card collect-form">
          {enabled('profile') && (
            <ProfileSection value={profileData} onChange={setProfileData} profile={profile} />
          )}
          {enabled('participation') && (
            <ParticipationSection value={participation} onChange={setParticipation} />
          )}
          {enabled('geo') && (
            <GeoSection location={location} locLoading={locLoading} locError={locError} onRefresh={requestLocation} />
          )}
          {enabled('temporal') && (
            <TemporalSection value={temporal} onChange={setTemporal} />
          )}
          {enabled('observation') && (
            <ObservationSection value={observation} onChange={setObservation} />
          )}
          {enabled('species') && (
            <SpeciesSection value={species} onChange={setSpecies} />
          )}
          {enabled('citizen_report') && (
            <CitizenReportSection value={citizenReport} onChange={setCitizenReport} />
          )}
          {enabled('measurements') && (
            <MeasurementsSection value={measurements} onChange={setMeasurements} />
          )}
          {enabled('sensors') && (
            <SensorsSection value={sensors} onChange={setSensors} onCsv={setSensorCsv} />
          )}
          {enabled('questionnaire') && (
            <QuestionnaireSection
              schema={project.form_schema || []}
              value={questionnaire}
              onChange={setQuestionnaire}
            />
          )}
          {enabled('classification') && (
            <ClassificationSection value={classification} onChange={setClassification} />
          )}
          {enabled('photos') && (
            <PhotosSection files={photoFiles} previews={photoPreviews} onChange={handlePhotos} />
          )}
          {enabled('videos') && (
            <VideosSection files={videoFiles} onChange={setVideoFiles} />
          )}
          {enabled('audio') && (
            <AudioSection files={audioFiles} onChange={setAudioFiles} />
          )}
          {enabled('files') && (
            <FilesSection files={docFiles} onChange={setDocFiles} />
          )}
          {enabled('analysis') && (
            <AnalysisSection value={analysis} onChange={setAnalysis} onPdf={setAnalysisPdf} />
          )}
          {enabled('education') && (
            <EducationSection value={education} onChange={setEducation} />
          )}
          {enabled('evaluation') && (
            <EvaluationSection value={evaluation} onChange={setEvaluation} />
          )}
          {enabled('gdpr') && (
            <GdprSection checked={consent} onChange={setConsent} />
          )}

          {error && <p className="collect-error">{error}</p>}

          <div className="collect-submit-bar">
            <button type="submit" className="btn btn-primary collect-submit" disabled={submitting || !user}>
              <Upload size={16} /> {submitting ? 'Υποβολή...' : 'Υποβολή Παρατήρησης'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CollectObservation;
