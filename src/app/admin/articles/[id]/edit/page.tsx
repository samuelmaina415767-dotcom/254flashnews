import { createServerClientInstance } from '@/lib/supabase-server'
import { getArticleByIdAdmin } from '@/lib/articles'
import { ArticleEditor } from '@/components/admin/ArticleEditor'

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditArticlePage({ params }: Props) {
  const { id } = await params
  const supabase = await createServerClientInstance()

  const [article, { data: categories }, { data: tags }] = await Promise.all([
    getArticleByIdAdmin(id),
    supabase.from('categories').select('*').order('name'),
    supabase.from('tags').select('*').order('name'),
  ])

  return (
    <ArticleEditor
      article={article}
      categories={categories || []}
      tags={tags || []}
      mode="edit"
    />
  )
}
