export interface Event {
  id: string;
  title: { en: string; kn: string };
  date: string; // YYYY-MM-DD
  tithi: { en: string; kn: string };
  location: string;
  isMajor: boolean;
}

export const EVENT_DATA: Event[] = [
  {
    id: '1',
    title: { en: 'Bhavisameera Vaibhavotsava', kn: 'ಭಾವಿಸಮೀರ ವೈಭವೋತ್ಸವ' },
    date: '2026-03-23',
    tithi: { en: 'Phalguna Shudha Panchami', kn: 'ಫಾಲ್ಗುಣ ಶುದ್ಧ ಪಂಚಮಿ' },
    location: 'Sri Kshetra Hoovinakere',
    isMajor: true,
  },
  {
    id: '2',
    title: { en: 'Sode Aradhana Mahotsava', kn: 'ಸೋದೆ ಆರಾಧನಾ ಮಹೋತ್ಸವ' },
    date: '2026-02-15',
    tithi: { en: 'Magha Shudha Navami', kn: 'ಮಾಘ ಶುದ್ಧ ನವಮಿ' },
    location: 'Sode Kshetra',
    isMajor: true,
  },
  {
    id: '3',
    title: { en: 'Ekadashi', kn: 'ಏಕಾದಶಿ' },
    date: '2026-02-28',
    tithi: { en: 'Phalguna Krishna Ekadashi', kn: 'ಫಾಲ್ಗುಣ ಕೃಷ್ಣ ಏಕಾದಶಿ' },
    location: 'All Branches',
    isMajor: false,
  },
];
