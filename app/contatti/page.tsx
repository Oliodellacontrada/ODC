import { Mail, Phone, MapPin, Leaf, HelpCircle, Heart, MessageCircle } from 'lucide-react'

export default function ContattiPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-olive-50/30 to-sage-50/30">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block px-6 py-2 bg-gradient-to-r from-olive-100 to-sage-100 rounded-full mb-4 border-2 border-olive-300">
            <span className="text-olive-700 font-semibold text-sm">Siamo qui per te</span>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-olive-800 to-olive-600 bg-clip-text text-transparent">
            Contatti
          </h1>
        </div>

        <div className="space-y-6">

          {/* Intro */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border-2 border-olive-200 p-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 bg-olive-100 rounded-xl">
                <Leaf className="w-6 h-6 text-olive-700" />
              </div>
              <h2 className="text-2xl font-bold text-olive-800">Olio della Contrada</h2>
            </div>
            <p className="text-stone-600 leading-relaxed">
              Hai domande sui nostri prodotti? Vuoi saperne di piu sulla nostra produzione di olio extravergine biologico? Siamo qui per aiutarti!
            </p>
          </div>

          {/* Come Raggiungerci */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border-2 border-olive-200 p-8">
            <div className="flex items-center gap-2 mb-6">
              <MessageCircle className="w-5 h-5 text-olive-600" />
              <h3 className="text-xl font-bold text-olive-800">Come Raggiungerci</h3>
            </div>
            <div className="space-y-4">
              <a href="mailto:oliodellacontrada@gmail.com" className="flex items-start gap-4 bg-olive-50 hover:bg-olive-100 transition-colors rounded-2xl p-4 group">
                <div className="p-2 bg-olive-200 rounded-lg mt-1 group-hover:bg-olive-300 transition-colors">
                  <Mail className="w-5 h-5 text-olive-800" />
                </div>
                <div>
                  <p className="font-semibold text-stone-800">Email</p>
                  <p className="text-olive-700">oliodellacontrada@gmail.com</p>
                  <p className="text-stone-500 text-sm mt-1">Rispondiamo solitamente entro 24-48 ore.</p>
                </div>
              </a>
              <a href="tel:3474160611" className="flex items-start gap-4 bg-olive-50 hover:bg-olive-100 transition-colors rounded-2xl p-4 group">
                <div className="p-2 bg-olive-200 rounded-lg mt-1 group-hover:bg-olive-300 transition-colors">
                  <Phone className="w-5 h-5 text-olive-800" />
                </div>
                <div>
                  <p className="font-semibold text-stone-800">Telefono</p>
                  <p className="text-olive-700">347 4160611</p>
                  <p className="text-stone-500 text-sm mt-1">Disponibili dal lunedi al venerdi, dalle 9:00 alle 18:00.</p>
                </div>
              </a>
              <div className="flex items-start gap-4 bg-olive-50 rounded-2xl p-4">
                <div className="p-2 bg-olive-200 rounded-lg mt-1">
                  <MapPin className="w-5 h-5 text-olive-800" />
                </div>
                <div>
                  <p className="font-semibold text-stone-800">Dove Siamo</p>
                  <p className="text-stone-700">Famiglia Longo — Contrada Vespano 1</p>
                  <p className="text-stone-700">87030 Cleto (CS) — Calabria, Italia</p>
                  <p className="text-stone-500 text-sm mt-1">Il nostro uliveto si trova nella splendida vallata del fiume Savuto, a circa 300 metri sul livello del mare, tra le colline calabresi affacciate sul Mar Tirreno.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Perche non ci trovi online */}
          <div className="bg-gradient-to-br from-amber-50 to-olive-50 rounded-3xl shadow-lg border-2 border-amber-200 p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-olive-200 rounded-lg">
                <Leaf className="w-5 h-5 text-olive-800" />
              </div>
              <h3 className="text-xl font-bold text-olive-800">Perche non ci trovi online</h3>
            </div>
            <p className="text-stone-600 leading-relaxed italic">
              Non troverai Olio della Contrada sui social media. Abbiamo scelto di restare lontani dal rumore del web per restare vicini a cio che conta davvero: la terra, le persone, il tempo lento dell ulivo. Se vuoi conoscerci, chiamaci, scrivici, o vieni a trovarci tra i nostri ulivi. Una stretta di mano vale piu di mille like.
            </p>
          </div>

          {/* FAQ */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border-2 border-olive-200 p-8">
            <div className="flex items-center gap-2 mb-6">
              <HelpCircle className="w-5 h-5 text-olive-600" />
              <h3 className="text-xl font-bold text-olive-800">Domande Frequenti</h3>
            </div>
            <div className="space-y-4">
              {[
                ['Fate consegne a domicilio?', 'Contattaci per informazioni su ordini e spedizioni.'],
                ['E possibile visitare l uliveto?', 'Siamo felici di accogliere visitatori! Scrivici per organizzare una visita.'],
                ['Producete solo olio extravergine?', 'Si, ci dedichiamo esclusivamente alla produzione di olio EVO biologico monocultivar Carolea.'],
              ].map(([q, a]) => (
                <div key={q} className="bg-stone-50 rounded-2xl p-4 border-l-4 border-olive-400">
                  <p className="font-semibold text-stone-800">{q}</p>
                  <p className="text-stone-600 text-sm mt-1">{a}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Ti aspettiamo */}
          <div className="bg-gradient-to-br from-olive-600 to-olive-700 rounded-3xl shadow-xl p-8 text-center text-white">
            <div className="flex justify-center mb-3">
              <Heart className="w-7 h-7" style={{color: '#FF2800', fill: '#FF2800'}} />
            </div>
            <h3 className="text-2xl font-bold mb-2">Ti aspettiamo!</h3>
            <p className="text-olive-100 leading-relaxed">
              Non esitare a contattarci per qualsiasi informazione. Saremo felici di raccontarti la storia del nostro olio e della nostra terra.
            </p>
          </div>

        </div>
      </div>
    </div>
  )
}
