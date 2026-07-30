import { useTranslation } from 'react-i18next';

const content = {
  privacy: {
    el: {
      title: 'Πολιτική Απορρήτου',
      updated: 'Τελευταία ενημέρωση: 30 Ιουλίου 2026',
      sections: [
        ['Ποια δεδομένα συλλέγουμε', 'Συλλέγουμε τα στοιχεία λογαριασμού και επικοινωνίας που μας παρέχετε, τις συμμετοχές σας σε projects, καθώς και τις παρατηρήσεις, αρχεία και δεδομένα τοποθεσίας που επιλέγετε να υποβάλετε. Για το newsletter αποθηκεύουμε τη διεύθυνση email σας.'],
        ['Γιατί τα χρησιμοποιούμε', 'Χρησιμοποιούμε τα δεδομένα για τη λειτουργία της πλατφόρμας, τη διαχείριση των ερευνητικών δράσεων, την επικοινωνία μαζί σας και, όταν έχετε συναινέσει, την αποστολή ενημερώσεων. Οι δημόσιες παρατηρήσεις εμφανίζονται χωρίς στοιχεία ταυτοποίησης του χρήστη.'],
        ['Αποθήκευση και ασφάλεια', 'Τα δεδομένα φιλοξενούνται μέσω του Supabase. Εφαρμόζουμε ελέγχους πρόσβασης και ιδιωτική αποθήκευση αρχείων. Διατηρούμε τα δεδομένα μόνο για όσο απαιτείται από τον σκοπό συλλογής και τις νόμιμες υποχρεώσεις μας.'],
        ['Τα δικαιώματά σας', 'Μπορείτε να ζητήσετε πρόσβαση, διόρθωση, διαγραφή, περιορισμό ή φορητότητα των δεδομένων σας και να ανακαλέσετε τη συγκατάθεσή σας. Για σχετικά αιτήματα επικοινωνήστε στο eu@katartisi.gr.'],
        ['Cookies', 'Η πλατφόρμα χρησιμοποιεί μόνο τις τεχνικά αναγκαίες λειτουργίες αποθήκευσης για τη σύνδεση και τις προτιμήσεις χρήσης.'],
      ],
    },
    en: {
      title: 'Privacy Policy',
      updated: 'Last updated: July 30, 2026',
      sections: [
        ['Data we collect', 'We collect account and contact details you provide, project memberships, and the observations, files, and location data you choose to submit. We store your email address when you subscribe to the newsletter.'],
        ['How we use it', 'We use data to operate the platform, manage research activities, communicate with you and, where you have consented, send updates. Public observations are displayed without user-identifying details.'],
        ['Storage and security', 'Data is hosted through Supabase. We apply access controls and private file storage. We retain data only as long as needed for its purpose and our legal obligations.'],
        ['Your rights', 'You may request access, correction, deletion, restriction, or portability of your data and withdraw consent. Contact eu@katartisi.gr for privacy requests.'],
        ['Cookies', 'The platform only uses technically necessary storage for authentication and user preferences.'],
      ],
    },
  },
  terms: {
    el: {
      title: 'Όροι Χρήσης',
      updated: 'Τελευταία ενημέρωση: 30 Ιουλίου 2026',
      sections: [
        ['Χρήση της πλατφόρμας', 'Η πλατφόρμα υποστηρίζει δράσεις συμμετοχικής επιστήμης. Με τη χρήση της αποδέχεστε τους παρόντες όρους και δεσμεύεστε να παρέχετε ακριβή στοιχεία και να προστατεύετε τα στοιχεία σύνδεσής σας.'],
        ['Υποβολές χρηστών', 'Διατηρείτε τα δικαιώματα επί του περιεχομένου σας. Μας παρέχετε την άδεια να το αποθηκεύουμε, να το επεξεργαζόμαστε και να δημοσιεύουμε ανωνυμοποιημένα ερευνητικά δεδομένα για τους σκοπούς του project στο οποίο συμμετέχετε.'],
        ['Μη επιτρεπτή χρήση', 'Απαγορεύεται η υποβολή παράνομου, παραπλανητικού ή επιβλαβούς περιεχομένου, η παραβίαση δικαιωμάτων τρίτων και κάθε προσπάθεια μη εξουσιοδοτημένης πρόσβασης ή διατάραξης της υπηρεσίας.'],
        ['Ακρίβεια και διαθεσιμότητα', 'Οι παρατηρήσεις των χρηστών ελέγχονται όπου είναι εφικτό, αλλά δεν εγγυόμαστε την πληρότητα ή ακρίβειά τους. Η υπηρεσία μπορεί να μεταβάλλεται ή να διακόπτεται προσωρινά για συντήρηση.'],
        ['Επικοινωνία', 'Για ερωτήσεις σχετικά με τους όρους επικοινωνήστε στο eu@katartisi.gr.'],
      ],
    },
    en: {
      title: 'Terms of Use',
      updated: 'Last updated: July 30, 2026',
      sections: [
        ['Using the platform', 'The platform supports citizen-science activities. By using it, you accept these terms and agree to provide accurate information and protect your login credentials.'],
        ['User submissions', 'You retain rights to your content. You grant us permission to store and process it and to publish anonymized research data for the purposes of the project you participate in.'],
        ['Prohibited use', 'You may not submit unlawful, misleading, or harmful content, infringe third-party rights, or attempt unauthorized access or disruption of the service.'],
        ['Accuracy and availability', 'User observations are reviewed where practical, but we do not guarantee their completeness or accuracy. The service may change or be temporarily unavailable for maintenance.'],
        ['Contact', 'For questions about these terms, contact eu@katartisi.gr.'],
      ],
    },
  },
};

const LegalPage = ({ type }) => {
  const { i18n } = useTranslation();
  const language = i18n.language.startsWith('en') ? 'en' : 'el';
  const page = content[type][language];

  return (
    <section className="section animate-fade-in">
      <div className="container" style={{ maxWidth: 860 }}>
        <h1>{page.title}</h1>
        <p style={{ color: 'var(--color-text-light)', marginBottom: '2.5rem' }}>{page.updated}</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {page.sections.map(([title, body]) => (
            <section key={title}>
              <h2 style={{ fontSize: '1.4rem', marginBottom: '0.6rem' }}>{title}</h2>
              <p style={{ lineHeight: 1.8, margin: 0 }}>{body}</p>
            </section>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LegalPage;
