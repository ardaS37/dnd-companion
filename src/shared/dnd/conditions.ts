export interface ConditionInfo {
  id: string
  name: string
  description: string
}

export const CONDITIONS: ConditionInfo[] = [
  { id: 'blinded', name: 'Kör', description: 'Göremez, saldırıları dezavantajlı; ona yapılan saldırılar avantajlı.' },
  { id: 'charmed', name: 'Büyülenmiş', description: 'Büyüleyeni saldıramaz; büyüleyenin sosyal atışları avantajlı.' },
  { id: 'deafened', name: 'Sağır', description: 'Duyamaz, işitmeye dayalı kontroller otomatik başarısız.' },
  { id: 'frightened', name: 'Korkmuş', description: 'Korku kaynağı görüş alanındayken dezavantajlı, ona yaklaşamaz.' },
  { id: 'grappled', name: 'Yakalanmış', description: 'Hızı 0 olur, yakalayan hareket ettirmedikçe hareket edemez.' },
  { id: 'incapacitated', name: 'Aciz', description: 'Aksiyon veya tepki alamaz.' },
  { id: 'invisible', name: 'Görünmez', description: 'Görülemez; saldırıları avantajlı, ona yapılanlar dezavantajlı.' },
  { id: 'paralyzed', name: 'Felçli', description: 'Aciz, hareket edemez/konuşamaz; ona yapılan yakın saldırılar otomatik kritik.' },
  { id: 'petrified', name: 'Taşlaşmış', description: 'Taşa dönüşür, aciz olur, hasara direnç kazanır.' },
  { id: 'poisoned', name: 'Zehirlenmiş', description: 'Saldırı ve yetenek atışlarında dezavantajlı.' },
  { id: 'prone', name: 'Yerde', description: 'Sadece sürünerek hareket edebilir; yakın saldırılar ona avantajlı, uzak saldırılar dezavantajlı.' },
  { id: 'restrained', name: 'Kısıtlanmış', description: 'Hızı 0, saldırıları dezavantajlı; ona yapılan saldırılar avantajlı.' },
  { id: 'stunned', name: 'Sersemlemiş', description: 'Aciz, hareket edemez, konuşması kesik kesik; ona yapılan saldırılar avantajlı.' },
  { id: 'unconscious', name: 'Baygın', description: 'Aciz, hareket edemez, farkında değil; yakın saldırılar ona otomatik kritik.' },
  { id: 'exhaustion-1', name: 'Bitkinlik 1', description: 'Yetenek kontrollerinde dezavantaj.' }
]

export const EXHAUSTION_EFFECTS: string[] = [
  'Etkisiz',
  'Yetenek kontrollerinde dezavantaj',
  'Hız yarıya iner',
  'Saldırı ve kurtarma zarlarında dezavantaj',
  'Maksimum HP yarıya iner',
  'Hız 0 olur',
  'Ölüm'
]
