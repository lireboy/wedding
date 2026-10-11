import mainImage from '../assets/images/main_image.webp'
import jaWort from '../assets/images/Das_ja_wort.webp'
import anschneiden from '../assets/images/anschneiden.webp'
import gruppe from '../assets/images/gruppe.webp'
import zweisamkeit from '../assets/images/zweisamkeit.webp'
import tanz from '../assets/images/tanz.webp'
import party from '../assets/images/party.webp'

// Hier später eure Namen, Texte und Bildpfade eintragen.
export const wedding = {
  names: 'Franzi & Timur',
  date: '11.09. - 12.09.2026',
  location: 'Hochzeitsvilla Zehlendorf & Kavaliershaus Caputh',
  heroImage: mainImage,
  day: [
    {
      title: 'Das Ja-Wort',
      icon: 'pi-heart',
      text: 'Text zur Trauung',
      image: jaWort,
      imageAlt: 'Franzi und Timur an ihrem Hochzeitstag',
      imagePosition: 'center center',
    },
    {
      title: 'Zeit für Kuchen',
      icon: 'pi-sun',
      text: 'Text zum Anstoßen und Feiern',
      image: anschneiden,
      imageAlt: 'Ein gemeinsamer Moment mit den Hochzeitsgästen',
      imagePosition: 'center 30%',
    },
    {
      title: 'Wir alle zusammen',
      icon: 'pi-sparkles',
      text: 'Text über das Essen und die Unterhaltung',
      image: gruppe,
      imageAlt: 'Franzi und Timur bei ihrer Hochzeitsfeier',
      imagePosition: 'center 60%',
    },
    {
      title: 'Zweisamkeit',
      icon: 'pi-moon',
      text: 'Text zum Tanz',
      image: zweisamkeit,
      imageAlt: 'Franzi und Timur in einer romantischen Moment',
      imagePosition: 'center 90%',
    },
    {
      title: 'Unser Tanz',
      icon: 'pi-moon',
      text: 'Text zum Tanz',
      image: tanz,
      imageAlt: 'Franzi und Timur beim Tanzen',
      imagePosition: 'center 75%',
    },
    {
      title: 'Party',
      icon: 'pi-moon',
      text: 'Text zum Tanz',
      image: party,
      imageAlt: 'Party mit allen Gästen',
      imagePosition: 'center 60%',
    },
  ],
}
export const navigation = [
  { id: 'start', label: 'Start' },
  { id: 'unser-tag', label: 'Unser Tag' },
  { id: 'gaestebereich', label: 'Für unsere Gäste' },
]
