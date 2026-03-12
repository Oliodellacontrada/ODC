import { Leaf, Cog, Mountain, TreeDeciduous, Users, Mail, Phone } from 'lucide-react'

export default function ChiSiamoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-olive-50/30 to-sage-50/30">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block px-6 py-2 bg-gradient-to-r from-olive-100 to-sage-100 rounded-full mb-4 border-2 border-olive-300">
            <span className="text-olive-700 font-semibold text-sm">La nostra storia</span>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-olive-800 to-olive-600 bg-clip-text text-transparent">
            Chi Siamo
          </h1>
        </div>

        <div className="space-y-6">

          {/* Famiglia Longo */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border-2 border-olive-200 p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-olive-100 rounded-xl">
                <Users className="w-6 h-6 text-olive-700" />
              </div>
              <h2 className="text-2xl font-bold text-olive-800">La Famiglia Longo e la Tradizione</h2>
            </div>
            <p className="text-stone-600 leading-relaxed">
              La famiglia Longo produce olio extravergine d'oliva biologico seguendo la tradizione e il rispetto per la natura. Il nostro olio EVO nasce dal frutto dell'olivo attraverso processi produttivi che preservano la qualita e l'autenticita del prodotto: raccolta, lavaggio, frangitura, gramolatura e centrifugazione.
            </p>
          </div>

          {/* Il Nostro Olio */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border-2 border-olive-200 p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-olive-100 rounded-xl">
                <Leaf className="w-6 h-6 text-olive-700" />
              </div>
              <h2 className="text-2xl font-bold text-olive-800">Il Nostro Olio</h2>
            </div>
            <p className="text-stone-600 leading-relaxed">
              L'olio viene ottenuto da olive con leggera invaiatura, quel momento perfetto in cui il frutto passa dal verde ai primi segni di maturazione giallo, marroncino e violaceo. Il risultato e un sapore leggermente fruttato e piccante, che caratterizza l'olio extravergine di qualita superiore.
            </p>
          </div>

          {/* Metodo di Produzione */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border-2 border-olive-200 p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-olive-100 rounded-xl">
                <Cog className="w-6 h-6 text-olive-700" />
              </div>
              <h2 className="text-2xl font-bold text-olive-800">Metodo di Produzione</h2>
            </div>
            <p className="text-stone-600 leading-relaxed">
              Dopo la spremitura, l'olio viene conservato in recipienti di acciaio inox 18/10 e lasciato decantare naturalmente. Scegliamo di non filtrare il nostro olio: questo lo rende leggermente opaco, ma mantiene intatti colore, sapore e valori nutrizionali nel tempo.
            </p>
          </div>

          {/* Il Territorio */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border-2 border-olive-200 p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-olive-100 rounded-xl">
                <Mountain className="w-6 h-6 text-olive-700" />
              </div>
              <h2 className="text-2xl font-bold text-olive-800">Il Territorio</h2>
            </div>
            <p className="text-stone-600 leading-relaxed">
              Le nostre piante di ulivo, molte delle quali secolari, crescono in Calabria, nel comune di Cleto (provincia di Cosenza), in Contrada Vespano. Il nostro uliveto si trova in una fascia collinare a circa 300 metri sopra il livello del mare, nella vallata del fiume Savuto, esposta a sud e accarezzata dalla fresca brezza del Mar Tirreno. Questo microclima unico contribuisce alle caratteristiche distintive del nostro olio.
            </p>
          </div>

          {/* La Cultivar Carolea */}
          <div className="bg-gradient-to-br from-amber-50 to-olive-50 rounded-3xl shadow-lg border-2 border-amber-200 p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-olive-200 rounded-xl">
                <TreeDeciduous className="w-6 h-6 text-olive-800" />
              </div>
              <h2 className="text-2xl font-bold text-olive-800">La Cultivar Carolea</h2>
            </div>
            <p className="text-stone-600 leading-relaxed">
              Il nostro e un olio monocultivar Carolea, varieta tipica e autoctona della Calabria. La Carolea e nota per produrre un olio di alta qualita, con note fruttate e un caratteristico pizzicore al palato che testimonia la presenza di preziosi polifenoli antiossidanti.
            </p>
          </div>

          {/* I Produttori */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border-2 border-olive-200 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-olive-100 rounded-xl">
                <Users className="w-6 h-6 text-olive-700" />
              </div>
              <h2 className="text-2xl font-bold text-olive-800">I Produttori</h2>
            </div>
            <p className="text-stone-700 font-semibold mb-1">Gino &amp; Andrea Longo</p>
            <p className="text-stone-500 mb-6">Contrada Vespano 1 — 87030 Cleto (CS), Calabria</p>
            <div className="space-y-3">
              <a href="mailto:oliodellacontrada@gmail.com" className="flex items-start gap-4 bg-olive-50 hover:bg-olive-100 transition-colors rounded-2xl p-4 group">
                <div className="p-2 bg-olive-200 rounded-lg group-hover:bg-olive-300 transition-colors">
                  <Mail className="w-5 h-5 text-olive-800" />
                </div>
                <div>
                  <p className="font-semibold text-stone-800">Email</p>
                  <p className="text-olive-700">oliodellacontrada@gmail.com</p>
                </div>
              </a>
              <a href="tel:3474160611" className="flex items-start gap-4 bg-olive-50 hover:bg-olive-100 transition-colors rounded-2xl p-4 group">
                <div className="p-2 bg-olive-200 rounded-lg group-hover:bg-olive-300 transition-colors">
                  <Phone className="w-5 h-5 text-olive-800" />
                </div>
                <div>
                  <p className="font-semibold text-stone-800">Telefono</p>
                  <p className="text-olive-700">347 4160611</p>
                </div>
              </a>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
