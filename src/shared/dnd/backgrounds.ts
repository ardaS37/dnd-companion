import type { BackgroundInfo } from './types'

export const BACKGROUNDS: BackgroundInfo[] = [
  {
    id: 'soldier',
    name: 'Asker',
    skillProficiencies: ['Atletizm', 'Yıldırma'],
    feature: 'Askeri Rütbe',
    featureDescription: 'Aynı ordudan askerler seni tanır ve yardımına koşar, basit ihtiyaçlarını karşılar.'
  },
  {
    id: 'acolyte',
    name: 'Papaz Yamağı',
    skillProficiencies: ['İçgörü', 'Din'],
    feature: 'Mabet Sığınağı',
    featureDescription: 'Kendi inancındaki mabetlerde ücretsiz barınma ve iyileşme yardımı alabilirsin.'
  },
  {
    id: 'criminal',
    name: 'Suçlu',
    skillProficiencies: ['Kandırma', 'Gizlenme'],
    feature: 'Suç İletişim Ağı',
    featureDescription: 'Şehirdeki suç örgütleriyle iletişim kurup haber alabilir, mesaj iletebilirsin.'
  },
  {
    id: 'folk-hero',
    name: 'Halk Kahramanı',
    skillProficiencies: ['Hayvan İdaresi', 'Hayatta Kalma'],
    feature: 'Köylü Misafirperverliği',
    featureDescription: 'Sıradan halk seni korur, saklar ve elinden geldiğince (silah tutmadan) yardım eder.'
  },
  {
    id: 'sage',
    name: 'Bilge',
    skillProficiencies: ['Büyü Bilgisi', 'Tarih'],
    feature: 'Araştırmacı',
    featureDescription: 'Bilmediğin bir bilgiyi nerede/kimde bulabileceğini genelde bilirsin.'
  }
]
