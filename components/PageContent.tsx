'use client'

export default function PageContent({ content }: { content: string }) {
  return (
    <div 
      className="page-content"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  )
}
