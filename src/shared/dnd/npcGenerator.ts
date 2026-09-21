import { RACES } from './races'

const FIRST_NAMES = [
  'Aldric',
  'Branwen',
  'Cyrus',
  'Delara',
  'Eamon',
  'Fenna',
  'Garrick',
  'Hilde',
  'Ivar',
  'Josta',
  'Kellan',
  'Liora',
  'Magnus',
  'Nessa',
  'Osric',
  'Perrin',
  'Quenna',
  'Roderic',
  'Seraphine',
  'Toren',
  'Ulla',
  'Varrick',
  'Wren',
  'Yorick',
  'Zara'
]

const SURNAMES = [
  'Ateşbıçak',
  'Karataş',
  'Yelkovan',
  'Demirkol',
  'Gölgeavcı',
  'Kırağı',
  'Baltacı',
  'Sisrüzgarı',
  'Altınyürek',
  'Kurtdişi',
  'Nehirkızı',
  'Kayaburun',
  'Ejderyara',
  'Gecefısıltısı',
  'Meşealev'
]

const OCCUPATIONS = [
  'Demirci',
  'Meyhaneci',
  'Tüccar',
  'Muhafız',
  'Balıkçı',
  'Şifacı',
  'Kütüphaneci',
  'Serseri',
  'Rahip',
  'Avcı',
  'Denizci',
  'Çiftçi',
  'Kaşif',
  'Casus',
  'Suikastçı',
  'Saray Mensubu',
  'Falcı',
  'Madenci'
]

const PERSONALITY_TRAITS = [
  'Herkese karşı aşırı nazik ama gözleri yalan söylediğini ele veriyor',
  'Her cümlesine eski bir atasözü sıkıştırıyor',
  'Sürekli para sayıyor, asla gözünü ayırmıyor',
  'Fısıldayarak konuşuyor, sanki biri dinliyormuş gibi',
  'Herkesi eski bir tanıdığına benzetiyor',
  'Çok gururlu, en ufak hakarette bile düelloya davet ediyor',
  'Sürekli gülümsüyor, hatta kötü haberlerde bile',
  'Her şeyi abartarak anlatıyor',
  'Sessiz ve gözlemci, nadiren konuşuyor',
  'Yabancılara karşı aşırı meraklı, çok soru soruyor'
]

const QUIRKS = [
  'Sağ elinde eksik bir parmak var',
  'Boynunda garip bir muska taşıyor',
  'Bir gözü camdan',
  'Sürekli bir kuşla konuşuyor',
  'Elinde her zaman yarım bırakılmış bir örgü var',
  'Tuhaf bir aksanla konuşuyor, kökeni belirsiz',
  'Kendi gölgesinden korkuyor gibi davranıyor',
  'Cebinde hep bir zar taşıyor, gerginleşince oynuyor',
  'Sırtında eski bir yara izi var, hikayesini anlatmıyor',
  'Kediler ondan hep kaçıyor'
]

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

export interface GeneratedNpc {
  name: string
  raceName: string
  occupation: string
  trait: string
  quirk: string
}

export function generateNpc(): GeneratedNpc {
  const race = pick(RACES)
  return {
    name: `${pick(FIRST_NAMES)} ${pick(SURNAMES)}`,
    raceName: race.name,
    occupation: pick(OCCUPATIONS),
    trait: pick(PERSONALITY_TRAITS),
    quirk: pick(QUIRKS)
  }
}

export function formatNpcBody(npc: GeneratedNpc): string {
  return `Irk: ${npc.raceName}\nMeslek: ${npc.occupation}\n\nKişilik: ${npc.trait}\n\nÖzellik: ${npc.quirk}`
}
