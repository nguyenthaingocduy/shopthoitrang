export default async (req, event) => {
    const allowedIP = '192.168.1.3'; // Thay bằng IP cố định của bạn
    const clientIP = req.headers.get('x-forwarded-for') || req.ip;
  
    if (clientIP !== allowedIP) {
      return new Response('Forbidden', { status: 403 });
    }
    return new Response(null, { status: 200 });
  };
  