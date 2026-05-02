import { NextRequest, NextResponse } from 'next/server';

const API_BASE = 'http://20.207.122.201/evaluation-service';
const TOKEN = process.env.NEXT_PUBLIC_ACCESS_TOKEN;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const limit = searchParams.get('limit');
    const page = searchParams.get('page');
    const notification_type = searchParams.get('notification_type');

    const query = new URLSearchParams();
    if (limit) query.append('limit', limit);
    if (page) query.append('page', page);
    if (notification_type) query.append('notification_type', notification_type);

    const url = `${API_BASE}/notifications${
      query.toString() ? '?' + query.toString() : ''
    }`;

    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
      cache: 'no-store',
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `API error: ${res.status}` },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);

  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Internal server error' },
      { status: 500 }
    );
  }
}