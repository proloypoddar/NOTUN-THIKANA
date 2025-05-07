import { NextRequest } from 'next/server';
import { initSocketServer, NextApiResponseWithSocket } from '@/lib/socket';

export async function GET(req: NextRequest, res: NextApiResponseWithSocket) {
  // Initialize Socket.io server
  initSocketServer(req as any, res);
  
  // Return a response to acknowledge the socket connection
  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
