'use client'

import { useState } from 'react'
import DesignedCover from './DesignedCover'
import type { Book } from '@/lib/types'

type CoverBook = Pick<Book, 'title' | 'author' | 'category' | 'cover_url'>

/**
 * Renders a book cover image, gracefully falling back to the generated
 * DesignedCover when there is no cover_url OR when the remote image fails
 * to load (e.g. Google Drive returned no thumbnail). `referrerPolicy` is set
 * to "no-referrer" because Drive often refuses to serve thumbnails when a
 * referrer header is present.
 */
export default function BookCover({ book }: { book: CoverBook }) {
  const [failed, setFailed] = useState(false)

  if (book.cover_url && !failed) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={book.cover_url}
        alt={book.title}
        loading="lazy"
        referrerPolicy="no-referrer"
        onError={() => setFailed(true)}
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
    )
  }

  return <DesignedCover title={book.title} author={book.author} category={book.category} />
}
