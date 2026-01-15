import dynamic from 'next/dynamic'

const UnsubscribeClient = dynamic(() => import('./UnsubscribeClient'), {
  ssr: false,
})

export default function UnsubscribePage() {
  return <UnsubscribeClient />
}
