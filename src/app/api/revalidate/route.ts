import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret')

  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  revalidatePath('/')
  revalidatePath('/posts/[slug]', 'page')
  revalidatePath('/sklep')
  revalidatePath('/sklep/[slug]', 'page')

  return NextResponse.json({ revalidated: true })
}
