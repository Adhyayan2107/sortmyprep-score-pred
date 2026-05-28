import { NextRequest, NextResponse } from 'next/server'

/*
 * One-time setup — Google Sheets via Apps Script:
 *
 * 1. Open your Google Sheet → Extensions → Apps Script
 * 2. Paste this function and save:
 *
 *   function doPost(e) {
 *     const d = JSON.parse(e.postData.contents);
 *     SpreadsheetApp.getActiveSpreadsheet().getActiveSheet().appendRow([
 *       d.timestamp, d.email, d.board, d.score,
 *       d.university, d.course, d.verdict, d.source
 *     ]);
 *     return ContentService.createTextOutput('ok');
 *   }
 *
 * 3. Deploy → New deployment → Web app → Anyone → Deploy → copy URL
 * 4. Add to .env.local:  WAITLIST_WEBHOOK_URL=https://script.google.com/macros/s/YOUR_ID/exec
 */

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}))

  const payload = {
    timestamp:  new Date().toISOString(),
    email:      body.email      ?? '',
    board:      body.board      ?? '',
    score:      body.score      ?? '',
    university: body.university ?? '',
    course:     body.course     ?? '',
    verdict:    body.verdict    ?? '',
    source:     body.source     ?? 'app',
  }

  const webhookUrl = process.env.WAITLIST_WEBHOOK_URL
  if (webhookUrl) {
    try {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
    } catch (err) {
      console.error('[waitlist] webhook error:', err)
    }
  } else {
    console.log('[waitlist] WAITLIST_WEBHOOK_URL not set. Submission:', payload)
  }

  return NextResponse.json({ ok: true })
}
