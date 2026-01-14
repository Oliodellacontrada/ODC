import { createServerClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { FileText, Tags, Settings, Mail, FileEdit } from 'lucide-react'

export default async function AdminPage() {
  const supabase = createServerClient()
  
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session) {
    redirect('/admin/login')
  }

  const cards = [
    {
      title: 'Post',
      description: 'Crea e gestisci articoli del blog',
      href: '/admin/posts',
      icon: FileText,
      color: 'bg-olive-500',
    },
    {
      title: 'Tags',
      description: 'Gestisci le categorie degli articoli',
      href: '/admin/tags',
      icon: Tags,
      color: 'bg-sage-500',
    },
    {
      title: 'Pagine',
      description: 'Modifica Privacy e Cookie Policy',
      href: '/admin/pages',
      icon: FileEdit,
      color: 'bg-honey-500',
    },
    {
      title: 'Newsletter',
      description: 'Visualizza iscritti ed esporta lista',
      href: '/admin/newsletter',
      icon: Mail,
      color: 'bg-olive-600',
    },
    {
      title: 'Impostazioni',
      description: 'Logo, Hero e configurazione sito',
      href: '/admin/settings',
      icon: Settings,
      color: 'bg-sage-600',
    },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-olive-800 mb-8">
        Dashboard Admin
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card) => {
          const Icon = card.icon
          return (
            <Link
              key={card.href}
              href={card.href}
              className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow p-6 group"
            >
              <div className={`${card.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-olive-800 mb-2">
                {card.title}
              </h2>
              <p className="text-stone-600">
                {card.description}
              </p>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
