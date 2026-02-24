import { NextResponse } from 'next/server';
import { generateTemplateCsv } from '@/lib/csv-import';

export async function GET() {
  const csv = generateTemplateCsv();
  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=UTF-8',
      'Content-Disposition': 'attachment; filename="msgscore_import_template.csv"',
    },
  });
}
