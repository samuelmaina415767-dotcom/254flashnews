import { createServerClientInstance } from '@/lib/supabase-server'
import { ArticleEditor } from '@/components/admin/ArticleEditor'

export default async function NewArticlePage() {
  const supabase = await createServerClientInstance()

  const [{ data: categories }, { data: tags }] = await Promise.all([
    supabase.from('categories').select('*').order('name'),
    supabase.from('tags').select('*').order('name'),
  ])

  return (
    <ArticleEditor
      article={null}
      categories={categories || []}
      tags={tags || []}
      mode="create"
    />
  )
}
