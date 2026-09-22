import { Link } from 'react-router-dom';
import { Target, Award, ShieldCheck, GraduationCap, Backpack } from 'lucide-react';
import '../../kids.css'; 

const KidsHome = () => {
  return (
    <div style={{ backgroundColor: '#F8FAFC', minHeight: 'calc(100vh - 80px)', paddingBottom: '80px' }}>
      
      {/* Modern Image-based Hero Section */}
      <div style={{
        position: 'relative',
        borderRadius: '0 0 48px 48px',
        overflow: 'hidden',
        marginBottom: '60px',
        boxShadow: '0 10px 30px rgba(108, 99, 255, 0.15)',
        minHeight: '400px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '40px 20px'
      }}>
        {/* Background Image */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'url(/assets/kids_banner_nature.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: 0
        }} />
        
        {/* Gradient Overlay for better text readability */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(180deg, rgba(30, 41, 59, 0.4) 0%, rgba(30, 41, 59, 0.8) 100%)',
          zIndex: 1
        }} />
        
        {/* Hero Content */}
        <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
             <img src="/assets/kids_mascot_hero.jpg" alt="Mascot" style={{ width: '100px', height: '100px', borderRadius: '50%', border: '4px solid white', boxShadow: '0 8px 16px rgba(0,0,0,0.2)' }} />
          </div>
          <h1 style={{ fontFamily: "'Fredoka', cursive", fontSize: '3.5rem', color: 'white', margin: '0 0 16px 0', textShadow: '0 4px 8px rgba(0,0,0,0.4)' }}>
            Citizen Science Kids
          </h1>
          <p style={{ color: '#FFE66D', fontFamily: "'Quicksand', sans-serif", fontWeight: 700, margin: 0, fontSize: '1.3rem', lineHeight: '1.5', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
            Ανακάλυψε τη φύση της Κρήτης, γίνε μικρός επιστήμονας <br/> και κέρδισε απίθανα βραβεία!
          </p>
        </div>
      </div>

      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 20px' }}>
        
        {/* Features Section */}
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h2 style={{ fontFamily: "'Fredoka', cursive", fontSize: '2.2rem', color: '#1E293B', marginBottom: '16px' }}>Τι είναι το CS Kids;</h2>
          <p style={{ fontSize: '1.1rem', color: '#64748B', lineHeight: '1.6', maxWidth: '700px', margin: '0 auto 40px auto' }}>
            Μια διαδραστική πλατφόρμα όπου τα σχολεία και οι μαθητές συνεργάζονται για να μελετήσουν τη βιοποικιλότητα της Κρήτης μέσα από πραγματικές παρατηρήσεις στη φύση.
          </p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px' }}>
             <div className="kids-card" style={{ padding: '32px 24px', textAlign: 'center', backgroundColor: 'white', border: 'none', boxShadow: '0 8px 24px rgba(108, 99, 255, 0.08)' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '20px', backgroundColor: '#F0F4FF', color: '#6C63FF', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto' }}>
                  <Target size={32} />
                </div>
                <h3 style={{ fontFamily: "'Fredoka', cursive", fontSize: '1.4rem', color: '#1E293B', marginBottom: '12px' }}>Αποστολές</h3>
                <p style={{ fontSize: '1rem', color: '#64748B', margin: 0, lineHeight: '1.5' }}>Συμμετοχή σε ειδικά σχεδιασμένες αποστολές για καταγραφή φυτών και ζώων στο περιβάλλον μας.</p>
             </div>
             
             <div className="kids-card" style={{ padding: '32px 24px', textAlign: 'center', backgroundColor: 'white', border: 'none', boxShadow: '0 8px 24px rgba(46, 204, 113, 0.08)' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '20px', backgroundColor: '#E8FAEF', color: '#2ECC71', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto' }}>
                  <Award size={32} />
                </div>
                <h3 style={{ fontFamily: "'Fredoka', cursive", fontSize: '1.4rem', color: '#1E293B', marginBottom: '12px' }}>Βραβεία</h3>
                <p style={{ fontSize: '1rem', color: '#64748B', margin: 0, lineHeight: '1.5' }}>Οι μαθητές και τα σχολεία κερδίζουν πόντους και ξεκλειδώνουν ψηφιακά παράσημα περιβάλλοντος.</p>
             </div>
             
             <div className="kids-card" style={{ padding: '32px 24px', textAlign: 'center', backgroundColor: 'white', border: 'none', boxShadow: '0 8px 24px rgba(255, 159, 67, 0.08)' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '20px', backgroundColor: '#FFF5EB', color: '#FF9F43', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto' }}>
                  <ShieldCheck size={32} />
                </div>
                <h3 style={{ fontFamily: "'Fredoka', cursive", fontSize: '1.4rem', color: '#1E293B', marginBottom: '12px' }}>Ασφάλεια</h3>
                <p style={{ fontSize: '1rem', color: '#64748B', margin: 0, lineHeight: '1.5' }}>Απόλυτη προστασία προσωπικών δεδομένων (Privacy-First) με χρήση μοναδικών ψευδώνυμων (aliases).</p>
             </div>
          </div>
        </div>

        {/* Login Selection */}
        <div style={{ textAlign: 'center', marginTop: '80px' }}>
          <h2 style={{ fontFamily: "'Fredoka', cursive", fontSize: '2.2rem', color: '#1E293B', marginBottom: '30px' }}>
            Επιλέξτε πώς θα συνδεθείτε
          </h2>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', flexWrap: 'wrap' }}>
            <Link to="/teacher/login" style={{ textDecoration: 'none' }}>
              <div className="kids-card kids-animate-pop" style={{ 
                width: '320px', 
                padding: '40px 30px', 
                textAlign: 'center', 
                backgroundColor: 'white',
                border: '2px solid transparent',
                boxShadow: '0 12px 32px rgba(0,0,0,0.05)',
                transition: 'all 0.3s ease',
              }}
              onMouseOver={(e) => { e.currentTarget.style.borderColor = '#6C63FF'; e.currentTarget.style.transform = 'translateY(-8px)'; e.currentTarget.style.boxShadow = '0 16px 40px rgba(108, 99, 255, 0.15)'; }}
              onMouseOut={(e) => { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.05)'; }}
              >
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#F0F4FF', color: '#6C63FF', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px auto' }}>
                  <GraduationCap size={40} />
                </div>
                <h3 style={{ fontFamily: "'Fredoka', cursive", fontSize: '1.6rem', color: '#1E293B', margin: '0 0 12px 0' }}>Εκπαιδευτικός</h3>
                <p style={{ color: '#64748B', fontSize: '1rem', margin: '0 0 24px 0', lineHeight: '1.5' }}>Διαχειριστείτε τις τάξεις, τους μαθητές και εγκρίνετε τις παρατηρήσεις τους.</p>
                <span className="kids-btn kids-btn-primary" style={{ width: '100%', display: 'inline-block', padding: '14px', fontSize: '1.1rem' }}>Πύλη Εκπαιδευτικών</span>
              </div>
            </Link>

            <Link to="/kids/login" style={{ textDecoration: 'none' }}>
              <div className="kids-card kids-animate-pop" style={{ 
                width: '320px', 
                padding: '40px 30px', 
                textAlign: 'center', 
                backgroundColor: 'white',
                border: '2px solid transparent',
                boxShadow: '0 12px 32px rgba(0,0,0,0.05)',
                transition: 'all 0.3s ease',
              }}
              onMouseOver={(e) => { e.currentTarget.style.borderColor = '#2ECC71'; e.currentTarget.style.transform = 'translateY(-8px)'; e.currentTarget.style.boxShadow = '0 16px 40px rgba(46, 204, 113, 0.15)'; }}
              onMouseOut={(e) => { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.05)'; }}
              >
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#E8FAEF', color: '#2ECC71', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px auto' }}>
                  <Backpack size={40} />
                </div>
                <h3 style={{ fontFamily: "'Fredoka', cursive", fontSize: '1.6rem', color: '#1E293B', margin: '0 0 12px 0' }}>Μαθητής</h3>
                <p style={{ color: '#64748B', fontSize: '1rem', margin: '0 0 24px 0', lineHeight: '1.5' }}>Ξεκινήστε τις αποστολές, συλλέξτε δεδομένα και κερδίστε βραβεία!</p>
                <span className="kids-btn kids-btn-success" style={{ width: '100%', display: 'inline-block', padding: '14px', fontSize: '1.1rem', backgroundColor: '#2ECC71' }}>Είσοδος Μαθητή</span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KidsHome;
