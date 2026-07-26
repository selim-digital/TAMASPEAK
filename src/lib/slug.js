/**
 * Identifiant stable d'un mot amazigh — « Azul fell-ak » → « azul-fell-ak ».
 *
 * Sert à la fois de nom de fichier pour les mp3 (`public/audio/`) et de clé
 * pour les contributions audio (IndexedDB). Il vit dans son propre module
 * pour que `audio.js` et `speakerVoice.js` puissent tous deux s'en servir
 * sans former de cycle d'imports.
 */
export function slug(word) {
  return word
    .toLowerCase()
    // lettres propres au kabyle, translittérées pour les noms de fichiers
    .replace(/ɣ/g, 'gh')
    .replace(/ɛ/g, 'e')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // enlève les accents
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
