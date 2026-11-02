import type { NoticeMessage } from '../hooks/useNotice'
import './Notice.css'

type NoticeProps = {
  notice: NoticeMessage | null
}

/** The live region stays mounted so screen readers announce each message added to it. */
export function Notice({ notice }: NoticeProps) {
  return (
    <div className="notice-region" role="status">
      {notice && (
        <p className="notice">
          {notice.text}
          {notice.link && (
            <>
              {' '}
              <a className="notice__link" href={notice.link}>
                {notice.link}
              </a>
            </>
          )}
        </p>
      )}
    </div>
  )
}
